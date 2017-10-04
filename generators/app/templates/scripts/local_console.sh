#!/usr/bin/env bash
if [ $# -ne 0 ]
  then
    ahoy docker exec cli "./vendor/bin/drupal $1"
else
  echo "You need to pass the drupal console commands\n"
  ahoy docker exec cli "./vendor/bin/drupal list"
fi
