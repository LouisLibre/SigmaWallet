import path from 'path';
import webpack from 'webpack';

export default {
  entry: './ergo_lib_prebundled.js',
  output: {
    filename: 'ergo_lib_bundle.js',
    path: path.resolve('./', 'dist'),
    clean: true,
    webassemblyModuleFilename: 'ergo_lib_wasm_bg.wasm',
    publicPath: '', // Explicitly disable publicPath
  },
  experiments: {
    asyncWebAssembly: true,
  },
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin({
      TextDecoder: ['text-encoding', 'TextDecoder'], // Provide TextDecoder polyfill
      TextEncoder: ['text-encoding', 'TextEncoder'], // Provide TextEncoder polyfill
    }),
  ],
  // Disable runtime chunking or publicPath-related runtime
  optimization: {
    runtimeChunk: false, // Disable runtime chunk to minimize publicPath usage
  },
};
