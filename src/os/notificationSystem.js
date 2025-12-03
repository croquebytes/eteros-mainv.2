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
