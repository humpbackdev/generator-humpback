/**
 * @file
 * Validate custom files with Drupal Coding Standards.
 */
/* eslint-env node */
/* eslint no-console:0 */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint func-names: 0 */

const gulp = require('gulp');
const through2 = require('through2');
const argv = require('minimist')(process.argv.slice(2));
const exec = require('sync-exec');
const colors = require('ansi-colors');
const log = require('fancy-log');
const PluginError = require('plugin-error');

gulp.task('drupalcs', () => {
  // Source file defaults to a pattern.
  const extensions = '{php,module,inc,install,test,profile,theme}';
  const sourcePatterns = [
    `modules/**/*.${extensions}`,
    `themes/**/*.${extensions}`,
    `tests/behat/**/*.${extensions}`,
    `settings/**/*.${extensions}`,
  ];

  return (
    gulp
      .src(sourcePatterns)
      .pipe(
        through2.obj(function (file, enc, callback) {
          const command = `vendor/bin/phpcs --standard="vendor/drupal/coder/coder_sniffer/Drupal" ${file.path}`;
          const report = exec(command);
          // If status === 1 (error).
          if (report.status) {
            // Prepare some properties that log to screen will need.
            report.error = report.stdout;
            report.output = report.stdout;
            file.phpcsReport = report;
          }

          this.push(file);
          callback();
        }),
      )
      // Determine relative path for each file.
      .pipe(
        through2.obj(function (file, enc, callback) {
          file.relative_path = file.path
            // Replace current working directory.
            .replace(file.cwd, '')
            // Remove leading slash.
            .substr(1);
          this.push(file);
          callback();
        }),
      )
      // Log to screen.
      .pipe(
        through2.obj(function (file, enc, callback) {
          const report = file.phpcsReport || {};
          if (report.error) {
            // Skip FILE: STDIN.
            let reportOutput = report.output.substring(
              report.output.indexOf('FILE STDIN') + 15,
            );

            // Remove advertisement.
            const advertisement = report.output.indexOf('PHPCBF CAN FIX');
            if (advertisement > 0) {
              reportOutput = reportOutput.substr(0, advertisement - 15);
            }
            // Remove debugging.
            else {
              reportOutput = reportOutput.substr(
                0,
                reportOutput.indexOf('Time: ') - 5,
              );
            }

            // Get the summary.
            const summaryMatch = reportOutput.match(
              new RegExp('FOUND .* LINES?'),
            );
            const summary = summaryMatch[summaryMatch.length - 1];
            // Remove the summary from the report.
            reportOutput = reportOutput.substr(
              reportOutput.lastIndexOf(summary) + summary.length,
            );

            // Parse summary.
            const errorsMatch = summary.match(new RegExp('(\\d+) ERRORS?'));
            const warningsMatch = summary.match(new RegExp('(\\d+) WARNING?'));
            const linesMatch = summary.match(new RegExp('(\\d+) LINES?'));

            let intro = `${colors.cyan(file.relative_path)}:`;
            if (errorsMatch) {
              intro += ` ${colors.red(errorsMatch[0])}`;
            }
            if (warningsMatch) {
              intro += ` ${colors.yellow(warningsMatch[0])}`;
            }
            if (linesMatch) {
              intro += ` AFFECTING ${colors.magenta(linesMatch[0])}`;
            }

            // Colorize.
            reportOutput = reportOutput.replace(/ERROR/g, colors.red('ERROR'));
            reportOutput = reportOutput.replace(
              /WARNING/g,
              colors.yellow('WARNING'),
            );

            // Cleanup.
            reportOutput = reportOutput.trim();

            log(intro, `\n${reportOutput}`);
          }
          this.push(file);
          callback();
        }),
      )
      // Write to file.
      .pipe(
        through2.obj(function (file, enc, callback) {
          if (
            argv.hasOwnProperty('report') &&
            argv.hasOwnProperty('reportfile')
          ) {
            let reportName = file.relative_path
              // Replace slashes.
              .replace(new RegExp('/', 'g'), '__');
            // Add extension.
            reportName += '.xml';

            const reportFile = argv.reportfile + reportName;

            const command = `vendor/bin/phpcs \\
--standard="vendor/drupal/coder/coder_sniffer/Drupal" \\
--report=${argv.report} ${file.path} \\
--report-file=${reportFile}`;

            exec(command);
          }

          this.push(file);
          callback();
        }),
      )
      // Fail on errors.
      .pipe(
        through2.obj(function (file, enc, callback) {
          const report = file.phpcsReport || {};
          if (report.error) {
            this.emit(
              'error',
              new PluginError({
                plugin: 'drupalcs',
                message: `PHP_CodeSniffer found problem(s) in ${file.relative_path}`,
              }),
            );
          }
          this.push(file);
          callback();
        }),
      )
  );
});
