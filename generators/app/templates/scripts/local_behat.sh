#!/usr/bin/env bash
if [ $# -eq 0 ]
  then
    ahoy docker exec cli "./vendor/bin/behat"
else
  ahoy docker exec cli "./vendor/bin/behat ./tests/behat/features/$1.feature"
  vagrant ssh -c "cd /var/www/cecr; ./vendor/bin/behat ./tests/behat/features/$1.feature"
fi
