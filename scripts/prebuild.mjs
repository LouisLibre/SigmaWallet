import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';

const tmp_dir = path.resolve('./', './tmp');
const tmp_build_dir = path.resolve(
  './',
  './tmp/bindings/ergo-lib-wasm/pkg-browser',
);

const ergo_lib_dir = path.resolve('./', './ergo-lib');
const ergo_lib_build_dir = path.resolve('./', './ergo-lib/dist');

try {
  // Clone or copy sigma-rust/ergo-lib-wasm (adjust path if local)
  console.log('Cloning sigma-rust/ergo-lib-wasm...');
  // Example: If sigma-rust is a git submodule or local directory
  // If not local, clone from Git (replace with your repo URL)
  if (!fs.existsSync(tmp_dir)) {
    execSync(
      `git clone https://github.com/ergoplatform/sigma-rust ${tmp_dir}`,
      {
        stdio: 'inherit',
      },
    );
  }

  // Build Rust WASM dependencies in temporary directory
  console.log('Building Rust WASM...');
  execSync(`cd ${tmp_dir}/bindings/ergo-lib-wasm && cargo build`, {
    stdio: 'inherit',
  });

  // Install NPM dependencies in temporary directory
  console.log('Installing NPM dependencies...');
  execSync(`cd ${tmp_dir}/bindings/ergo-lib-wasm  && npm install`, {
    stdio: 'inherit',
  });

  // Create PKG-BROWSER wasm in temporary directory
  console.log('Installing NPM dependencies...');
  execSync(`cd ${tmp_dir}/bindings/ergo-lib-wasm  && npm run build-browser`, {
    stdio: 'inherit',
  });

  // Copy Webpack files to temporary build directory
  const webpackFiles = ['bridge.js', 'webpack.config.js'];
  webpackFiles.forEach(file => {
    fs.copyFileSync(
      path.join(ergo_lib_dir, file),
      path.join(tmp_build_dir, file),
    );
  });

  // Install Webpack dependencies in temporary build directory
  console.log('Installing WEBPACK dependencies...');
  execSync(
    `cd ${tmp_build_dir} && npm install webpack webpack-cli html-webpack-plugin text-encoding --save-dev`,
    {stdio: 'inherit'},
  );

  // Run Webpack bundling in temporary build directory
  execSync(`cd ${tmp_build_dir} && npx webpack`, {stdio: 'inherit'});

  // Move Webpack outputs to dist/
  if (!fs.existsSync(ergo_lib_build_dir)) fs.mkdirSync(ergo_lib_build_dir);
  ['ergo_lib_bundle.js', 'ergo_lib_wasm_bg.wasm'].forEach(file => {
    const base64_encode_command = file.endsWith('.wasm')
      ? `node -e "fs.writeFileSync('${file}.base64.json', JSON.stringify({ wasmBase64: Buffer.from(fs.readFileSync('${file}')).toString('base64') }, null, 2), 'utf8')" --require fs`
      : `node -e "fs.writeFileSync('${file}.base64.json', JSON.stringify({ bundleBase64: Buffer.from(fs.readFileSync('${file}', 'utf8')).toString('base64') }, null, 2), 'utf8')" --require fs`;

    execSync(`cd ${tmp_build_dir}/dist && ${base64_encode_command}`, {
      stdio: 'inherit',
    });

    const source = path.join(tmp_build_dir, '/dist/', `${file}.base64.json`);
    if (fs.existsSync(source)) {
      fs.copyFileSync(
        source,
        path.join(ergo_lib_build_dir, `${file}.base64.json`),
      );
      console.log(`Moved ${file} to ${ergo_lib_build_dir}/`);
    }
  });

  // Clean up temporary directory (optional, keep for debugging or re-use)
  // fs.rmSync(tmpDir, { recursive: true });
  console.log('WASM build and bundling complete!');
} catch (error) {
  console.error('WASM build failed:', error.message);
  process.exit(1);
}
