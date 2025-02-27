# Sigma Wallet

Ergo Wallet built with React Native.

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version Used   | Notes                                                         |
| ----------- | -------------- | ------------------------------------------------------------- |
| Node.js     | v20.18.0       | [Download](https://nodejs.org/)                               |
| Rust        | 1.80.1         | [Installation Guide](https://www.rust-lang.org/tools/install) |
| Xcode       | 16.0 (16A242d) | Required for iOS development                                  |

## Getting Started

Follow these steps to set up and run the project:

### Installation

1. Install React Native dependencies:

   ```bash
   npm install
   ```

2. Install iOS dependencies:

   ```bash
   npx pod-install
   ```

3. Build ergo-lib bridge:
   ```bash
   npm run prebuild
   ```

### Running the App

1. Start the React Native Metro server:

   ```bash
   npm start
   ```

2. Run the app on iOS simulator:
   ```bash
   npm run ios
   ```

## Bridge Notes

The bridge handles communication between `ergo-lib-wasm` and `react-native-webview`, enabling Ergo's functionality inside React Native. The bridge is built during the prebuild process via `npm run prebuild`, which:

- Clones `@ergoplatform/sigma-rust/bindings/ergo-lib-wasm` to a temporary directory, then builds the Rust WASM, and bundles it with Webpack.
- Encodes the webpack bundle `ergo_lib_bundle.js` and `ergo_lib_wasm_bg.wasm` to base64 JSON files and copies them to `./ergo-lib/dist/`.
- This baase64 JSON files then get injected into the react-native-webview via `./src/ergo-lib-wrapper.js`

Communication:

React Native sends messages via `webViewRef.current.postMessage` for example `webViewRef.current.postMessage({ type: 'call', wasmClassName, wasmMethodName, args, id })`.

The bridge itself (in `./ergo-lib/bridge.js`) proxies the calls coming from react native, responding back with `{ type: 'response', id, result }` or `{ type: 'error', id, error }` via `window.ReactNativeWebView.postMessage`. The messages then get handled by the ReactNativeWebView `onMessage` callback.

Run `npm run prebuild` for any changes to `@ergoplatfrom/sigma-rust/ergo-lib-wasm` or `./ergo-lib/bridge.js`.
