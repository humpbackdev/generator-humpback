<?php

/**
 * @file
 * Drupal site-specific configuration file.
 */

$databases = [];

/**
 * Include secret configuration.
 *
 * Contains database settings and other sensitive environment specific
 * information that shouldn't be in version control.
 */
if (file_exists($app_root . '/' . $site_path . '/settings.secret.php')) {
  include $app_root . '/' . $site_path . '/settings.secret.php';
}
$config_directories = [];
$settings['update_free_access'] = FALSE;
$config['system.performance']['fast_404']['exclude_paths'] = '/\/(?:styles)|(?:system\/files)\//';
$config['system.performance']['fast_404']['paths'] = '/\.(?:txt|png|gif|jpe?g|css|js|ico|swf|flv|cgi|bat|pl|dll|exe|asp)$/i';
$config['system.performance']['fast_404']['html'] = '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL "@path" was not found on this server.</p></body></html>';
$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];
ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);
ini_set('session.gc_maxlifetime', 200000);
ini_set('session.cookie_lifetime', 2000000);

/**
 * Include local configuration.
 *
 * IMPORTANT: This block should remain at the bottom of this file.
 */
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}

if ((file_exists($app_root . '/' . $site_path . '/settings.<%= deployEnv.toLowerCase() %>.php')) && empty($databases)) {
  include $app_root . '/' . $site_path . '/settings.<%= deployEnv.toLowerCase() %>.php';
}

$settings['install_profile'] = '<%= appName %>';
$settings['config_sync_directory'] = 'sites/default/config/sync';
