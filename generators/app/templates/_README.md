# <%= humanName %>

<%= humanName %> Drupal Distribution

### Dependencies

* Docker
* [Ahoy] (https://github.com/ahoy-cli/ahoy/releases)

### Getting Started

#### Prepare for local development:

```bash
ahoy up
```

When you want to stop containers, you can run:

```bash
ahoy stop
```

Once created your containers; you should prepare your local site.

Generate local settings file:

```bash
ahoy site local-settings
```

Prepare the local site:

```bash
composer install
npm install
```

Install the local site

```bash
ahoy site install
```

### Site UUID.
Site uuid can be found in the installation script. You should create a variable named `SITE_UUID` in CircleCI and set it to that value so that CircleCI builds work as expected.


In order to run behat tests; you should execute:

```bash
ahoy site behat
```

### Build Environment

To build this environment you need recent docker compose and docker versions.
After placing Drupal in the right folder, you should run `docker-compose up -d` or `ahoy up` and voilá! You can access your Drupal installation at the url provided by `ahoy docker url`

## Installed Stuff

### Nginx

Nginx is running in port 80. Use `ahoy docker url` to get the url.

### PHP-FPM

PHP is running in a separate container using fpm in port 9000 (not accessible from host).

### Mariadb

Credentials are in environment variables in docker-compose.yml.

### Solr

Please be patient because it takes around 3-5 minutes to start when you create the containers.

Core is created as "collection1". Solr address is "solr". Path is "/solr".

### Cli

This container have some cli utilities to manage your drupal site. See https://hub.docker.com/r/kporras07/docker-drupal-cli/ for more info.

In order to access the cli, you should run `ahoy bash`. Now, you can run commands like drush, ahoy, composer, node, grunt, python, etc inside the container.

### Selenium

Set wd_host to 'http://browser:4444/wd/hub' in behat config. If you need vnc, you can connect to url given by `ahoy docker vnc-url` using 'secret' as password.

## Ngrok

This is used to share your local environment over the internet. In order to do this, you should run `ahoy docker share-url`. This command will give you an url that you can access in your browser and get the share urls for http and https.

## Varnish

It's a reverse proxy usually used in production. It's bundled here for situations where you need to test with the varnish cache. In order to access the site through varnish, run `ahoy docker varnish-url` and open that url in your browser.

## Mailhog

To see the the mailhog UI, run `ahoy docker mailhog-url` and access that url from the browser. Your new messages will appear there.
In order to send your emails from Drupal to mailhog you have two choices: using default sendmail configuration or using SMTP. If you decide for SMTP, you should set the mailhog host and port (mailhog:1025).

## Blackfire
This tool also contains the Blackfire profiling tool, to configure it please put your server id and server token into the `.env` file, for more documentation about Blackfire go to this web page: https://blackfire.io/

## Ahoy commands

Some helpful commands are included using useful ahoy cli utility. In order to use them, you must install ahoy (https://github.com/ahoy-cli/ahoy) and then `ahoy help`
