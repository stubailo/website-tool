#! /usr/bin/env node

const commandLineArgs = require('command-line-args')
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

if (! fs.existsSync('src')) {
  throw new Error('Run from root from project, must have /src directory.');
}

const optionDefinitions = [
  { name: 'command', type: String, defaultOption: true },
]

const { command } = commandLineArgs(optionDefinitions);

// shell.pushd(__dirname);
const binPath = shell.exec('npm bin', { silent: true }).stdout.trim();
// shell.popd();

if (command === 'dev') {
  shell.exec(`${bin('concurrently')} "${__filename} display" "${__filename} watch" "${__filename} webpack"`);
} else if (command === 'watch') {
  shell.exec(`${bin('gulp')} --gulpfile ${pkg('gen/gulpfile.js')} --cwd src watch`);
} else if (command === 'build') {
  shell.exec(`${bin('gulp')} --gulpfile ${pkg('gen/gulpfile.js')} --cwd src`);
} else if (command === 'webpack') {
  shell.exec(`${bin('webpack')} --config ${pkg('gen/webpack.config.js')} --watch`);
} else if (command === 'display') {
  shell.exec(`sleep 1 && ${bin('live-server')} ./build`);
} else if (command === 'version') {
  console.log(require('../package.json').version);
}

function bin(command) {
  return path.join(binPath, command);
}

function cwd(p) {
  return path.join(process.cwd(), p);
}

function pkg(p) {
  return path.join(__dirname, '..', p);
}

// "scripts": {
//     "build": "gulp --gulpfile generator/gulpfile.js --cwd .",
//     "watch": "nodemon --ignore build -e \"\" --exec \"gulp --gulpfile generator/gulpfile.js --cwd .\"",
//     "live": "live-server build",
//     "dev": "concurrently \"npm run watch\" \"npm run live\" -n \"gulp,live-server\" "
//   },
