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
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    filename: 'js/[name]-prod-[contenthash:5].js'
  },

  // in the production version devServer is no longer needed 

  // devServer: {
  //   open: true,
  //   contentBase: path.resolve(__dirname, '../', 'public'),
  //   port: 8080
  // },

  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
  
      { test: /\.css$/,
        // use: ['style-loader', 'css-loader'],
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },

      {
        test: /\.(scss|sass)$/,
        // use: ['style-loader', 'css-loader', 'sass-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[contenthash:6].[ext]',
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
        title: 'Application in development mode in folder "dist"',
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
      filename: 'css/[name]-[contenthash:6].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/images", to: "images" },
        { from: "src/images", to: "public" },
      ],
    })
  ],
};