const path = require('path');

module.exports = {
  entry: ['./src/main.js', './src/main-guide.js'],
  output: {
    filename: 'lib.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, ''),
    },
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
};