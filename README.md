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

The bridge with sigma-rust/ergo-lib-wasm gets built in the 'prebuild' process. This basically clones the sigma-rust project and builds it from scratch then the `bridge.js` file can expose any ergo_lib_wasm functions inside the file as well as making custom functions. THe communications with the bridge is handle via `webViewRef.current.postMessage` from the React Native side and `window.ReactNativeWebView.postMessage(response), window.addEventListener('message', handler)` from the bridge.js side. You must run `npm run prebuild` everytime you make a change to the bridge.

The bridge connects SigmaWallet with `ergo-lib-wasm` via `react-native-webview`, enabling Ergo blockchain functionality in React Native. It’s built during the 'prebuild' process via `npm run prebuild`, which:

- Clones/copies `@sigma-rust/bindings/ergo-lib-wasm` inside a `./tmp/` directory, then builds the Rust WASM, and bundles it with Webpack.
- Encodes `ergo_lib_bundle.js` and `ergo_lib_wasm_bg.wasm` to base64 JSON files in `./ergo-lib/dist/`.

Communication:
React Native sends messages via `webViewRef.current.postMessage` (e.g., { type: 'call', className, methodName, args, id }).

The bridge (in bridge.js, bundled to ergo_lib_bundle.js) proxies ergo-lib-wasm calls, responding with `{ type: 'response', id, result }` or `{ type: 'error', id, error }` via `window.ReactNativeWebView.postMessage`, handled by WebView’s `onMessage` callback.

Run `npm run prebuild` for any changes to sigma-rust/ergo-lib-wasm or index.js.
