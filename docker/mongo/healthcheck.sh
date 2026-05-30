#!/bin/sh
set -e

if [ -n "${MONGO_INITDB_ROOT_USERNAME:-}" ] && [ -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ]; then
  mongosh --quiet \
    -u "$MONGO_INITDB_ROOT_USERNAME" \
    -p "$MONGO_INITDB_ROOT_PASSWORD" \
    --authenticationDatabase admin \
    --eval 'db.adminCommand({ ping: 1 }).ok' >/dev/null 2>&1
  exit $?
fi

mongosh --quiet --eval 'db.adminCommand({ ping: 1 }).ok' >/dev/null 2>&1
