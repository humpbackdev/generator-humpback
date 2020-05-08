<?php

/**
 * @file
 * Secret configuration settings for the site.
 */

// Database.
$databases = array(
  'default' => array(
    'default' => array(
      'database' => 'drupal',
      'username' => 'root',
      'password' => 'drupal',
      'host' => '127.0.0.1',
      'driver' => 'mysql',
    ),
  ),
);

$settings['hash_salt'] = 'circle';
