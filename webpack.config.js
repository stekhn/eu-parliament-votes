const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanWebpackPluginConfig = new CleanWebpackPlugin();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  resolve: {
    modules: ['node_modules']
  },

  entry: {
    main: path.resolve('./src/scripts/index.js')
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }]
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }]
      }
    ]
  },

  devtool: '#cheap-source-map',

  devServer: {
    contentBase: path.resolve('./dist'),
    port: 9000
  },

  plugins: [
    CleanWebpackPluginConfig,
    HtmlWebpackPluginConfig
  ]
};
