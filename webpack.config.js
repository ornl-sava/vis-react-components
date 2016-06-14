const path = require('path')

const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

const PATHS = {
  app: path.join(__dirname, 'examples')
}

// const PATHS = {
//   app: path.join(__dirname, 'src'),
//   build: path.join(__dirname, 'public')
// }
// `npm run build` to build dist or `npm start` to run dev server.
const TARGET = process.env.npm_lifecycle_event

var env = process.env.NODE_ENV || 'development'
var isDev = env === 'development'

// Common to both starting dev server and building for production.
const common = {
  entry: {
    app: PATHS.app
  },
  debug: isDev,
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
    new HtmlPlugin({
      template: path.join(PATHS.app, 'index-template.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: PATHS.app
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}

// Default configuration. We will return this if webpack is called outside
// of npm.
if (TARGET === 'start' || !TARGET) {
  console.log('start called')
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.app,
      historyApiFallback: true,
      hot: true,
      compress: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}
