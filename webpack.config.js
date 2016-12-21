//webpack.config.js
module.exports = {
  entry: './src/jsx/index.jsx',
  output: {
    path: 'dist',
    filename: 'epcyp.js'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee', 'scss']
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        exclude: /node_modules/,
        loader: 'coffee-loader'
      },
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
