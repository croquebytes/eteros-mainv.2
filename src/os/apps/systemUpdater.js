// ===== System Updater App =====
// OS Version Management & Prestige
// "Updates are available."

import { gameState } from '../../state/gameState.js';
import { prestigeSystem } from '../../state/prestigeSystem.js';
import { windowManager } from '../../os/windowManager.js';

export const systemUpdater = {
    id: 'systemUpdater',
    title: 'System Updater',
    icon: '🔄',

    createContent(rootEl) {
        this.render(rootEl);

        // Auto-refresh for dynamic values
        this.interval = setInterval(() => {
            if (rootEl.isConnected) {
                this.updateValues(rootEl);
            } else {
                clearInterval(this.interval);
            }
        }, 1000);
    },

    render(rootEl) {
        const currentVersion = gameState.version || '1.0.0';
        const nextCost = prestigeSystem.getNextVersionCost();
        const dust = gameState.resources.entropyDust || 0;
        const potentialDust = prestigeSystem.calculateEntropyGain();
        const multiplier = prestigeSystem.getGlobalMultiplier();

        rootEl.innerHTML = `
            <div class="window-content system-updater">
                <div class="su-header">
                    <div class="su-logo">ReincarnOS</div>
                    <div class="su-version">Current Version: v${currentVersion}</div>
                    <div class="su-status">System Status: ${potentialDust > 0 ? 'UNSTABLE' : 'STABLE'}</div>
                </div>

                <div class="su-main">
                    <!-- Reinstall Section -->
                    <div class="su-card reinstall">
                        <h3>System Reinstall</h3>
                        <p>Reinstalling the OS clears temporary files (Gold, XP, Wave) but generates Entropy Dust based on performance.</p>
                        
                        <div class="su-stat-row">
                            <span>Lifetime Gold:</span>
                            <span>${Math.floor(gameState.lifetimeGold).toLocaleString()}</span>
                        </div>
                        <div class="su-stat-row highlight">
                            <span>Potential Entropy Dust:</span>
                            <span id="su-potential-dust">+${potentialDust}</span>
                        </div>

                        <button id="su-btn-reinstall" class="btn btn-danger" ${potentialDust === 0 ? 'disabled' : ''}>
                            ⚠️ Reinstall System
                        </button>
                    </div>

                    <!-- Upgrade Section -->
                    <div class="su-card upgrade">
                        <h3>Version Upgrade</h3>
                        <p>Upgrade to the next major version to increase system efficiency (Global Multiplier).</p>
                        
                        <div class="su-stat-row">
                            <span>Current Multiplier:</span>
                            <span>x${multiplier}</span>
                        </div>
                        <div class="su-stat-row">
                            <span>Available Entropy Dust:</span>
                            <span id="su-current-dust" class="text-dust">${dust}</span>
                        </div>
                        <div class="su-stat-row">
                            <span>Upgrade Cost:</span>
                            <span>${nextCost} Dust</span>
                        </div>

                        <button id="su-btn-upgrade" class="btn btn-primary" ${dust < nextCost ? 'disabled' : ''}>
                            ⬆️ Install v${Math.floor(parseFloat(currentVersion)) + 1}.0
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners(rootEl);
    },

    updateValues(rootEl) {
        const potentialDust = prestigeSystem.calculateEntropyGain();
        const dust = gameState.resources.entropyDust || 0;
        const nextCost = prestigeSystem.getNextVersionCost();

        const potDustEl = rootEl.querySelector('#su-potential-dust');
        const curDustEl = rootEl.querySelector('#su-current-dust');
        const reinstallBtn = rootEl.querySelector('#su-btn-reinstall');
        const upgradeBtn = rootEl.querySelector('#su-btn-upgrade');

        if (potDustEl) potDustEl.textContent = `+${potentialDust}`;
        if (curDustEl) curDustEl.textContent = dust;

        if (reinstallBtn) reinstallBtn.disabled = potentialDust === 0;
        if (upgradeBtn) upgradeBtn.disabled = dust < nextCost;
    },

    attachEventListeners(rootEl) {
        rootEl.querySelector('#su-btn-reinstall')?.addEventListener('click', () => {
            if (confirm('WARNING: This will reset your current run (Gold, XP, Waves). Are you sure?')) {
                const result = prestigeSystem.performReinstall();
                if (result.success) {
                    alert(`System Reinstalled! Gained ${result.dustGained} Entropy Dust.`);
                    // Reload UI
                    this.render(rootEl);
                    // Maybe close other windows?
                }
            }
        });

        rootEl.querySelector('#su-btn-upgrade')?.addEventListener('click', () => {
            const result = prestigeSystem.performUpgrade();
            if (result.success) {
                alert(`Upgrade Successful! System is now v${result.newVersion}.`);
                this.render(rootEl);
            } else {
                alert(result.message);
            }
        });
    }
};
