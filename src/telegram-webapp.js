/*
 * Telegram WebApp client-side integration
 */

class TelegramWebApp {
  constructor() {
    this.tg = null;
    this.isReady = false;
  }

  init() {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      
      // Expand to full height
      this.tg.expand();
      
      // Set header color to match PixelPlanet theme
      this.tg.setHeaderColor('#2d2d2d');
      this.tg.setBackgroundColor('#000000');
      
      // Enable closing confirmation
      this.tg.enableClosingConfirmation();
      
      // Signal ready
      this.tg.ready();
      
      this.isReady = true;
      
      // Setup back button handler
      this.setupBackButton();
      
      // Setup main button for sharing
      this.setupMainButton();
      
      console.log('Telegram WebApp initialized');
      return true;
    }
    
    console.log('Not running in Telegram WebApp');
    return false;
  }
  
  setupBackButton() {
    if (!this.tg) return;
    
    // Show back button when zoomed in
    document.addEventListener('wheel', (e) => {
      const currentZoom = window.store?.getState()?.canvas?.scale || 1;
      if (currentZoom > 5) {
        this.tg.BackButton.show();
      } else {
        this.tg.BackButton.hide();
      }
    });
    
    // Handle back button click
    this.tg.BackButton.onClick(() => {
      // Reset zoom or go back
      if (window.store) {
        window.store.dispatch({
          type: 'SET_SCALE',
          scale: 1,
        });
      }
      this.tg.BackButton.hide();
    });
  }
  
  setupMainButton() {
    if (!this.tg) return;
    
    // Setup share button
    this.tg.MainButton.text = '📤 Share Canvas';
    this.tg.MainButton.color = '#4CAF50';
    this.tg.MainButton.textColor = '#FFFFFF';
    
    this.tg.MainButton.onClick(() => {
      this.shareCanvas();
    });
    
    // Show button after some activity
    setTimeout(() => {
      this.tg.MainButton.show();
    }, 5000);
  }
  
  shareCanvas() {
    if (!this.tg) return;
    
    // Get current canvas position
    const state = window.store?.getState();
    const canvasId = state?.canvas?.canvasId || 0;
    const x = state?.canvas?.view?.[0] || 0;
    const y = state?.canvas?.view?.[1] || 0;
    
    // Create share URL
    const shareUrl = `https://t.me/${this.getBotUsername()}?startapp=c${canvasId}_${x}_${y}`;
    const shareText = `Check out my pixel art on PixMap! 🎨\n${shareUrl}`;
    
    // Use Telegram's share method
    this.tg.switchInlineQuery(shareText, ['users', 'groups', 'channels']);
  }
  
  getBotUsername() {
    // This should be set from environment or config
    return process.env.TELEGRAM_BOT_USERNAME || 'YourBotUsername';
  }
  
  getInitData() {
    return this.tg?.initData || null;
  }
  
  getInitDataUnsafe() {
    return this.tg?.initDataUnsafe || null;
  }
  
  getUserData() {
    if (!this.tg) return null;
    
    const userData = this.tg.initDataUnsafe?.user;
    if (!userData) return null;
    
    return {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username,
      languageCode: userData.language_code,
      isPremium: userData.is_premium,
      photoUrl: userData.photo_url,
    };
  }
  
  showPopup(title, message, buttons = [{ type: 'ok' }]) {
    if (!this.tg) {
      alert(message);
      return;
    }
    
    this.tg.showPopup({
      title,
      message,
      buttons,
    });
  }
  
  showAlert(message) {
    if (!this.tg) {
      alert(message);
      return;
    }
    
    this.tg.showAlert(message);
  }
  
  hapticFeedback(type = 'impact', style = 'light') {
    if (!this.tg || !this.tg.HapticFeedback) return;
    
    switch (type) {
      case 'impact':
        this.tg.HapticFeedback.impactOccurred(style);
        break;
      case 'notification':
        this.tg.HapticFeedback.notificationOccurred(style);
        break;
      case 'selection':
        this.tg.HapticFeedback.selectionChanged();
        break;
    }
  }
  
  close() {
    if (this.tg) {
      this.tg.close();
    }
  }
  
  isAvailable() {
    return this.isReady && this.tg !== null;
  }
  
  getThemeParams() {
    return this.tg?.themeParams || {};
  }
  
  getColorScheme() {
    return this.tg?.colorScheme || 'light';
  }
  
  onEvent(eventType, callback) {
    if (!this.tg) return;
    
    this.tg.onEvent(eventType, callback);
  }
  
  offEvent(eventType, callback) {
    if (!this.tg) return;
    
    this.tg.offEvent(eventType, callback);
  }
}

// Create singleton instance
const telegramWebApp = new TelegramWebApp();

// Auto-init when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      telegramWebApp.init();
    });
  } else {
    telegramWebApp.init();
  }
}

export default telegramWebApp;