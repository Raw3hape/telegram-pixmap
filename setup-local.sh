#!/bin/bash

# Local setup script for Telegram PixMap

echo "🎮 Telegram PixMap Local Setup"
echo "================================"

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install redis
            brew services start redis
        else
            echo "❌ Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install redis-server
        sudo systemctl start redis-server
    else
        echo "❌ Unsupported OS. Please install Redis manually."
        exit 1
    fi
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mysql
            brew services start mysql
        else
            echo "❌ Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install mysql-server
        sudo systemctl start mysql
    else
        echo "❌ Unsupported OS. Please install MySQL manually."
        exit 1
    fi
fi

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate random session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your_random_session_secret_here/$SESSION_SECRET/g" .env
    
    echo "⚠️  Please edit .env file and add your Telegram Bot Token"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Setup ngrok for HTTPS tunnel
if ! command -v ngrok &> /dev/null; then
    echo "🔒 Installing ngrok for HTTPS tunnel..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ngrok/ngrok/ngrok
    else
        curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
        echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
        sudo apt update && sudo apt install ngrok
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and add your TELEGRAM_BOT_TOKEN"
echo "2. Start the server: pm2 start ecosystem.yml"
echo "3. Create HTTPS tunnel: ngrok http 8080"
echo "4. Copy the HTTPS URL from ngrok"
echo "5. Set your bot's Menu Button URL in @BotFather"
echo ""
echo "🚀 Quick start:"
echo "   pm2 start ecosystem.yml && ngrok http 8080"
echo ""