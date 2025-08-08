#!/bin/bash

# Telegram PixMap Deployment Script for Railway

echo "🚀 Starting Telegram PixMap deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please configure your .env file with your settings"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. No dist directory found."
    exit 1
fi

echo "✅ Build successful!"

# Railway auto-deployment
if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "🚂 Detected Railway environment"
    echo "🎯 Starting server..."
    node dist/server.js
else
    echo "💻 Running in local environment"
    echo "To deploy to Railway:"
    echo "1. Install Railway CLI: npm install -g @railway/cli"
    echo "2. Login: railway login"
    echo "3. Link project: railway link"
    echo "4. Deploy: railway up"
fi