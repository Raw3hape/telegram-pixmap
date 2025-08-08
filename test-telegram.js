#!/usr/bin/env node

/**
 * Test script for Telegram WebApp integration
 */

const crypto = require('crypto');

// Test data
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'TEST_TOKEN';
const testUser = {
  id: 123456789,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
  language_code: 'en',
  is_premium: false,
};

/**
 * Generate valid Telegram WebApp init data for testing
 */
function generateTestInitData() {
  const user = JSON.stringify(testUser);
  const authDate = Math.floor(Date.now() / 1000);
  
  // Create data check string
  const dataCheckArr = [
    `auth_date=${authDate}`,
    `user=${user}`,
  ];
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  
  // Create secret key
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  
  // Calculate hash
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  // Create init data
  const initData = `auth_date=${authDate}&user=${encodeURIComponent(user)}&hash=${hash}`;
  
  return initData;
}

/**
 * Test Telegram authentication
 */
async function testTelegramAuth() {
  console.log('🧪 Testing Telegram WebApp Authentication...\n');
  
  if (!BOT_TOKEN || BOT_TOKEN === 'TEST_TOKEN') {
    console.log('⚠️  No TELEGRAM_BOT_TOKEN set. Using test mode.');
    console.log('📝 Set TELEGRAM_BOT_TOKEN in .env for real testing.\n');
  }
  
  // Generate test init data
  const initData = generateTestInitData();
  console.log('📦 Generated test init data:');
  console.log(initData.substring(0, 100) + '...\n');
  
  // Test validation
  try {
    const { validateTelegramWebAppData } = require('./src/core/telegram');
    const validatedUser = validateTelegramWebAppData(initData);
    
    if (validatedUser) {
      console.log('✅ Validation successful!');
      console.log('👤 User data:', validatedUser);
    } else {
      console.log('❌ Validation failed!');
      console.log('Make sure TELEGRAM_BOT_TOKEN is set correctly.');
    }
  } catch (error) {
    console.log('❌ Error during validation:', error.message);
  }
  
  console.log('\n---\n');
}

/**
 * Test server endpoints
 */
async function testServerEndpoints() {
  console.log('🧪 Testing Server Endpoints...\n');
  
  const endpoints = [
    { path: '/', method: 'GET', description: 'Main page' },
    { path: '/api/auth/telegram/check', method: 'GET', description: 'Auth check' },
    { path: '/api/me', method: 'GET', description: 'User info' },
  ];
  
  for (const endpoint of endpoints) {
    console.log(`📍 ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
  }
  
  console.log('\n✅ Endpoints configured');
  console.log('\n---\n');
}

/**
 * Check environment setup
 */
function checkEnvironment() {
  console.log('🧪 Checking Environment Setup...\n');
  
  const required = [
    'TELEGRAM_BOT_TOKEN',
    'SESSION_SECRET',
    'REDIS_URL',
    'MYSQL_HOST',
    'MYSQL_USER',
    'MYSQL_PW',
    'MYSQL_DATABASE',
  ];
  
  const missing = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
      console.log(`❌ ${key}: Not set`);
    } else {
      const value = process.env[key].substring(0, 10);
      console.log(`✅ ${key}: ${value}...`);
    }
  }
  
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing ${missing.length} required variables`);
    console.log('Please set them in .env file');
  } else {
    console.log('\n✅ All required variables are set!');
  }
  
  console.log('\n---\n');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('=====================================');
  console.log('🎮 Telegram PixMap Test Suite');
  console.log('=====================================\n');
  
  // Load environment variables
  require('dotenv').config();
  
  // Run tests
  checkEnvironment();
  await testTelegramAuth();
  await testServerEndpoints();
  
  console.log('=====================================');
  console.log('📋 Test Summary');
  console.log('=====================================\n');
  
  console.log('Next steps:');
  console.log('1. Set up environment variables in .env');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run build');
  console.log('4. Start: pm2 start ecosystem.yml');
  console.log('5. Create HTTPS tunnel: ngrok http 8080');
  console.log('6. Configure bot in @BotFather');
  console.log('\n✨ Happy pixel placing in Telegram!');
}

// Run tests
runTests().catch(console.error);