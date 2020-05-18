/**
 * @file
 * Syntax check PHP files.
 */
/* eslint-env node */
/* eslint no-console:0 */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const gulp = require('gulp');
const phplint = require('phplint').lint;
const PluginError = require('plugin-error');

gulp.task('phplint', (cb) => {
  const extensions = '{php,module,inc,install,test,profile,theme}';
  const sourcePatterns = [
    `modules/**/*.${extensions}`,
    `themes/**/*.${extensions}`,
    `tests/behat/**/*.${extensions}`,
    `settings/**/*.${extensions}`,
  ];
  const phpLintOptions = {
    limit: 50,
  };

  phplint(sourcePatterns, phpLintOptions, (err) => {
    if (err) {
      throw new PluginError({
        plugin: 'phplint',
        message: err,
      });
    }
    cb();
  });
});
