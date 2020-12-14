const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default; 

// 热更新（有些问题）


// 多线程打包
// 根据环境变量使用不同的配置文件
// 编译样式
// typescript 是否可选
// 是否使用 antd

module.exports = {
  mode: 'development',
  entry: ['webpack-hot-middleware/client?noInfo=true&reload=true', path.resolve(__dirname, '../src/app.js')],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'yifeng-cli-[hash:5].js',
    chunkFilename: '[name]-[contenthash:5].js',
    publicPath: '/' // 构建完毕时静态文件的访问路由
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // 引用文件的时候可省略的后缀
    mainFiles: ['index'],  //  如果直接引用一个模块的文件夹，不用指定文件，会优先找 index 为文件名的文件，可配置多个
    alias: {  // 目录别名
      '@': path.resolve(__dirname, '../src')
    }
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'yifeng-[path][name]-[local]-[hash:base64:6]',
              },
              sourceMap: true
            }
          },
          { 
            loader: 'postcss-loader',
            options: {
              // plugins: () => [
              //   require('postcss-flexbugs-fixes'),
              //   require('autoprefixer')
              // ],
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 开启模块热更新，热加载和模块热更新不同，热加载是整个页面刷新
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/document.ejs')
    }),
    new MiniCssExtractPlugin(),
    new CSSSplitWebpackPlugin({  // 拆分较大的 css 文件
      size: 4000,
      filename: '[name]-[part].[ext]'
    }),
    // new webpack.DllPlugin({
    //   // manifest缓存文件的请求上下文（默认为webpack执行环境上下文）
    //   context: process.cwd(),
    //   // manifest.json文件的输出位置
    //   path: path.join(__dirname, 'src/js', 'dll', '[name]-manifest.json'),
      
    //   // 定义打包的公共vendor文件对外暴露的函数名
    //   name: '[name]_[hash]'
    // })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const moduleFileName = module.identifier().split('/').reduceRight(item => item);
            return `${moduleFileName.split('.')[0]}`;
          },
          chunks: 'all'
        }
      }
    },
    minimizer: [new OptimizeCSSAssetsPlugin()]
  }
};