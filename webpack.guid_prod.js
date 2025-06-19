const path = require('path');

module.exports = {
  entry: './src/main-guide.js',
  output: {
    filename: 'lib_guide.js',
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