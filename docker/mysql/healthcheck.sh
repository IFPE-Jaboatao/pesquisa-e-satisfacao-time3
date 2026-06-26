#!/bin/sh
set -e

mysqladmin ping -h 127.0.0.1 -uroot -p"$MYSQL_ROOT_PASSWORD" >/dev/null 2>&1

if [ -n "${MYSQL_USER:-}" ] && [ -n "${MYSQL_PASSWORD:-}" ] && [ -n "${MYSQL_DATABASE:-}" ]; then
  # Conecta pelo IP do container (como o backend faz), não por 127.0.0.1/localhost.
  MYSQL_CHECK_HOST="$(hostname -i | awk '{print $1}')"
  mysql -h "$MYSQL_CHECK_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT 1" >/dev/null 2>&1
fi
