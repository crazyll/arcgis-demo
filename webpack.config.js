const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: [
      './src/client/index.js',
      // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', // dev
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      publicPath: './',
    }),
    // new ManifestPlugin(), // https://github.com/shellscape/webpack-manifest-plugin/issues/219
    new MiniCssExtractPlugin(),
    new webpack.EvalSourceMapDevToolPlugin({}),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    // https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching
    // https://www.jianshu.com/p/714ce38b9fdc
    runtimeChunk: true,
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/i,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 回调必须返回 `local`，`global`，或者 `pure`
                mode: (resourcePath) => {
                  if (/pure.css$/i.test(resourcePath)) {
                    return 'pure';
                  }

                  if (/global.css$/i.test(resourcePath)) {
                    return 'global';
                  }

                  return 'local';
                },
                localIdentName: process.env.NODE_ENV === 'development' ? '[path][name]__[local]' : '[hash:base64:5]',
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                  ],
                ],
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false,
  }
};