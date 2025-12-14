// ===== System BIOS (Hardware & Prestige) =====
// Manage Hardware Upgrades and System Resets

import { gameState, performPrestige, calculatePrestigeRewards } from '../../state/enhancedGameState.js';
import { prestigeSystem } from '../../state/prestigeSystem.js';
import { CONFIG } from '../../state/config.js';

export const systemSigilsApp = {
  id: 'systemSigils',
  title: 'System BIOS Setup',
  icon: '⚙️',

  createContent(rootEl) {
    this.render(rootEl);

    // Auto-refresh every second to update costs/stats
    this.interval = setInterval(() => {
      if (document.contains(rootEl)) {
        this.updateValues(rootEl);
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  },

  render(rootEl) {
    const currentSigils = gameState.prestigeState.sigilPoints;

    rootEl.innerHTML = `
      <div class="window-content system-bios">
        
        <!-- Header / Status -->
        <div class="bios-header">
          <div class="bios-stat">
            <span class="bios-label">AVAILABLE CREDITS</span>
            <span class="bios-value highlight" id="bios-sigils">${currentSigils}</span>
          </div>
          <div class="bios-stat">
            <span class="bios-label">SYSTEM VERSION</span>
            <span class="bios-value">${gameState.version || '1.0.0'}</span>
          </div>
        </div>

        <!-- Hardware Grid -->
        <div class="bios-section-title">HARDWARE CONFIGURATION</div>
        <div class="hardware-grid">
          ${this.renderHardwareCard('ram')}
          ${this.renderHardwareCard('cpu')}
          ${this.renderHardwareCard('gpu')}
          ${this.renderHardwareCard('ssd')}
        </div>

        <!-- Prestige / Reset Section -->
        <div class="bios-section-title warning">SYSTEM RESET PROTOCOL</div>
        <div class="prestige-panel" id="prestige-panel">
            ${this.renderPrestigePanel()}
        </div>

      </div>
    `;

    // Attach Event Listeners
    this.attachEvents(rootEl);
  },

  renderHardwareCard(type) {
    const config = CONFIG.hardware[type];
    const currentLevel = gameState.prestigeState.hardware[type] || 0;
    const cost = prestigeSystem.getHardwareCost(type);
    const isMaxed = currentLevel >= config.maxLevel;
    const canAfford = gameState.prestigeState.sigilPoints >= cost;

    // Generate effects string
    let effectsText = '';
    for (const [key, val] of Object.entries(config.effects)) {
      effectsText += `+${val} ${key} per level<br>`;
    }

    return `
      <div class="hardware-card ${isMaxed ? 'maxed' : ''}" data-type="${type}">
        <div class="hw-icon">${config.icon}</div>
        <div class="hw-info">
          <div class="hw-name">${config.name} <span class="hw-level">Lv. ${currentLevel}/${config.maxLevel}</span></div>
          <div class="hw-desc">${config.description}</div>
          <div class="hw-effects">${effectsText}</div>
        </div>
        <button class="btn-upgrade ${canAfford ? 'can-afford' : ''}" 
                data-type="${type}" 
                ${isMaxed || !canAfford ? 'disabled' : ''}>
          ${isMaxed ? 'MAX' : `INSTALL<br><span class="cost">${cost} Credits</span>`}
        </button>
      </div>
    `;
  },

  renderPrestigePanel() {
    const rewards = calculatePrestigeRewards();
    const sigilsToGain = rewards.sigilPoints;
    const nextSigilGold = Math.pow(gameState.prestigeState.sigilPoints + 1 + sigilsToGain, 2) * 1000; // Approx logic

    return `
      <div class="prestige-info">
        <p>Perform a factory reset to earn <strong>Bio-Credits</strong> based on lifetime gold.</p>
        <div class="prestige-gain">
            <span class="gain-label">PENDING CREDITS:</span>
            <span class="gain-value">+${sigilsToGain}</span>
        </div>
        ${sigilsToGain > 0 ?
        `<button class="btn-prestige glitch-effect" id="btn-prestige">INITIATE RESET</button>` :
        `<div class="prestige-locked">Earn more gold to unlock reset.</div>`
      }
      </div>
    `;
  },

  updateValues(rootEl) {
    // Efficiently update dynamic values without re-rendering everything
    const sigilEl = rootEl.querySelector('#bios-sigils');
    if (sigilEl) sigilEl.textContent = gameState.prestigeState.sigilPoints;

    // Update buttons state
    ['ram', 'cpu', 'gpu', 'ssd'].forEach(type => {
      const btn = rootEl.querySelector(`button[data-type="${type}"]`);
      if (btn) {
        const cost = prestigeSystem.getHardwareCost(type);
        const canAfford = gameState.prestigeState.sigilPoints >= cost;
        const isMaxed = (gameState.prestigeState.hardware[type] || 0) >= CONFIG.hardware[type].maxLevel;

        if (!isMaxed) {
          if (canAfford) btn.classList.add('can-afford');
          else btn.classList.remove('can-afford');
          btn.disabled = !canAfford;
        }
      }
    });

    // Update Prestige Panel
    const prestigePanel = rootEl.querySelector('#prestige-panel');
    if (prestigePanel) {
      // Only re-render if something changed significantly, or just always re-render this small part
      prestigePanel.innerHTML = this.renderPrestigePanel();
      const btn = prestigePanel.querySelector('#btn-prestige');
      if (btn) btn.addEventListener('click', () => this.handlePrestige());
    }
  },

  attachEvents(rootEl) {
    // Hardware Upgrade Buttons
    const buttons = rootEl.querySelectorAll('.btn-upgrade');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        this.handleUpgrade(type, rootEl);
      });
    });

    // Prestige Button
    const prestigeBtn = rootEl.querySelector('#btn-prestige');
    if (prestigeBtn) {
      prestigeBtn.addEventListener('click', () => this.handlePrestige());
    }
  },

  handleUpgrade(type, rootEl) {
    const result = prestigeSystem.buyHardware(type);
    if (result.success) {
      // Re-render to show new levels and costs
      this.render(rootEl);
    } else {
      console.error(result.error);
    }
  },

  handlePrestige() {
    const rewards = calculatePrestigeRewards();
    if (rewards.sigilPoints <= 0) return;

    if (confirm(`INITIATE SYSTEM RESET?\n\nYou will gain ${rewards.sigilPoints} Credits.\nHardware upgrades are PERMANENT.\nHeroes are reset to Level 1.`)) {
      performPrestige();
      // The game state resets, so the UI will likely need a full refresh or the window might close/reset
      // In a real OS, maybe we show a boot sequence. For now, just re-render.
      // Actually, performPrestige saves and resets variables. We should probably reload the page or trigger a global refresh.
      window.location.reload(); // Simple reboot effect
    }
  }
};
