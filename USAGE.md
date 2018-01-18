Humpback Generator
==================

## Dependencies

* Docker
* [Ahoy] (https://github.com/ahoy-cli/ahoy/releases)

## Getting Started

### Prepare for local development:

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
./scripts/local_settings.sh
```

Prepare the local site:

```bash
composer install
npm install
```

Install the local site

```bash
./scripts/<your_app>_local_install.sh
```

### Site UUID.
Site uuid can be found in the installation script. You should create a variable named `SITE_UUID` in CircleCI and set it to that value so that CircleCI builds work as expected.

### Development domain
Copy env.example to .env and edit domain name to whatever you want to use the bundled proxy to access your site at that domain (ports 80 and 8085 should be free for proxy to work)

### Behat tests

In order to run behat tests; you should execute:

```bash
./scripts/local_behat.sh
```

## Installed Stuff

### Nginx

Nginx is running in port 80. Use `ahoy docker url` to get the url. If proxy is running, you can access your site at the defined domain in .env file.

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

You can run drush directly by executing `ahoy drush`

## Ngrok

This is used to share your local environment over the internet. In order to do this, you should run `ahoy docker share-url`. This command will give you an url that you can access in your browser and get the share urls for http and https.

## Varnish

It's a reverse proxy usually used in production. It's bundled here for situations where you need to test with the varnish cache. In order to access the site through varnish, run `ahoy docker varnish-url` and open that url in your browser. If proxy is running, you can access site through varnish at http://varnish.<domain> 

## Mailhog

To see the the mailhog UI, run `ahoy docker mailhog-url` and access that url from the browser. Your new messages will appear there. If proxy is running, you can access mailhog at http://mailhog.<domain> 
  
## VNC

If you run behat tests using selenium, you can see the stuff that is happening in real time. To do this, connect to vnc using the url provided by `ahoy docker vnc-url` and use "secret" as password.

Have fun!
