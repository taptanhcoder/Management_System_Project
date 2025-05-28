#!/usr/bin/env sh
echo "Waiting for Postgres to be ready."
until pg_isready -h "postgres" -p "5432" -U "dtnghia"; do
    sleep 1
done

echo "Postgres is up - applying migrations"
npx prisma migrate deploy

echo "Starting Next.js"
npm run start
