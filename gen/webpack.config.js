const path = require('path');
const fs = require('fs');

let nm;
// Are we running from an install?
nm = path.join(process.cwd(), 'node_modules');
console.log('first nm', nm);

if (! fs.existsSync(path.join(nm, 'babel-loader'))) {
  // We are running from npm link
  nm = path.join(__dirname, '..', 'node_modules');
  console.log('second nm', nm);
}

console.log('babel-preset-env path:', require.resolve('babel-preset-env'));

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
              'babel-preset-env',
              'babel-preset-react'
            ]
          }
        }
      }
    ]
  }
};
