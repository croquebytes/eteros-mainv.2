// ===== Overclock App =====
// UI for managing system overclocking

import { overclockSystem, OVERCLOCK_CONFIG } from '../../state/overclockSystem.js';
import { eventBus } from '../../state/eventBus.js';

export const overclockApp = {
    id: 'overclockApp',
    title: 'Overclock Daemon – OC_Tool.exe',

    createContent(rootEl) {
        this.render(rootEl);

        // Subscribe to updates
        eventBus.on('overclock_update', (data) => {
            this.updateUI(rootEl, data);
        });

        eventBus.on('overclock_throttled', () => {
            this.render(rootEl);
        });

        eventBus.on('overclock_state_changed', () => {
            this.render(rootEl);
        });
    },

    render(rootEl) {
        const state = overclockSystem.getState();
        const multipliers = overclockSystem.getMultipliers();

        rootEl.innerHTML = `
      <div class="window-content overclock-app">
        <div class="oc-header">
          <div class="oc-status ${state.throttled ? 'status-critical' : state.active ? 'status-warning' : 'status-stable'}">
            ${state.throttled ? '⚠️ THERMAL THROTTLING' : state.active ? '⚡ OVERCLOCK ACTIVE' : '✓ SYSTEM STABLE'}
          </div>
        </div>
        
        <div class="oc-gauge-container">
          <div class="oc-gauge-label">CORE TEMPERATURE</div>
          <div class="oc-gauge-track">
            <div id="oc-heat-bar" class="oc-gauge-fill" style="width: ${state.heat}%; background: ${this.getHeatColor(state.heat)}"></div>
          </div>
          <div class="oc-heat-value"><span id="oc-heat-text">${Math.floor(state.heat)}</span>°C</div>
        </div>
        
        <div class="oc-controls">
          <button id="oc-toggle-btn" class="btn-oc ${state.active ? 'active' : ''}" ${state.throttled ? 'disabled' : ''}>
            ${state.active ? 'DISABLE OVERCLOCK' : 'ENABLE OVERCLOCK'}
          </button>
        </div>
        
        <div class="oc-stats">
          <div class="oc-stat-row">
            <span>Clock Speed:</span>
            <span class="${multipliers.speed > 1 ? 'bonus' : multipliers.speed < 1 ? 'penalty' : ''}">${(multipliers.speed * 100).toFixed(0)}%</span>
          </div>
          <div class="oc-stat-row">
            <span>Voltage (DMG):</span>
            <span class="${multipliers.damage > 1 ? 'bonus' : multipliers.damage < 1 ? 'penalty' : ''}">${(multipliers.damage * 100).toFixed(0)}%</span>
          </div>
          <div class="oc-stat-row">
            <span>Throughput (XP):</span>
            <span class="${multipliers.xp > 1 ? 'bonus' : ''}">${(multipliers.xp * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        <div class="oc-info">
          <small>Warning: Exceeding ${OVERCLOCK_CONFIG.maxHeat}°C will trigger emergency throttling.</small>
        </div>
      </div>
    `;

        rootEl.querySelector('#oc-toggle-btn')?.addEventListener('click', () => {
            overclockSystem.toggle();
            this.render(rootEl);
        });
    },

    updateUI(rootEl, data) {
        const heatBar = rootEl.querySelector('#oc-heat-bar');
        const heatText = rootEl.querySelector('#oc-heat-text');

        if (heatBar) {
            heatBar.style.width = `${data.heat}%`;
            heatBar.style.background = this.getHeatColor(data.heat);
        }

        if (heatText) {
            heatText.textContent = Math.floor(data.heat);
        }

        // If state changed externally (e.g. throttle trigger), re-render might be needed
        // But for smooth updates, we just handle the bar here
    },

    getHeatColor(heat) {
        if (heat < 50) return '#10b981'; // Green
        if (heat < 80) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    }
};
