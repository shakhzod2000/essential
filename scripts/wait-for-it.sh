#!/usr/bin/env bash
# wait-for-it.sh
until nc -z -v -w30 db 3306
do
  echo "Waiting for MySQL connection..."
  sleep 5
done
echo "MySQL is up and running!"
exec "$@"