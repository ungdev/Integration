#!/bin/sh

set -e

# Wait for PostgreSQL to be ready
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT"; do
  echo "Waiting for DB..."
  sleep 2
done



# Run migrations and start the app
npm run migrate
npm run start
