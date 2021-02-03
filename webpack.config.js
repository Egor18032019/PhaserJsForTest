const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [{
      test: /\.(js|jsx|ts)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    },

    {
      test: /\.(gif|png|jpe?g|svg|xml)$/i,
      use: 'file-loader',
    },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],

  devServer: {
    open: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3200,
  },
};
