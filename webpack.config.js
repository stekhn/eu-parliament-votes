const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve('./src/scripts/index.js')
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js'
  },
  devtool: '#cheap-source-map',
  devServer: {
    contentBase: path.resolve('./dist'),
    port: 9000
  },
  resolve: {
    modules: ['node_modules']
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        data: {
          test: /\.json$/,
          filename: '[name].js',
          name(module) {
            const filename = module.rawRequest.replace(/^.*[\\/]/, '');
            return filename.substring(0, filename.lastIndexOf('.'));
          },
        }
      }
    }
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
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ]
};
