// ===== Notification System =====
// Handles toast notifications for game events and OS alerts

import { soundManager } from './soundManager.js';

class NotificationSystem {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isProcessing = false;
    }

    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    /**
     * Show a notification
     * @param {Object} options
     * @param {string} options.title - Notification title
     * @param {string} options.message - Notification body text
     * @param {string} options.icon - Optional emoji or icon character
     * @param {string} options.type - 'info' | 'success' | 'warning' | 'error' | 'achievement'
     * @param {number} options.duration - Duration in ms (default 4000)
     */
    show({ title, message, icon = '🔔', type = 'info', duration = 4000 }) {
        this.ensureContainer();

        const notification = document.createElement('div');
        notification.className = `os-notification os-notification-${type}`;

        notification.innerHTML = `
      <div class="os-notification-icon">${icon}</div>
      <div class="os-notification-content">
        <div class="os-notification-title">${title}</div>
        <div class="os-notification-message">${message}</div>
      </div>
      <button class="os-notification-close">×</button>
    `;

        // Play sound
        soundManager.play('notify');

        // Add to container
        this.container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });

        // Close button
        const closeBtn = notification.querySelector('.os-notification-close');
        closeBtn.addEventListener('click', () => {
            this.dismiss(notification);
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    this.dismiss(notification);
                }
            }, duration);
        }
    }

    dismiss(notification) {
        notification.classList.remove('visible');
        notification.classList.add('hiding');

        // Wait for animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

export const notificationSystem = new NotificationSystem();

// ===== Windows 11-Style Notification System =====
// Manages toasts and (optionally) a Notification Center

// Queue for pending notifications
const queue = [];
let isShowing = false;
let container = null;

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-area';
    container.style.cssText = 'position: fixed; bottom: 60px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; pointer-events: none;';
    document.body.appendChild(container);
  }
  return container;
}

export const notificationSystem = {
  
  /**
   * Show a toast notification
   * @param {Object} options { title, message, icon, type = 'info', duration = 5000, onClick }
   */
  show(options) {
    const { title, message, icon = '🔔', type = 'info', duration = 5000, onClick } = options;
    
    // Play sound
    // if (window.soundManager) window.soundManager.play('notification');

    const toast = document.createElement('div');
    toast.className = 'os-toast';
    toast.style.cssText = `
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 4px solid ${getTypeColor(type)};
      border-radius: 8px;
      padding: 16px;
      width: 320px;
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transform: translateX(120%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
      pointer-events: auto;
      cursor: ${onClick ? 'pointer' : 'default'};
      display: flex;
      gap: 12px;
    `;

    toast.innerHTML = `
      <div style="font-size: 24px;">${icon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 12px; opacity: 0.8; line-height: 1.4;">${message}</div>
      </div>
      <button class="toast-close" style="background:none; border:none; color:white; opacity:0.5; cursor:pointer; font-size: 18px; padding:0; height: 20px;">×</button>
    `;

    const area = ensureContainer();
    area.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Handle Click
    if (onClick) {
      toast.addEventListener('click', (e) => {
        if (!e.target.closest('.toast-close')) {
          onClick();
          closeToast();
        }
      });
    }

    // Handle Close Button
    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    // Auto Close
    let timer = setTimeout(closeToast, duration);

    function closeToast() {
      clearTimeout(timer);
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400); // Remove after animation
    }
  }
};

function getTypeColor(type) {
  switch (type) {
    case 'success': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    case 'quest': return '#8b5cf6';
    default: return '#3b82f6';
  }
}
