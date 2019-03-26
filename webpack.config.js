const path = require('path');

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
    main: path.resolve('./src/scripts/main.js')
  },

  output: {
    filename: 'main.bundle.js',
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
        use: ['file-loader']
      }
    ]
  },

  devtool: '#cheap-source-map',

  devServer: {
    contentBase: path.resolve('./dist'),
    port: 9000
  },

  plugins: [HtmlWebpackPluginConfig]
};
