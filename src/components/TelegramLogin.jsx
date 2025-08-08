/*
 * Telegram Login Component
 */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import telegramWebApp from '../telegram-webapp';
import { loginWithTelegram } from '../store/actions/auth';

const TelegramLogin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegramAuth = async () => {
      try {
        // Check if we're in Telegram WebApp
        if (!telegramWebApp.isAvailable()) {
          setError('Please open this app through Telegram');
          setIsLoading(false);
          return;
        }

        // Get init data for authentication
        const initData = telegramWebApp.getInitData();
        const userData = telegramWebApp.getUserData();

        if (!initData || !userData) {
          setError('Unable to get Telegram user data');
          setIsLoading(false);
          return;
        }

        // Send to backend for validation and login
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData,
            userData,
          }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(loginWithTelegram(data.user));
          
          // Haptic feedback on successful login
          telegramWebApp.hapticFeedback('notification', 'success');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Authentication failed');
          
          // Haptic feedback on error
          telegramWebApp.hapticFeedback('notification', 'error');
        }
      } catch (err) {
        console.error('Telegram auth error:', err);
        setError('Connection error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Auto-login if in Telegram
    if (telegramWebApp.isAvailable()) {
      initTelegramAuth();
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="telegram-login-loading">
        <div className="spinner" />
        <p>Connecting to PixMap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-login-error">
        <p>⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!telegramWebApp.isAvailable()) {
    return (
      <div className="telegram-login-prompt">
        <h3>Welcome to PixMap!</h3>
        <p>Please open this app through Telegram to start playing.</p>
        <a 
          href={`https://t.me/${process.env.TELEGRAM_BOT_USERNAME || 'YourBotUsername'}`}
          className="telegram-link"
        >
          Open in Telegram
        </a>
      </div>
    );
  }

  return null;
};

export default TelegramLogin;