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

gulp.task('less', () => {
  return gulp.src('./src/index.less')
    .pipe(less({
      paths: [ path.join(projDir, 'less') ]
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('public', () => {
  gulp.src('./src/public/**/*').pipe(gulp.dest('./build/'));
});

gulp.task('html', () => {
  let data = {};

  try {
    // Because we use nodemon to watch, this require re-evaluates on every single rebuild
    data = require(path.join(projDir, 'data.js'));
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
  const templateDir = path.join(projDir, 'templates');
  if (fs.existsSync(templateDir)) {
    batch.push(templateDir);
  }

  const options = {
    batch,
    helpers: {
      env: (desiredEnv) => {
        return data.NODE_ENV === desiredEnv;
      }
    }
  };

  return gulp.src('./src/index.html')
    .pipe(handlebars(data, options))
    .pipe(gulp.dest('./build'));
})
