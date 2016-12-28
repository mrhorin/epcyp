var path = require('path');

module.exports = {
  entry: {
    "epcyp": './src/jsx/index.jsx',
    "settings": './src/jsx/settings.jsx',
    "main": './src/js/main.js'
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
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
    'path',
    'electron-config'
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
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
};
