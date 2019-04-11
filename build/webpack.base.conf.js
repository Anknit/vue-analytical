var path = require('path');
var projectRoot = path.resolve(__dirname, '../');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  runtimeCompiler:true,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    },{
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot,
      exclude: /node_modules/
    },{
      test: /\.scss$/,
      include: projectRoot,
      exclude: /node_modules/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader'
      ],
    }],
  },
}
