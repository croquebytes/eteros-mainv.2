// ===== Overclock System =====
// Risk/Reward mechanic for boosting performance
// "Push it to the limit!"

import { eventBus, EVENTS } from './eventBus.js';
import { showToast } from '../os/toastManager.js';

export const OVERCLOCK_CONFIG = {
    maxHeat: 100,
    heatPerSecond: 2,           // Heat generated per second when active
    coolingPerSecond: 5,        // Heat dissipated per second when inactive
    throttleThreshold: 100,     // Heat level that triggers throttling
    throttleDuration: 30000,    // Duration of throttling in ms (30s)

    // Bonuses when Overclocked
    bonuses: {
        gameSpeed: 1.5,           // 1.5x speed
        attackBonus: 0.2,         // +20% damage
        xpBonus: 0.2              // +20% XP
    },

    // Penalties when Throttled
    penalties: {
        gameSpeed: 0.5,           // 0.5x speed
        attackPenalty: 0.5        // -50% damage
    }
};

export const overclockSystem = {
    active: false,
    throttled: false,
    heat: 0,
    throttleEndTime: 0,

    // Initialize state from save
    init(savedState) {
        if (savedState) {
            this.active = false; // Always start inactive
            this.throttled = savedState.throttled || false;
            this.heat = savedState.heat || 0;
            this.throttleEndTime = savedState.throttleEndTime || 0;

            // Check if throttling should still be active
            if (this.throttled && Date.now() > this.throttleEndTime) {
                this.throttled = false;
            }
        }

        // Start the heat loop
        this.startLoop();
    },

    toggle() {
        if (this.throttled) {
            showToast('System is thermally throttled! Cannot overclock.', 'error');
            return false;
        }

        this.active = !this.active;

        if (this.active) {
            showToast('Overclocking ENABLED. Monitor heat levels!', 'warning');
        } else {
            showToast('Overclocking DISABLED. System cooling down.', 'info');
        }

        eventBus.emit('overclock_toggled', this.active);
        return this.active;
    },

    startLoop() {
        setInterval(() => {
            this.update(1); // 1 second tick
        }, 1000);
    },

    update(dt) {
        // Handle Throttling
        if (this.throttled) {
            if (Date.now() > this.throttleEndTime) {
                this.throttled = false;
                this.heat = 50; // Reset to 50% heat
                showToast('Thermal throttling expired. System stable.', 'success');
                eventBus.emit('overclock_state_changed');
            }
        }

        // Handle Heat Generation/Dissipation
        if (this.active && !this.throttled) {
            this.heat += OVERCLOCK_CONFIG.heatPerSecond * dt;

            if (this.heat >= OVERCLOCK_CONFIG.throttleThreshold) {
                this.triggerThrottle();
            }
        } else {
            this.heat = Math.max(0, this.heat - (OVERCLOCK_CONFIG.coolingPerSecond * dt));
        }

        // Emit update for UI
        eventBus.emit('overclock_update', {
            active: this.active,
            throttled: this.throttled,
            heat: this.heat
        });
    },

    triggerThrottle() {
        this.active = false;
        this.throttled = true;
        this.heat = 100;
        this.throttleEndTime = Date.now() + OVERCLOCK_CONFIG.throttleDuration;

        showToast('CRITICAL TEMP REACHED! System throttling engaged.', 'error');
        eventBus.emit('overclock_throttled');
    },

    // Get current multipliers
    getMultipliers() {
        if (this.throttled) {
            return {
                speed: OVERCLOCK_CONFIG.penalties.gameSpeed,
                damage: 1 - OVERCLOCK_CONFIG.penalties.attackPenalty,
                xp: 1
            };
        }

        if (this.active) {
            return {
                speed: OVERCLOCK_CONFIG.bonuses.gameSpeed,
                damage: 1 + OVERCLOCK_CONFIG.bonuses.attackBonus,
                xp: 1 + OVERCLOCK_CONFIG.bonuses.xpBonus
            };
        }

        return { speed: 1, damage: 1, xp: 1 };
    },

    getState() {
        return {
            active: this.active,
            throttled: this.throttled,
            heat: this.heat,
            throttleEndTime: this.throttleEndTime
        };
    }
};
