/*
 * Captcha loader worker - simplified for Telegram Mini App
 * Captcha is disabled for Telegram users (CAPTCHA_TIME=-1)
 */

const { parentPort } = require('worker_threads');

// Simple worker that does nothing since captcha is disabled
parentPort.on('message', (msg) => {
  if (msg.type === 'init') {
    console.log('Captcha worker initialized (disabled for Telegram users)');
    parentPort.postMessage({ type: 'ready' });
  } else if (msg.type === 'generate') {
    // Return empty captcha since it's disabled
    parentPort.postMessage({
      type: 'captcha',
      id: msg.id,
      text: '',
      svg: '',
      answer: ''
    });
  }
});

// Keep worker alive
setInterval(() => {}, 1000 * 60 * 60);