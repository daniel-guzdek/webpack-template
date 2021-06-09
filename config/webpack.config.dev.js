const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: './src/index.js',
    app: './src/tools/app.js'
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../', 'build'),
    // developer version without hashes
    filename: 'js/[name]-dev.js'
  },

  devServer: {
    open: true,
    contentBase: path.resolve(__dirname, '../', 'public'),
    port: 8080
  },

  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
  
      { test: /\.css$/,
        // the development version better be without the miniCssExtractPlugin type stuff. Instead, we'll use a simple 'style-loader'
        use: ['style-loader', 'css-loader'],
        // use: [MiniCssExtractPlugin.loader, 'css-loader']
      },

      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              // development version without hashes
              name: '[name].[ext]',
              outputPath: 'images'
            },
          }, 
          
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                quality: 70,
                progressive: true
              }
            }
          }
        ],
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        // insert an exception so that the BABEL compiler does not compile files in the huge 'node_modules' directory
        exclude: /node_modules/,
        options: {
          presets: [
            ["@babel/preset-env", { useBuiltIns: 'usage', corejs: "2.0.0" }]
          ],
          plugins: ["@babel/plugin-proposal-class-properties"] 
        }
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'Application in development mode in folder "build"',
        template: './src/templates/template.html'
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'Subpage',
        filename: 'subpage.html'
      }
    ),
    new MiniCssExtractPlugin({
      // development version without hashes
      filename: 'css/[name].css'
    }),
    new CopyPlugin({
      patterns: [
        // copy images to folder 'images'.
        { from: "public/images", to: "images" },
        { from: "src/images", to: "public" },
      ],
    })
  ],
};