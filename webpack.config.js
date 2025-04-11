const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.js', '.vue']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    hot: true,
    open: true,
    port: 8080
  },
  mode: 'development'
};