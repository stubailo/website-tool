var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');

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
  // Because we use nodemon to watch, this require re-evaluates on every single rebuild
  const data = require(path.join(projDir, 'data.js'));

  // Set up node env
  data.NODE_ENV = process.NODE_ENV || 'development';

  const options = {
    batch: [
      // Partials from the site builder
      path.join(genDir, 'assets'),
      path.join(projDir, 'templates'),
    ],
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
