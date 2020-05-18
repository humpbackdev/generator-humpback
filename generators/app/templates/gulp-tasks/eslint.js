/**
 * @file
 * Validate custom JavaScript with best practices and Drupal Coding Standards.
 */
/* eslint-env node */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const gulpif = require('gulp-if');

gulp.task('eslint', () => {
  const sourcePatterns = [
    'gulpfile.js',
    'gulp-tasks/*.js',
    'modules/**/*.es6.js',
    '!modules/**/node_modules/**/*.es6.js',
  ];
  const writeOutput = argv.hasOwnProperty('outputfile');
  let wstream;
  if (writeOutput) {
    wstream = fs.createWriteStream(`${argv.outputfile}/eslint.xml`);
  }
  const result = gulp
    .src(sourcePatterns)
    .pipe(
      eslint({
        configFile: './.eslintrc.json',
      }),
    )
    .pipe(eslint.format())
    .pipe(gulpif(writeOutput, eslint.format('junit', wstream)))
    .pipe(eslint.failAfterError());

  return result;
});
