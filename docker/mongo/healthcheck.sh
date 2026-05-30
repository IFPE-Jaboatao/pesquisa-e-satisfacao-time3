#!/bin/sh
set -e

# Prefer authenticated ping when root credentials are configured.
if [ -n "${MONGO_INITDB_ROOT_USERNAME:-}" ] && [ -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ]; then
  mongosh --quiet \
    -u "$MONGO_INITDB_ROOT_USERNAME" \
    -p "$MONGO_INITDB_ROOT_PASSWORD" \
    --authenticationDatabase admin \
    --eval 'db.adminCommand({ ping: 1 }).ok' >/dev/null 2>&1 && exit 0
fi

# Fallback for legacy volumes initialized without auth.
mongosh --quiet --eval 'db.adminCommand({ ping: 1 }).ok' >/dev/null 2>&1
