const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const xml2js = require('xml2js');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const remote = require('yeoman-remote');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('humanName', { desc: 'The human name of the App' });
    this.option('appName', { desc: 'The machine name of the App' });
    this.option('deployEnv', { desc: 'The environment where the App will be deployed' });
  }

  async prompting() {
    this.log(
      yosay('Welcome to the great ' + chalk.red('generator-humpback') + ' generator!')
    );

    const prompts = [];

    if (!this.options.humanName) {
      prompts.push({
        type: 'input',
        name: 'humanName',
        message: 'How will you call your app?',
        default: 'Humpback',
      });
    }

    if (!this.options.appName) {
      prompts.push({
        type: 'input',
        name: 'appName',
        message: "What's your app machine name?",
        default(props) {
          return _.snakeCase(props.humanName);
        },
      });
    }

    if (!this.options.deployEnv) {
      prompts.push({
        type: 'list',
        name: 'deployEnv',
        message: 'Where your app will be deployed?',
        choices: ['Pantheon', 'Platformsh'],
        default: ['Pantheon'],
      });
    }

    this.answers = await this.prompt(prompts);

    if (this.options['human-name']) {
      this.answers.humanName = this.options['human-name'];
    }

    if (this.options['app-name']) {
      this.answers.appName = this.options['app-name'];
    }

    if (this.options['deploy-env']) {
      this.answers.deployEnv = this.options['deploy-env'];
    }

    this.answers.dashedAppName = this.answers.appName.replace('_', '-');
    this.answers.siteUuid = uuidv4();
    this.answers.coreVersion = '8.8.0';
    this.deployEnvPath = 'deploy-environment/' + this.answers.deployEnv;
  }

  configuring() {
    // Get the latest stable version of Drupal.
    var done = this.async();
    var url = 'https://updates.drupal.org/release-history/drupal/8.x';
    https.get(url, (res) => {
      var xml = '';
      res.on('data', (data) => {
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
    if (this.answers.deployEnv === 'Pantheon') {
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/pantheon.yml'),
        this.destinationPath('pantheon.yml')
      );
    } else {
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/platform'),
        this.destinationPath('.platform')
      );
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/platform.app.yaml'),
        this.destinationPath('.platform.app.yaml')
      );
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/environment'),
        this.destinationPath('.environment')
      );
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/install-redis.sh'),
        this.destinationPath('install-redis.sh')
      );
      this.fs.copy(
        this.templatePath(this.deployEnvPath + '/settings/settings.platformsh.php'),
        this.destinationPath('settings/settings.platformsh.php')
      );
    }

    // Copy files from deploy-environment folder.
    this.fs.copy(
      this.templatePath(this.deployEnvPath + '/drush'),
      this.destinationPath('drush')
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/circleci/site'),
      this.destinationPath('.circleci/' + this.answers.appName),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/circleci/site.aliases.drushrc.php'),
      this.destinationPath('.circleci/' + this.answers.appName + '.aliases.drushrc.php'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/circleci/config.yml'),
      this.destinationPath('.circleci/config.yml'),
      this.answers
    );
    this.fs.copy(
      this.templatePath(this.deployEnvPath + '/circleci/settings.secret.php'),
      this.destinationPath('.circleci/settings.secret.php')
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/site.ahoy.yml'),
      this.destinationPath('.ahoy/site.ahoy.yml'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/composer.json'),
      this.destinationPath('composer.json'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(this.deployEnvPath + '/env'),
      this.destinationPath('.env'),
      this.answers
    );
    this.fs.copy(
      this.templatePath(this.deployEnvPath + '/gitignore'),
      this.destinationPath('.gitignore')
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
    this.fs.copy(
      this.templatePath('eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    );
    this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('nvmrc'), this.destinationPath('.nvmrc'));
    this.fs.copy(
      this.templatePath('prettierrc.json'),
      this.destinationPath('.prettierrc.json')
    );
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );

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
    this.fs.copy(this.templatePath('modules'), this.destinationPath('modules'));

    this.fs.copyTpl(
      this.templatePath('docs'),
      this.destinationPath('docs'),
      this.answers
    );
    this.fs.copy(this.templatePath('gulp-tasks'), this.destinationPath('gulp-tasks'));
    this.fs.copy(
      this.templatePath('profiles/gitkeep'),
      this.destinationPath('profiles/.gitkeep')
    );
    this.fs.copyTpl(
      this.templatePath('settings'),
      this.destinationPath('settings'),
      this.answers
    );
    this.fs.copy(this.templatePath('tests'), this.destinationPath('tests'));
    this.fs.copy(this.templatePath('themes'), this.destinationPath('themes'));
    this.fs.copy(this.templatePath('config'), this.destinationPath('config'));
  }

  install() {
    if (this.options.skipInstall) {
      this.log('Run npm install && composer install to start working');
    } else {
      this.npmInstall();
    }
  }
};
