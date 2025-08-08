/*
 * Mobile optimizations for Telegram WebApp
 */
import React, { useEffect } from 'react';
import telegramWebApp from '../telegram-webapp';

const MobileOptimizations = () => {
  useEffect(() => {
    // Prevent default touch behaviors
    const preventDefaultTouch = (e) => {
      // Allow scrolling on specific elements
      if (e.target.closest('.scrollable')) {
        return;
      }
      
      // Prevent pinch zoom
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    // Optimize canvas touch events
    const optimizeCanvasTouch = () => {
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return;
      
      let lastTouchTime = 0;
      let touchStartPos = null;
      
      // Handle touch start
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
        
        // Haptic feedback on touch
        if (telegramWebApp.isAvailable()) {
          telegramWebApp.hapticFeedback('selection');
        }
      }, { passive: false });
      
      // Handle touch end for pixel placement
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!touchStartPos) return;
        
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartPos.time;
        
        // Quick tap = place pixel
        if (touchDuration < 200) {
          const touch = e.changedTouches[0];
          const moveDistance = Math.sqrt(
            Math.pow(touch.clientX - touchStartPos.x, 2) +
            Math.pow(touch.clientY - touchStartPos.y, 2)
          );
          
          // If finger didn't move much, it's a tap
          if (moveDistance < 10) {
            // Trigger pixel placement
            const clickEvent = new MouseEvent('click', {
              clientX: touch.clientX,
              clientY: touch.clientY,
              bubbles: true,
            });
            canvas.dispatchEvent(clickEvent);
            
            // Haptic feedback on pixel placement
            if (telegramWebApp.isAvailable()) {
              telegramWebApp.hapticFeedback('impact', 'light');
            }
          }
        }
        
        touchStartPos = null;
      }, { passive: false });
      
      // Handle double tap for zoom
      canvas.addEventListener('touchstart', (e) => {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTouchTime;
        
        if (tapLength < 300 && tapLength > 0) {
          e.preventDefault();
          // Double tap detected - zoom in
          const zoomEvent = new WheelEvent('wheel', {
            deltaY: -100,
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            bubbles: true,
          });
          canvas.dispatchEvent(zoomEvent);
          
          // Haptic feedback
          if (telegramWebApp.isAvailable()) {
            telegramWebApp.hapticFeedback('impact', 'medium');
          }
        }
        
        lastTouchTime = currentTime;
      }, { passive: false });
    };
    
    // Optimize performance
    const optimizePerformance = () => {
      // Reduce canvas resolution on low-end devices
      if (window.devicePixelRatio > 2) {
        // High DPI screen, reduce pixel ratio for performance
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          canvas.style.imageRendering = 'pixelated';
        }
      }
      
      // Disable animations if requested
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
      }
      
      // Use passive listeners for scroll events
      document.addEventListener('touchmove', () => {}, { passive: true });
    };
    
    // Add mobile-specific UI enhancements
    const enhanceMobileUI = () => {
      // Add touch-friendly classes
      document.body.classList.add('touch-device');
      
      // Enlarge clickable areas
      const buttons = document.querySelectorAll('button, .clickable');
      buttons.forEach((btn) => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
      });
      
      // Add visual feedback for touches
      document.addEventListener('touchstart', (e) => {
        const target = e.target;
        if (target.classList.contains('clickable') || target.tagName === 'BUTTON') {
          target.classList.add('touched');
        }
      });
      
      document.addEventListener('touchend', (e) => {
        const target = e.target;
        if (target.classList.contains('touched')) {
          setTimeout(() => {
            target.classList.remove('touched');
          }, 100);
        }
      });
    };
    
    // Initialize optimizations
    document.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    optimizeCanvasTouch();
    optimizePerformance();
    enhanceMobileUI();
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', preventDefaultTouch);
    };
  }, []);
  
  return null;
};

export default MobileOptimizations;