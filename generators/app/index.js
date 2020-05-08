const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const xml2js = require('xml2js');
const https = require('https');
const uuidV4 = require('uuid/v4');
const remote = require('yeoman-remote');

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay('Welcome to the great ' + chalk.red('generator-humpback') + ' generator!')
    );
    // Get the user aswers.
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'humanName',
        message: 'How will you call your app?',
        default: 'Humpback'
      },
      {
        type: 'input',
        name: 'appName',
        message: "What's your app machine name?",
        default(props) {
          return _.snakeCase(props.humanName);
        }
      },
      {
        type: 'list',
        name: 'deployEnvironment',
        message: 'Where your app will be deployed?',
        choices: ['Pantheon', 'Platform.sh'],
        default: ['Pantheon']
      }
    ]);

    this.answers.dashedAppName = this.answers.appName.replace('_', '-');
    this.answers.siteUuid = uuidV4();
    this.answers.coreVersion = '8.8.0';
    this.devEnvPath = 'deploy-environment/' + this.answers.deployEnvironment;
  }

  configuring() {
    // Get the latest stable version of Drupal.
    var done = this.async();
    var url = 'https://updates.drupal.org/release-history/drupal/8.x';
    https.get(url, res => {
      var xml = '';
      res.on('data', data => {
        xml += data;
      });
      res.on('error', () => {
        this.log(
          'Error getting the lastest relase of drupal, using the default: ',
          this.answers.coreVersion
        );
      });
      res.on('end', () => {
        var parser = new xml2js.Parser();
        parser.parseString(xml, (err, result) => {
          if (!err) {
            var releases = result.project.releases[0].release;
            for (var index = 0; index < releases.length; index++) {
              var release = releases[index];
              if (
                typeof release.version_extra === 'undefined' &&
                String(release.version[0]).startsWith('8.')
              ) {
                this.answers.coreVersion = release.version[0];
                break;
              }
            }
          }
          done();
        });
      });
    });
  }

  default() {
    // Copy the humpback dev.
    var done = this.async();
    remote('humpbackdev', 'humpback', 'v1.28', (error, extractPath) => {
      this.fs.copy(extractPath, this.destinationPath('./'));
      this.fs.copy(extractPath + '/.ahoy', this.destinationPath('.ahoy'));
      this.fs.copy(extractPath + '/.ahoy.yml', this.destinationPath('.ahoy.yml'));
      done();
    });
  }

  writing() {
    if (this.answers.deployEnvironment === 'Pantheon') {
      this.fs.copy(
        this.templatePath(this.devEnvPath + '/pantheon.yml'),
        this.destinationPath('pantheon.yml')
      );
      // Get the pantheon settings from the repo.
      remote(
        'pantheon-systems',
        'drops-8',
        this.answers.coreVersion,
        (error, extractPath) => {
          this.fs.copy(
            extractPath + '/sites/default/settings.pantheon.php',
            this.destinationPath('settings/settings.pantheon.php')
          );
        }
      );
    } else {
      this.fs.copy(
        this.templatePath(this.devEnvPath + '/platform'),
        this.destinationPath('.platform')
      );
      this.fs.copy(
        this.templatePath(this.devEnvPath + '/platform.app.yaml'),
        this.destinationPath('.platform.app.yaml')
      );
      // Get the platfomsh settings from the repo.
      remote('platformsh-templates', 'drupal8', 'master', (error, extractPath) => {
        this.fs.copy(
          extractPath + '/web/sites/default/settings.platformsh.php',
          this.destinationPath('settings/settings.platformsh.php')
        );
      });
    }
    // Copy files from deploy-environment folder.
    this.fs.copyTpl(
      this.templatePath(this.devEnvPath + '/circleci/site'),
      this.destinationPath('.circleci/' + this.answers.appName),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.devEnvPath + '/circleci/site.aliases.drushrc.php'),
      this.destinationPath('.circleci/' + this.answers.appName + '.aliases.drushrc.php'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.devEnvPath + '/circleci/config.yml'),
      this.destinationPath('.circleci/config.yml'),
      this.answers
    );
    this.fs.copy(
      this.templatePath(this.devEnvPath + '/circleci/settings.secret.php'),
      this.destinationPath('.circleci/settings.secret.php')
    );
    this.fs.copyTpl(
      this.templatePath(this.devEnvPath + '/_site.ahoy.yml'),
      this.destinationPath('.ahoy/site.ahoy.yml'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.devEnvPath + '/_composer.json'),
      this.destinationPath('composer.json'),
      this.answers
    );
    // Copy common files.
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('_docker-compose.yml'),
      this.destinationPath('docker-compose.yml'),
      this.answers
    );
    this.fs.copy(
      this.templatePath('composer-scripts'),
      this.destinationPath('composer-scripts')
    );
    this.fs.copy(
      this.templatePath('composer.patches.json'),
      this.destinationPath('composer.patches.json')
    );
    this.fs.copyTpl(this.templatePath('env'), this.destinationPath('.env'), this.answers);
    this.fs.copyTpl(
      this.templatePath('_behat.yml'),
      this.destinationPath('behat.yml'),
      this.answers
    );
    this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.answers
    );
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('web/gitkeep'), this.destinationPath('web/.gitkeep'));
    this.fs.copy(
      this.templatePath('files/gitkeep'),
      this.destinationPath('files/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('patches/gitkeep'),
      this.destinationPath('patches/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('root/htaccess'),
      this.destinationPath('root/.htaccess')
    );
    this.fs.copy(
      this.templatePath('root/gitignore'),
      this.destinationPath('root/.gitignore')
    );
    this.fs.copy(
      this.templatePath('modules/custom/gitkeep'),
      this.destinationPath('modules/custom/.gitkeep')
    );
    this.fs.copy(this.templatePath('drush'), this.destinationPath('drush'));
    this.fs.copyTpl(
      this.templatePath('docs'),
      this.destinationPath('docs'),
      this.answers
    );
    this.fs.copy(this.templatePath('gulp-tasks'), this.destinationPath('gulp-tasks'));
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/config'),
      this.destinationPath('profiles/' + this.answers.appName + '/config'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/_humpback.info.yml'),
      this.destinationPath(
        'profiles/' + this.answers.appName + '/' + this.answers.appName + '.info.yml'
      ),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/_humpback.install'),
      this.destinationPath(
        'profiles/' + this.answers.appName + '/' + this.answers.appName + '.install'
      ),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('settings'),
      this.destinationPath('settings'),
      this.answers
    );
    this.fs.copy(this.templatePath('tests'), this.destinationPath('tests'));
    this.fs.copy(
      this.templatePath('themes/custom/gitkeep'),
      this.destinationPath('themes/custom/.gitkeep')
    );
    this.fs.copyTpl(
      this.templatePath('config/sync'),
      this.destinationPath('config/sync'),
      this.answers
    );
    this.fs.copy(
      this.templatePath('config-htaccess'),
      this.destinationPath('config/sync/.htaccess')
    );
  }

  install() {
    if (this.options.skipInstall) {
      this.log('Run npm install && composer install to start working');
    } else {
      this.npmInstall();
    }
  }
};
