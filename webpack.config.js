var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  mode: 'production',
  entry: {
    'epcyp': './src/jsx/index/index.jsx',
    'settings': './src/jsx/settings/settings.jsx',
    'favorite': './src/jsx/favorite/favorite.jsx',
    'main': ['@babel/polyfill', './src/main_process/main.js']
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    modules: [
      path.resolve('./src/'),
      'node_modules'
    ],
  },
  externals: [
    'electron',
    'fs',
    'ipc',
    'child_process',
    'axios',
    'electron-store',
    'electron-json-storage',
    'electron-load-devtool',
    'fix-path',
    'moment'
  ],
  plugins: [
    new WebpackNotifierPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-react-jsx', 'transform-class-properties']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'resolve-url-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader?mimetype=image/png'
        }
      }
    ]
  },
  performance: { hints: false }
};
