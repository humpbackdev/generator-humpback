# generator-humpback [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Generate a Drupal project using Humpback

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

## Contributing

Use the project, fork it, and submit PRs. We are responsive and will review them as soon as possible!

## Credits and Usage

Humpback is a trademark of Estudio Manatí S.A. You are free to use the logo to promote the Humpback product as long as you do not modify it in any way.

Drupal is a registered trademark of Dries Buytaert.

Docker and the Docker logo are trademarks or registered trademarks of Docker, Inc. in the United States and/or other countries. Docker, Inc. and other parties may also have trademark rights in other terms used herein.

## License

GPL-3.0 © Estudio Manatí S.A.


[npm-image]: https://badge.fury.io/js/generator-humpback.svg
[npm-url]: https://npmjs.org/package/generator-humpback
[travis-image]: https://travis-ci.org/humpbackdev/generator-humpback.svg?branch=master
[travis-url]: https://travis-ci.org/humpbackdev/generator-humpback
[daviddm-image]: https://david-dm.org/humpbackdev/generator-humpback.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/humpbackdev/generator-humpback
