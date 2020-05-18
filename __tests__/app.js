var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-humpback:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      humanName: 'Humpback',
      appName: 'humpback',
      deployEnv: 'Platformsh',
    });
  });

  it('creates files', () => {
    assert.file(['composer.patches.json']);
  });
});
