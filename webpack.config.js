const path = require(`path`);
const webpack = require(`webpack`);

module.exports = {
  mode: `development`,
  entry: {
    'js/bundle': `./src/main.js`
  },

  output: {
    filename: `[name].js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: `babel-loader`
    }]
  },
  optimization: {
    splitChunks: {
      minChunks: 2
    }
  }
};
