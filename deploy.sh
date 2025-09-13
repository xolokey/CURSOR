#!/bin/bash

# 🚀 Comprehensive AI Development Platform - Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 Comprehensive AI Development Platform - Deployment Script"
echo "============================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    echo "   Run: vercel login"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Vercel CLI is ready"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🌐 Your application is now live on Vercel!"
    echo "📖 Check DEPLOYMENT_GUIDE.md for more information"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi