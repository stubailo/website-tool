const path = require('path');

const nm = path.join(__dirname, '..', 'node_modules');

console.log('WEBPACK NODE MODULES:', nm);

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: `${process.cwd()}/build`
  },
  resolveLoader: { modules: [nm] },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              path.join(nm, 'babel-preset-env'),
              path.join(nm, 'babel-preset-react')
            ]
          }
        }
      }
    ]
  }
};
