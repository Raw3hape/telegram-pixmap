/*
 * Security middleware for Telegram WebApp
 */

export function setupTelegramSecurity(app) {
  // Allow iframe embedding for Telegram
  app.use((req, res, next) => {
    // Check if request is from Telegram
    const referer = req.get('Referer');
    const userAgent = req.get('User-Agent');
    
    const isTelegram = 
      (referer && referer.includes('telegram.org')) ||
      (userAgent && userAgent.includes('TelegramBot')) ||
      req.query.platform === 'telegram' ||
      req.headers['x-telegram-webapp'] === '1';
    
    if (isTelegram) {
      // Allow Telegram to embed in iframe
      res.removeHeader('X-Frame-Options');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      
      // Set CSP to allow Telegram
      res.setHeader('Content-Security-Policy', 
        "frame-ancestors 'self' https://*.telegram.org https://telegram.org;"
      );
    } else {
      // Default security for non-Telegram
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
    
    // CORS headers for Telegram
    if (isTelegram) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
  });
  
  // Handle preflight requests
  app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
  });
}

export function detectTelegramWebApp(req, res, next) {
  // Detect if request is from Telegram WebApp
  const initData = req.headers['x-telegram-init-data'] || 
                   req.query.tgWebAppData ||
                   req.body?.telegramInitData;
  
  if (initData) {
    req.isTelegramWebApp = true;
    req.telegramInitData = initData;
  } else {
    req.isTelegramWebApp = false;
  }
  
  next();
}

export function requireTelegramAuth(req, res, next) {
  if (!req.session.telegramUser) {
    return res.status(401).json({
      success: false,
      message: 'Telegram authentication required',
    });
  }
  
  next();
}