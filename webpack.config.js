const path = require('path')

const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const PATHS = {
  src: path.join(__dirname, 'src'),
  example: path.join(__dirname, 'examples')
}
const EXTERNALS = {
  react: {
    root: 'React',
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react'
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'react-dom'
  }
}

// `npm run build` to build dist or `npm start` to run dev server.
const TARGET = process.env.npm_lifecycle_event

var env = process.env.NODE_ENV || 'development'
var isDev = env === 'development'
// Common to both starting dev server and building for production.
const common = {
  devtool: isDev ? 'eval' : false,
  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: isDev,
      __DEVELOPMENT__: isDev,
      __DEVTOOLS__: isDev,
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        BABEL_ENV: JSON.stringify(env)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [
          PATHS.src,
          PATHS.example
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          // Using source maps breaks urls in the CSS loader
          // https://github.com/webpack/css-loader/issues/232
          // This comment solves it, but breaks testing from a local network
          // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
          // 'css-loader?sourceMap',
          'css-loader'
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  }
}

// Default configuration. We will return this if webpack is called outside
// of npm.
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    entry: {
      example: PATHS.example
    },
    devServer: {
      contentBase: PATHS.example,
      historyApiFallback: true,
      hot: true,
      compress: true,
      inline: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 8080
    },
    plugins: [
      new HtmlPlugin({
        template: path.join(PATHS.example, 'index-template.html'),
        inject: 'body',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  })
} else if (TARGET === 'buildDist' || TARGET === 'build' || TARGET === 'analyze') {
  let plugins = [
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200 // ~50kb
    })
  ]
  if (TARGET === 'analyze') {
    plugins.push(new BundleAnalyzerPlugin())
  }
  module.exports = merge(common, {
    entry: {
      'vis-react-components.min': PATHS.src
    },
    output: {
      library: 'vis-react-components',
      path: path.join(__dirname, '/dist'),
      libraryTarget: 'umd',
      filename: '[name].js',
      publicPath: '/'
    },
    plugins: plugins,
    externals: EXTERNALS
  })
}
