const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const xml2js = require('xml2js');
const https = require('https');
const uuidV4 = require('uuid/v4');

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

      this.props.siteUuid = uuidV4();
      this.props.coreVersion = '8.3.7';
      var self = this;
      var parser = new xml2js.Parser();
      var url = 'https://updates.drupal.org/release-history/drupal/8.x';
      https.get(url, function(res) {
        var xml = '';
        res.on('data', function(chunk) {
          xml += chunk;
        });
        res.on('error', function() {});
        res.on('end', function() {
          parser.parseString(xml, function(err, result) {
            self.props.coreVersion = result.project.releases[0].release[0].version;
          });
        });
      });
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    this.installDependencies();
  }
};
