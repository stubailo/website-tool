var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');
var fs = require('fs');

console.log("CWD", process.cwd());

// Directory with project files provided by consumer
const projDir = path.join(process.cwd(), 'src');

// Directory with assets for generator
const genDir = __dirname;

gulp.task('default', ['less', 'html', 'public']);

const LESS_INDEX = './src/index.less';
const LESS_IMPORTS = './src/less/**/*';
gulp.task('less', () => {
  return gulp.src(LESS_INDEX)
    .pipe(less({
      paths: [ path.join(projDir, 'less') ]
    }))
    .pipe(gulp.dest('./build/'));
});

const PUBLIC_DIR = './src/public/**/*';
gulp.task('public', () => {
  gulp.src(PUBLIC_DIR).pipe(gulp.dest('./build/'));
});

const DATA_PATH = path.join(projDir, 'data.js');
const TEMPLATES_PATH = path.join(projDir, 'templates');
const HTML_INDEX = './src/index.html';
gulp.task('html', () => {
  let data = {};

  try {
    // Because we use nodemon to watch, this require re-evaluates on every single rebuild
    data = require(DATA_PATH);
  } catch (e) {
    console.info('data.js not found, skipping.');
  }

  // Set up node env
  data.NODE_ENV = process.NODE_ENV || 'development';

  // Directories for partials
  const batch = [];

  // Partials used by the site builder, like __includes
  batch.push(path.join(genDir, 'assets'));

  // Partials in the site source
  if (fs.existsSync(TEMPLATES_PATH)) {
    batch.push(TEMPLATES_PATH);
  }

  const options = {
    batch,
    helpers: {
      env: (desiredEnv) => {
        return data.NODE_ENV === desiredEnv;
      }
    }
  };

  return gulp.src(HTML_INDEX)
    .pipe(handlebars(data, options))
    .pipe(gulp.dest('./build'));
})

gulp.task('watch', () => {
  gulp.watch([
    LESS_INDEX,
    LESS_IMPORTS
  ], ['less']);

  gulp.watch(PUBLIC_DIR, ['public']);

  gulp.watch([
    DATA_PATH,
    TEMPLATES_PATH,
    HTML_INDEX,
  ], ['html']);
})
