/*
 * Telegram authentication route
 */
import express from 'express';
import { 
  validateTelegramWebAppData, 
  createUserFromTelegram 
} from '../../../core/telegram';
import { User, RegUser } from '../../../data/sql';
import { getIPFromRequest } from '../../../utils/ip';
import { getIdFromObject } from '../../../core/utils';
import logger from '../../../core/logger';

const router = express.Router();

/**
 * POST /api/auth/telegram
 * Authenticate user via Telegram WebApp
 */
router.post('/', async (req, res) => {
  try {
    const { initData, userData } = req.body;
    
    if (!initData) {
      return res.status(400).json({
        success: false,
        message: 'No Telegram init data provided',
      });
    }
    
    // Validate Telegram data
    const validatedUser = validateTelegramWebAppData(initData);
    
    if (!validatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Telegram authentication data',
      });
    }
    
    // Create user object
    const telegramUser = createUserFromTelegram(validatedUser);
    const ip = getIPFromRequest(req);
    
    // Check if user exists
    let user = await User.findOne({
      where: {
        oauth: `telegram:${validatedUser.id}`,
      },
    });
    
    if (!user) {
      // Create new user
      user = await User.create({
        oauth: `telegram:${validatedUser.id}`,
        name: telegramUser.name,
        verified: 1, // Telegram users are pre-verified
        ip,
      });
      
      // Create RegUser entry
      await RegUser.create({
        userId: user.id,
        ip,
      });
      
      logger.info(`New Telegram user registered: ${telegramUser.name} (${validatedUser.id})`);
    } else {
      // Update last login
      await user.update({
        ip,
        lastLogin: new Date(),
      });
      
      logger.info(`Telegram user logged in: ${user.name} (${validatedUser.id})`);
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.telegramUser = true;
    req.session.save();
    
    // Return user data
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        avatar: telegramUser.avatar,
        isPremium: telegramUser.isPremium,
        languageCode: telegramUser.languageCode,
        verified: true,
        canvases: {},
        blocked: false,
        userlvl: user.userlvl || 0,
      },
    });
  } catch (error) {
    logger.error('Telegram auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
});

/**
 * GET /api/auth/telegram/check
 * Check if user is authenticated via Telegram
 */
router.get('/check', (req, res) => {
  const isAuthenticated = req.session.userId && req.session.telegramUser;
  
  res.json({
    success: true,
    authenticated: isAuthenticated,
    userId: req.session.userId || null,
  });
});

/**
 * POST /api/auth/telegram/logout
 * Logout Telegram user
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destroy error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });
});

export default router;