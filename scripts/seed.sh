#!/bin/bash

# Seed script for SRMS database

cd backend
npm run seed

echo "Seeding data for new modules..."
node ../database/seeders/002_seed_new_modules.js
