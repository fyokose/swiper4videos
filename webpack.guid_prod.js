const path = require('path');

module.exports = {
  entry: './src/guide.js',
  output: {
    filename: 'guide_lib.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
};