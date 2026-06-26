#!/bin/bash
set -e

# Garante que o usuário da aplicação aceite conexões de outros containers (host '%').
# O entrypoint padrão do MySQL pode criar o usuário apenas para localhost em alguns cenários.
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<EOSQL
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL
