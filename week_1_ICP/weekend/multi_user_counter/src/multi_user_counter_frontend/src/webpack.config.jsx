const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let localCanisters, prodCanisters, canisters;

function initCanisterIds() {
  try {
    localCanisters = require(path.resolve('.dfx', 'local', 'canister_ids.json'));
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve('canister_ids.json'));
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

  canisters = network === 'local' ? localCanisters : prodCanisters;

  for (const canister in canisters) {
    process.env[canister.toUpperCase() + '_CANISTER_ID'] =
      canisters[canister][network];
  }
}
initCanisterIds();

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    index: path.join(__dirname, 'src', 'index.jsx'),
  },
  devtool: isDevelopment ? 'source-map' : false,
  optimization: {
    minimize: !isDevelopment,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      MULTI_USER_COUNTER_BACKEND_CANISTER_ID: canisters['multi_user_counter_backend']
        ? canisters['multi_user_counter_backend'][
            process.env.DFX_NETWORK || 'local'
          ]
        : undefined,
    }),
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
    hot: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    liveReload: true,
  },
};
