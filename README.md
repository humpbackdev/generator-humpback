# generator-humpback [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Generate a Drupal project using humpback

## What's in the box?

Using this generator; you'll get a folder ready to start working with Drupal using modern and cool technologies like docker, behat, composer, gulp and more

Out of the box; you'll get the necessary stuff for building your Drupal site using composer. There are also some useful tools to check code quality (eslint, phplint, drupalcs) and some scripts for day-to-day tasks (generate settings, install site, run behat, etc).

Besides that; you'll get a [CircleCI](http://circleci.com/) config file ready to create a circleci app the with necessary build steps and [Pantheon](http://pantheon.io/) deploy.


## Installation

First, install [Yeoman](http://yeoman.io) and generator-humpback using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-humpback
```

Then generate your new project:

```bash
yo humpback
```

## Usage

For usage instructions; please refer to: [USAGE.md](USAGE.md)

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

GPL-3.0 ©


[npm-image]: https://badge.fury.io/js/generator-humpback.svg
[npm-url]: https://npmjs.org/package/generator-humpback
[travis-image]: https://travis-ci.org/humpbackdev/generator-humpback.svg?branch=master
[travis-url]: https://travis-ci.org/humpbackdev/generator-humpback
[daviddm-image]: https://david-dm.org/humpbackdev/generator-humpback.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/humpbackdev/generator-humpback
