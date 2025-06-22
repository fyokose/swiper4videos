const path = require('path');
const fs = require('fs');
const { options } = require('marked');

module.exports = {
  entry: ['./src/wstest.js'],
  output: {
    filename: 'wstest.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    server: {
      type: 'https',
      options: {
        key: './cert/key.pem',
        cert: './cert/cert.pem',
      },
    },
    static: {
      directory: path.join(__dirname, ''),
    },
    port: 8080,
    allowedHosts: ['all'],
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