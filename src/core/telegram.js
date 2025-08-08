/*
 * Telegram WebApp authentication and validation
 */
import crypto from 'crypto';

// Telegram bot token from environment
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * Validate Telegram WebApp init data
 * @param {string} initData - The initData string from Telegram WebApp
 * @returns {Object|null} - Parsed user data or null if invalid
 */
export function validateTelegramWebAppData(initData) {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  try {
    // Parse URL params
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Create data check string
    const dataCheckArr = [];
    for (const [key, value] of params.entries()) {
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Validate hash
    if (calculatedHash !== hash) {
      console.error('Invalid Telegram WebApp data hash');
      return null;
    }

    // Parse user data
    const user = params.get('user');
    if (user) {
      return JSON.parse(user);
    }

    return null;
  } catch (error) {
    console.error('Error validating Telegram WebApp data:', error);
    return null;
  }
}

/**
 * Create a user object from Telegram data
 * @param {Object} telegramUser - Telegram user data
 * @returns {Object} - User object for PixelPlanet
 */
export function createUserFromTelegram(telegramUser) {
  return {
    id: `tg_${telegramUser.id}`,
    name: telegramUser.username || `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name || '',
    username: telegramUser.username || `tg_${telegramUser.id}`,
    avatar: telegramUser.photo_url || null,
    isTelegramUser: true,
    languageCode: telegramUser.language_code || 'en',
    isPremium: telegramUser.is_premium || false,
  };
}

/**
 * Check if user needs captcha
 * @param {Object} user - User object
 * @returns {boolean} - Whether user needs captcha
 */
export function needsCaptcha(user) {
  // Telegram users don't need captcha
  if (user && user.isTelegramUser) {
    return false;
  }
  
  // Check normal captcha rules
  const captchaTime = parseInt(process.env.CAPTCHA_TIME, 10);
  if (captchaTime < 0) {
    return false; // Captcha disabled
  }
  
  return true; // Default behavior
}