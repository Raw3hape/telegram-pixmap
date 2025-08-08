/*
 * HTML template modifications for Telegram WebApp
 */

export const telegramWebAppScript = `
  <!-- Telegram WebApp SDK -->
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script>
    // Initialize Telegram WebApp immediately
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Set theme colors
      window.Telegram.WebApp.setHeaderColor('#2d2d2d');
      window.Telegram.WebApp.setBackgroundColor('#000000');
      
      // Store for later use
      window.telegramWebApp = window.Telegram.WebApp;
      
      console.log('Telegram WebApp initialized from HTML');
    }
  </script>
`;

export const telegramMetaTags = `
  <!-- Telegram WebApp Meta Tags -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="format-detection" content="telephone=no">
`;

export const telegramStyles = `
  <style>
    /* Telegram WebApp Specific Styles */
    body.telegram-webapp {
      margin: 0;
      padding: 0;
      overflow: hidden;
      touch-action: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    .telegram-login-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #000;
      color: #fff;
    }
    
    .telegram-login-loading .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .telegram-login-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #000;
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    
    .retry-button {
      margin-top: 20px;
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    
    .retry-button:active {
      background: #45a049;
    }
    
    /* Hide unnecessary UI elements in Telegram */
    .telegram-webapp .login-modal,
    .telegram-webapp .register-modal,
    .telegram-webapp .social-logins {
      display: none !important;
    }
    
    /* Optimize touch targets */
    .telegram-webapp button,
    .telegram-webapp .clickable {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Prevent zoom on double tap */
    .telegram-webapp * {
      touch-action: manipulation;
    }
  </style>
`;

export function injectTelegramSupport(html) {
  // Check if we need to inject Telegram support
  const isTelegramWebApp = html.includes('<!-- TELEGRAM_WEBAPP -->');
  
  if (!isTelegramWebApp) {
    return html;
  }
  
  // Inject in head
  html = html.replace('</head>', `
    ${telegramMetaTags}
    ${telegramStyles}
    ${telegramWebAppScript}
    </head>
  `);
  
  // Add class to body
  html = html.replace('<body', '<body class="telegram-webapp"');
  
  return html;
}