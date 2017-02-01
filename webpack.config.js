var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    "pecalounge": './src/jsx/index/index.jsx',
    "settings": './src/jsx/settings/settings.jsx',
    "favorite": './src/jsx/favorite/favorite.jsx',
    "main": './src/main_process/main.js'
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
    root: [ path.resolve('./src/')]
  },
  externals: [
    'electron',
    'fs',
    'ipc',
    'child_process',
    'superagent',
    'electron-config',
    'electron-json-storage',
    'electron-load-devtool',
    'fix-path',
    'moment'
  ],
  plugins: [
    new WebpackNotifierPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ["transform-react-jsx"]
        }
      },
      {
        test: /\.jade$/,
        exclude: /node_modules/,
        loader: 'jade-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ["style-loader", "css-loader", "resolve-url-loader", "sass-loader"]
      },
      {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
      }
    ]
  },
};
