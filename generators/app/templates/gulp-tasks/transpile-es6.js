/**
 * @file
 * Transpile ES6 to ES5 using Babel.
 */
/* eslint-env node */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const print = require('gulp-print').default;

const paths = ['modules/**/*.es6.js'];

function transpile() {
  return gulp
    .src(paths, { base: './' })
    .pipe(babel())
    .pipe(
      rename((path) => {
        return {
          dirname: path.dirname,
          basename: path.basename.replace('.es6', ''),
          extname: path.extname,
        };
      }),
    )
    .pipe(gulp.dest('./'))
    .pipe(print((filename) => `Processed: ${filename}`));
}

gulp.task('build:js', async () => {
  transpile();
});

gulp.task('watch:js', () => {
  gulp.watch(paths, transpile);
});
