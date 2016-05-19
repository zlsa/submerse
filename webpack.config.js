
var webpack = require('webpack');
var path = require('path');
var libraryName = 'submerse';
var outputFile = libraryName + '.js';

var config = {
  entry: __dirname + '/src/main.js',
  devtool: 'source-map',
  
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  
  module: {
    loaders: [
      
      {
        test: /(\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      }
      
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  }
};

module.exports = config;
