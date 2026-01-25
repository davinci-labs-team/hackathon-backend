#!/bin/sh

echo "Installing Python dependencies..."
npm run prestart:dev

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting the app..."
npm run start:prod