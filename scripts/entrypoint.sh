#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting the app..."
npm run start:prod