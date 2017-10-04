#!/usr/bin/env bash
SITE_UUID="<%= siteUuid %>"
ahoy drush cc drush
echo "Installing..."
ahoy drush si <%= appName %> --account-pass=admin -y
echo "Set site uuid..."
ahoy drush config-set "system.site" uuid "$SITE_UUID" -y
echo "Importing config..."
if [ -f ./config/sync/core.extension.yml ] ; then ahoy drush cim -y ; fi
echo "Cleaning cache..."
ahoy drush cr
