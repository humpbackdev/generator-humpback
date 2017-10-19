const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const xml2js = require('xml2js');
const https = require('https');
const uuidV4 = require('uuid/v4');
const remote = require('yeoman-remote');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay('Welcome to the great ' + chalk.red('generator-humpback') + ' generator!')
    );

    var prompts = [];

    if (!this.options.humanName) {
      prompts.push({
        type: 'String',
        name: 'humanName',
        message: 'How will you call your app?',
        default: 'Humpback'
      });
    }

    if (!this.options.appName) {
      prompts.push({
        type: 'String',
        name: 'appName',
        message: "What's your app machine name?",
        default: function(props) {
          return _.snakeCase(props.humanName);
        }
      });
    }

    return this.prompt(prompts).then(props => {
      this.props = [];
      this.props.humanName = props.humanName ? props.humanName : this.options.humanName;
      this.props.appName = props.appName ? props.appName : this.options.appName;
      this.props.dashedAppName = this.props.appName.replace('_', '-');

      this.props.siteUuid = uuidV4();
      this.props.coreVersion = '8.3.7';
    });
  }

  writing() {
    var self = this;
    remote('humpbackdev', 'humpback', 'v1.4', function(err, extractPath) {
      self.fs.copy(extractPath, self.destinationPath('./'));
      self.fs.copy(extractPath + '/.ahoy', self.destinationPath('.ahoy'));
      self.fs.copy(extractPath + '/.ahoy.yml', self.destinationPath('.ahoy.yml'));
      self.fs.copyTpl(
        self.templatePath('_README.md'),
        self.destinationPath('README.md'),
        self.props
      );
      self.fs.copyTpl(
        self.templatePath('site.ahoy.yml'),
        self.destinationPath('.ahoy/site.ahoy.yml'),
        self.props
      );
    });
    var parser = new xml2js.Parser();
    var url = 'https://updates.drupal.org/release-history/drupal/8.x';
    https.get(url, function(res) {
      var xml = '';
      res.on('data', function(chunk) {
        xml += chunk;
      });
      res.on('error', function() {
        self.fs.copyTpl(
          self.templatePath('_composer.drupal.json'),
          self.destinationPath('composer.drupal.json'),
          self.props
        );
      });
      res.on('end', function() {
        parser.parseString(xml, function(err, result) {
          if (!err) {
            self.props.coreVersion = result.project.releases[0].release[0].version;
          }
          self.fs.copyTpl(
            self.templatePath('_composer.drupal.json'),
            self.destinationPath('composer.drupal.json'),
            self.props
          );
        });
      });
    });
    this.fs.copy(
      this.templatePath('composer-scripts'),
      this.destinationPath('composer-scripts')
    );
    this.fs.copy(
      this.templatePath('composer.drupal.patches.json'),
      this.destinationPath('composer.drupal.patches.json')
    );
    this.fs.copy(this.templatePath('pantheon.yml'), this.destinationPath('pantheon.yml'));
    this.fs.copyTpl(this.templatePath('env'), this.destinationPath('.env'), this.props);
    this.fs.copyTpl(
      this.templatePath('_behat.yml'),
      this.destinationPath('behat.yml'),
      this.props
    );
    this.fs.copy(
      this.templatePath('composer.json'),
      this.destinationPath('composer.json')
    );
    this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.props
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
    this.fs.copyTpl(this.templatePath('docs'), this.destinationPath('docs'), this.props);
    this.fs.copy(this.templatePath('gulp-tasks'), this.destinationPath('gulp-tasks'));
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/config'),
      this.destinationPath('profiles/' + this.props.appName + '/config'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/_humpback.info.yml'),
      this.destinationPath(
        'profiles/' + this.props.appName + '/' + this.props.appName + '.info.yml'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('profiles/humpback/_humpback.install'),
      this.destinationPath(
        'profiles/' + this.props.appName + '/' + this.props.appName + '.install'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('scripts'),
      this.destinationPath('scripts'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('settings'),
      this.destinationPath('settings'),
      this.props
    );
    this.fs.copy(this.templatePath('tests'), this.destinationPath('tests'));
    this.fs.copy(
      this.templatePath('themes/custom/gitkeep'),
      this.destinationPath('themes/custom/.gitkeep')
    );
    this.fs.copyTpl(
      this.templatePath('config/sync'),
      this.destinationPath('config/sync'),
      this.props
    );
    this.fs.copy(
      this.templatePath('config-htaccess'),
      this.destinationPath('config/sync/.htaccess')
    );
    this.fs.copyTpl(
      this.templatePath('_humpback_local_install.sh'),
      this.destinationPath('scripts/' + this.props.appName + '_local_install.sh'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('circleci/site'),
      this.destinationPath('.circleci/' + this.props.appName),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('circleci/site.aliases.drushrc.php'),
      this.destinationPath('.circleci/' + this.props.appName + '.aliases.drushrc.php'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('circleci/config.yml'),
      this.destinationPath('.circleci/config.yml'),
      this.props
    );
    this.fs.copy(
      this.templatePath('circleci/settings.secret.php'),
      this.destinationPath('.circleci/settings.secret.php')
    );
  }

  install() {
    if (this.options.skipInstall) {
      this.log('Run npm install && composer install to start working');
    } else {
      this.npmInstall();
      this.spawnCommand('composer', ['install']);
    }
  }
};
