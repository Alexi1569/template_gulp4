const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './app/js/app.js'
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: [['@babel/preset-env', { modules: false }]]
          }
        }
      }
    ]
  },

  resolve: {
    alias: {
      TweenMax: path.resolve('app', 'libs/TweenMax.min.js'),
      TimelineMax: path.resolve('app', 'libs/TimelineMax.min.js'),
      TweenLite: path.resolve('app', 'libs/TweenLite.min.js'),
      ScrollMagic: path.resolve(
        'node_modules',
        'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'
      ),
      'animation.gsap': path.resolve(
        'node_modules',
        'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'
      ),
      'debug.addIndicators': path.resolve(
        'node_modules',
        'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'
      )
    }
  },

  externals: {
    jquery: 'jQuery'
  }
};
