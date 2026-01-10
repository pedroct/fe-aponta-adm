const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// Modo DEV para desenvolvimento local
const isDev = process.env.DEV_MODE === 'true';

module.exports = {
  entry: isDev ? './src/index-dev.tsx' : './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: isDev ? [
    new HtmlWebpackPlugin({
      template: './public/dev.html',
      filename: 'index.html',
    }),
    new Dotenv({
      path: './.env',
      safe: false,
      systemvars: true,
    }),
  ] : [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' }
      ],
    }),
    new Dotenv({
      path: './.env',
      safe: false,
      systemvars: true,
    }),
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: false,
    historyApiFallback: true,
  },
};
