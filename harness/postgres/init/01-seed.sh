#!/bin/sh
# Runs once, on a fresh Postgres volume (docker-entrypoint-initdb.d).
# Builds app_template with schema + seed. Each test run clones it into "app"
# (see bin/reset-db), which takes seconds instead of reseeding.
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
CREATE DATABASE app_template;
SQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname app_template <<'SQL'
CREATE EXTENSION pg_stat_statements;
\i /contract/schema.sql
\i /seed/seed.sql
VACUUM ANALYZE;
SQL

# Template flag last: bin/up waits for it as the "seed finished" signal.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
ALTER DATABASE app_template WITH ALLOW_CONNECTIONS false IS_TEMPLATE true;
SQL
