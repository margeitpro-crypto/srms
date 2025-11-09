#!/bin/bash

# Deploy script for SRMS

echo "Building frontend..."
cd frontend
npm run build

echo "Deploying backend..."
cd ../backend
npm run build  # If applicable

echo "Deployment complete."
