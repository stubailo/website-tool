var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');
var fs = require('fs');
var cleanCSS = require('gulp-clean-css');
const filter = require('gulp-filter');

// Directory with project files provided by consumer
const projDir = process.cwd();

// Directory with assets for generator
const genDir = __dirname;

gulp.task('default', ['less', 'html', 'public']);

const LESS_INDEX = 'index.less';
const LESS_IMPORTS = 'less/**/*';
gulp.task('less', () => {
  return gulp.src(LESS_INDEX)
    .pipe(less({
      paths: [ path.join(projDir, 'less') ]
    }))
    .on('error', handleError)
    .pipe(gulp.dest('../build/'));
});

const PUBLIC_DIR = 'public/**/*';
gulp.task('public', () => {
  gulp.src(PUBLIC_DIR).pipe(gulp.dest('../build/'));
});

const DATA_PATH = path.join(projDir, 'data.js');
console.log('DATA', DATA_PATH);
const TEMPLATES_PATH = path.join(projDir, 'templates');
const TEMPLATES_WATCH_PATH = path.join(TEMPLATES_PATH, "**", "*.html");
const HTML_PAGES = path.join(projDir, '**', '*.html');
gulp.task('html', () => {
  let data = {};

  try {
    // We need to clear the cache
    delete require.cache[require.resolve(DATA_PATH)];
    data = require(DATA_PATH);
    console.log('THE DATA', data);
  } catch (e) {
    console.info('data.js not found, skipping.');
  }

  // Set up node env
  data.NODE_ENV = process.NODE_ENV || 'development';

  // Directories for partials
  const batch = [];

  // Partials used by the site builder, like __includes
  console.log('GEN DIR', genDir);
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

  const skipTemplates = filter('!' + TEMPLATES_WATCH_PATH);

  return gulp.src(HTML_PAGES)
    .pipe(skipTemplates)
    .pipe(handlebars(data, options))
    .pipe(gulp.dest('../build'));
})

gulp.task('watch', ['less', 'public', 'html'], () => {
  console.log('RUNNING GULP')
  gulp.watch([
    LESS_INDEX,
    LESS_IMPORTS
  ], ['less']);

  gulp.watch(PUBLIC_DIR, ['public']);

  gulp.watch([
    DATA_PATH,
    TEMPLATES_WATCH_PATH,
    HTML_PAGES,
  ], ['html']);
});

gulp.task('prod', ['less', 'public', 'html'], () => {
  gulp.src('../build/index.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('../build'));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
