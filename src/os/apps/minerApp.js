// ===== Miner App (Crypto Miner) =====
// Manage mining rig and exchange

import { gameState } from '../../state/enhancedGameState.js';
import { minerSystem, MINER_GPUS } from '../../state/minerSystem.js';

export const minerApp = {
    id: 'miner',
    title: 'Miner.exe',
    icon: '⛏️',

    createContent(rootEl) {
        this.render(rootEl);

        // Animation loop for terminal text
        this.interval = setInterval(() => {
            if (rootEl.isConnected) {
                this.updateTerminal(rootEl);
                this.updateStats(rootEl);
            } else {
                clearInterval(this.interval);
            }
        }, 100);
    },

    render(rootEl) {
        const hashRate = gameState.minerState.hashRate.toFixed(1);
        const balance = (gameState.resources.bitCredits || 0).toFixed(4);

        rootEl.innerHTML = `
      <div class="window-content miner-app">
        <!-- Top: Status & Stats -->
        <div class="miner-status">
           <div class="stat-card">
              <div class="stat-label">HASH RATE</div>
              <div class="stat-value text-green">${hashRate} MH/s</div>
           </div>
           <div class="stat-card">
              <div class="stat-label">WALLET BALANCE</div>
              <div class="stat-value text-gold" id="miner-balance">${balance} 🪙</div>
              <button class="btn-micro" id="btn-sell-all">SELL ALL</button>
           </div>
        </div>

        <!-- Middle: Terminal Visualization -->
        <div class="miner-terminal" id="miner-terminal">
            <div class="terminal-line">Initializing Miner.exe...</div>
            <div class="terminal-line">Connected to pool.</div>
        </div>

        <!-- Bottom: Shop -->
        <div class="miner-shop-title">HARDWARE SHOP</div>
        <div class="miner-shop-grid">
            ${this.renderShop()}
        </div>
      </div>
    `;

        this.attachEvents(rootEl);
    },

    renderShop() {
        return MINER_GPUS.map(gpu => {
            const canAfford = gameState.gold >= gpu.cost;
            return `
          <div class="gpu-card">
             <div class="gpu-icon">${gpu.icon}</div>
             <div class="gpu-info">
               <div class="gpu-name">${gpu.name}</div>
               <div class="gpu-stats">+${gpu.hashRate} MH/s</div>
             </div>
             <button class="btn-buy ${canAfford ? '' : 'disabled'}" data-id="${gpu.id}" ${canAfford ? '' : 'disabled'}>
               Buy<br>${gpu.cost} G
             </button>
          </div>
        `;
        }).join('');
    },

    updateTerminal(rootEl) {
        // Only add logic if hashRate > 0
        if (gameState.minerState.hashRate <= 0) return;

        if (Math.random() > 0.3) return; // limit updates

        const terminal = rootEl.querySelector('#miner-terminal');
        if (!terminal) return;

        const hashes = [
            `[HASH] ${Math.random().toString(16).substr(2, 12)}... ACCEPTED`,
            `[INFO] Block ${Math.floor(Math.random() * 900000)} found`,
            `[WORK] Job received: difficulty 4355`,
            `[TEMP] GPU0: ${60 + Math.floor(Math.random() * 20)}°C`,
        ];

        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = hashes[Math.floor(Math.random() * hashes.length)];
        line.style.color = line.textContent.includes('ACCEPTED') ? '#4ade80' : '#94a3b8';

        terminal.appendChild(line);

        // Auto scroll
        terminal.scrollTop = terminal.scrollHeight;

        // Limit history
        if (terminal.children.length > 20) {
            terminal.removeChild(terminal.children[0]);
        }
    },

    updateStats(rootEl) {
        const balEl = rootEl.querySelector('#miner-balance');
        const hashRate = gameState.minerState.hashRate;

        // Force recalculate in case equipment changed
        minerSystem.calculateHashRate();

        if (balEl) balEl.textContent = `${(gameState.resources.bitCredits || 0).toFixed(4)} 🪙`;

        // Update buy buttons availability based on live gold
        rootEl.querySelectorAll('.btn-buy').forEach(btn => {
            const id = btn.dataset.id;
            const gpu = MINER_GPUS.find(g => g.id === id);
            if (gpu) {
                if (gameState.gold >= gpu.cost) {
                    btn.classList.remove('disabled');
                    btn.disabled = false;
                } else {
                    btn.classList.add('disabled');
                    btn.disabled = true;
                }
            }
        });
    },

    attachEvents(rootEl) {
        // Buy Buttons
        rootEl.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const result = minerSystem.installGpu(id);
                if (result.success) {
                    // Re-render shop part (or whole app)
                    this.render(rootEl);
                } else {
                    console.error(result.error);
                }
            });
        });

        // Sell All
        rootEl.querySelector('#btn-sell-all')?.addEventListener('click', () => {
            const balance = gameState.resources.bitCredits || 0;
            if (balance > 0) {
                minerSystem.sellCrypto(balance);
                this.render(rootEl);
            }
        });
    }
};
