#! /usr/bin/env node

const commandLineArgs = require('command-line-args')
const shell = require('shelljs');
const path = require('path');

const optionDefinitions = [
  { name: 'command', type: String, defaultOption: true },
]

const { command } = commandLineArgs(optionDefinitions);

shell.pushd(process.cwd());
const binPath = shell.exec('npm bin', { silent: true }).stdout.trim();
shell.popd();

if (command === 'dev') {
  shell.exec(`${bin('concurrently')} "${bin('live-server')} build" "${__filename} watch"`);
} else if (command === 'watch') {
  // We have to pass a space into the '-e' extension option of nodemon, otherwise it is completely
  // ignored
  shell.exec(`${bin('nodemon')} --watch src -e \" \" --exec "${__filename} build"`);
} else if (command === 'build') {
  shell.exec(`${bin('gulp')} --gulpfile ${pkg('gen/gulpfile.js')} --cwd .`)
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
