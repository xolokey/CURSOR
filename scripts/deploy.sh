#!/bin/bash

# Deployment script for Cursor Clone
set -e

echo "🚀 Starting deployment process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t cursor-clone:latest .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Start the application
echo "🚀 Starting application..."
docker-compose up -d

# Wait for health check
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check health
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy and running!"
    echo "🌐 Access your application at: http://localhost:3000"
else
    echo "❌ Health check failed. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
