const bundleJson = require('./../ergo-lib/dist/ergo_lib_bundle.js.base64.json');
const wasmJson = require('./../ergo-lib/dist/ergo_lib_wasm_bg.wasm.base64.json');

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
