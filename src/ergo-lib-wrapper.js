// Make sure to first build the ergo-lib-wasm package to generate the bundle.js and ergo_lib_wasm_bg.wasm files.
// Steps:
// Go to the 'sigma-rust' project
// Then go to the bindings/ergo-lib-wasm directory
// Run 'cargo build' and 'npm install' and then 'npm run build-browser'
// Then go to the pkg-browser directory
// Prepare the files for the react-native-webview
//    - Beforehand I actually installed webpack in that directory lol
//    - npm install webpack webpack-cli html-webpack-plugin text-encoding --save-dev
//    - Added a webpack.config.js file ( the one there )
//    - Added a index.html file ( the one there )
//    - Added a index.js file ( the one there )
//    - Finally ran 'npx webpack'
//    - This generated the bundle.js and module.wasm file in the dist directory
//    - The files can't be loaded with require() in react-native so we have to base64 encode them
/*    - I used the following command to base64 encode the files
          node -e "fs.writeFileSync('bundle.base64.json', JSON.stringify({ bundleBase64: Buffer.from(fs.readFileSync('bundle.js', 'utf8')).toString('base64') }, null, 2), 'utf8')" --require fs
          node -e "fs.writeFileSync('ergo_lib_wasm_bg.base64.json', JSON.stringify({ wasmBase64: Buffer.from(fs.readFileSync('ergo_lib_wasm_bg.wasm')).toString('base64') }, null, 2), 'utf8')" --require fs
*/
const bundleJson = require('./../ergo-lib/bundle.js.base64.json'); // Load JSON with bundle base64
const wasmJson = require('./../ergo-lib/ergo_lib_wasm_bg.wasm.base64.json'); // Load JSON with base64
const base64Bundle = bundleJson.bundleBase64;
const base64Wasm = wasmJson.wasmBase64;
const webContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <h1>Sigma Wallet</h1>
        <script>
            // Inject WASM binary as base64
            const originalConsoleLog = console.log;
            console.log = function(...args) {
                originalConsoleLog.apply(console, args); // Keep web console logging
                const message = JSON.stringify({ type: 'log', data: args });
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(message);
                }
            };
            const wasmBase64 = '${base64Wasm}';
            const wasmBytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
            const wasmResponse = new Response(wasmBytes, { headers: { 'Content-Type': 'application/wasm' } });

            // Override fetch to supply the WASM binary
            const originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                if (url.endsWith('ergo_lib_wasm_bg.wasm')) { // Match the fixed filename
                    return wasmResponse;
                }
                return originalFetch(url, options);
            };

            // Ensure Webpack runtime doesn’t try to use publicPath
            if (typeof __webpack_public_path__ !== 'undefined') {
                __webpack_public_path__ = ''; // Explicitly set publicPath to empty
            }
            window.ReactNativeWebView.postMessage("WASM Loaded!")
        </script>
        <script>
            // Decode base64 bundle.js and execute it
            window.ReactNativeWebView.postMessage("Loading bundle!");
            try {
            const bundleBase64 = '${base64Bundle}';
            const bundleJs = atob(bundleBase64);
            eval(bundleJs); // Execute decoded bundle.js in web context
            console.log('Ergo WASM Demo loaded');
            } catch (error) {
              window.ReactNativeWebView.postMessage(error);
            }
        </script>
    </body>
    </html>
`;

module.exports = webContent; // Use module.exports for CommonJS
