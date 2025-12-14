// ===== Quest Explorer App =====
// File System Navigation & Dungeon Runner Interface
// "It's a Unix system! I know this!"

import { gameState } from '../../state/enhancedGameState.js';
import { onDungeonUpdate, getDungeonStats, toggleDungeon, stopDungeon, getCombatLog, acknowledgePendingDungeonResult, startRaid } from '../../state/dungeonRunner.js';
import { raidSystem } from '../../state/raidSystem.js';
import { updateHeroStats } from '../../state/heroSystem.js';
import { calculatePartyDamage, calculatePartyPower, getDungeonDifficulty, getDifficultyDisplay } from '../../state/partyPowerCalculator.js';
import { getDungeonById } from '../../state/dungeonTemplates.js';
import { FILE_SYSTEM, getFileSystemNode } from '../../state/fileSystem.js';
import { getActiveSynergies } from '../../state/heroSynergies.js';

export const questExplorerApp = {
  id: 'questExplorer',
  title: 'Quest Explorer – FileMgr.exe',

  // App State
  currentPath: [], // Array of folder names, e.g. ['C:', 'Windows']
  selectedFile: null,

  createContent(rootEl) {
    try {
      // Initial render
      this.render(rootEl);

      // Register for dungeon updates
      onDungeonUpdate(() => {
        this.updateBattleView(rootEl);
      });

      // Auto-refresh UI (for party stats etc)
      this.interval = setInterval(() => {
        if (rootEl.isConnected) {
          this.updateBattleView(rootEl);
        } else {
          clearInterval(this.interval);
        }
      }, 1000);

      // Check for offline results
      this.checkOfflineResults(rootEl);
    } catch (e) {
      console.error("Quest Explorer Crash:", e);
      rootEl.innerHTML = `<div style="padding: 20px; color: red;">CRITICAL ERROR: ${e.message}<br><pre>${e.stack}</pre></div>`;
    }
  },

  render(rootEl) {
    const isRunning = gameState.dungeonState.running;
    const currentDir = this.getCurrentDirectory();

    rootEl.innerHTML = `
      <div class="window-content quest-explorer-fs">
        <!-- Toolbar / Address Bar -->
        <div class="qe-fs-toolbar">
          <button id="qe-btn-up" class="btn-icon" ${this.currentPath.length === 0 ? 'disabled' : ''}>⬆️</button>
          <div class="qe-address-bar">
            <span class="address-root">root/</span>${this.currentPath.join('/')}
          </div>
          <button id="qe-btn-party" class="btn-icon" title="Manage Party">👥</button>
          <div class="qe-status-indicator ${isRunning ? 'status-running' : 'status-idle'}">
            ${isRunning ? '⚠️ PROCESS RUNNING' : '✓ SYSTEM IDLE'}
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="qe-fs-main">
          <!-- Left: File Browser (Hidden if running) -->
          <div class="qe-fs-browser" style="display: ${isRunning ? 'none' : 'flex'}">
            <div class="file-grid">
              ${this.renderFileGrid(currentDir)}
            </div>
          </div>

          <!-- Right/Full: Process Monitor (Visible if running) -->
          <div class="qe-process-monitor" style="display: ${isRunning ? 'flex' : 'none'}">
            <div class="monitor-header">
              <h3>Executing: ${gameState.activeDungeonRun?.dungeonId || 'Unknown Process'}</h3>
              <div class="monitor-controls">
                <button id="qe-stop-run" class="btn btn-danger">End Task</button>
              </div>
            </div>
            <div class="monitor-viewport">
              <div class="battle-stats-row">
                <div class="stat-box">Wave: <span id="qe-wave">-</span></div>
                <div class="stat-box">Gold: <span id="qe-gold">-</span></div>
                <div class="stat-box">Progress: <div class="progress-bar-mini"><div id="qe-progress-fill"></div></div></div>
              </div>
              <div class="synergy-display" id="qe-synergies" style="display: flex; gap: 8px; padding: 8px; flex-wrap: wrap; min-height: 32px;">
                <!-- Synergies rendered here -->
              </div>
              <div class="battle-scene">
                <div class="battle-party" id="qe-party-list"></div>
                <div class="battle-vs">VS</div>
                <div class="battle-enemies" id="qe-enemy-list"></div>
              </div>
              <div class="battle-log" id="qe-combat-log"></div>
            </div>
          </div>
          
          <!-- File Details Panel (Overlay) -->
          <div id="qe-file-details" class="qe-file-details" style="display: none;">
            <!-- Rendered dynamically -->
          </div>
          
          <!-- Modals Container -->
          <div id="qe-modals" class="qe-modals"></div>
        </div>
      </div>
    `;

    this.attachEventListeners(rootEl);

    // If running, update the battle view immediately
    if (isRunning) {
      this.updateBattleView(rootEl);
    }
  },

  getCurrentDirectory() {
    let current = FILE_SYSTEM;
    // console.log("QE: Resolving path:", this.currentPath);
    for (const part of this.currentPath) {
      if (current.children) {
        const found = current.children.find(c => c.name === part);
        if (found) {
          current = found;
        } else {
          console.warn("QE: Path part not found:", part, "in", current.name);
        }
      }
    }

    // Dynamic population for N: (Network)
    if (current.name === 'N:') {
      // console.log("QE: Populating N: drive");
      try {
        const targets = raidSystem.getTargets();
        // console.log("QE: Targets found:", targets.length);
        current.children = targets.map(t => ({
          name: t.name,
          type: 'file',
          icon: '🌐',
          isRaid: true,
          raidTarget: t
        }));
      } catch (e) {
        console.error("QE: Error getting raid targets:", e);
        current.children = [];
      }
    }

    return current;
  },

  renderFileGrid(directory) {
    if (directory.error) {
      return `<div class="empty-folder" style="color: red;">Error: ${directory.error}</div>`;
    }
    if (!directory.children || directory.children.length === 0) {
      return '<div class="empty-folder">Empty Directory</div>';
    }

    // Check if this is a directory of files (dungeons) or folders
    const hasDungeons = directory.children.some(c => c.dungeonId || c.isRaid);

    if (hasDungeons) {
      return `<div class="dungeon-file-list">
        ${directory.children.map(node => {
        if (node.type !== 'file') return this.renderSimpleNode(node);

        let dungeon = null;
        if (node.isRaid) {
          // Handle Raid Target
          const target = node.raidTarget;
          // Mock a dungeon object for display
          dungeon = {
            name: target.name,
            type: 'raid',
            recommendedPartyPower: target.power,
            rewards: target.rewards
          };
        } else {
          dungeon = getDungeonById(node.dungeonId);
        }

        if (!dungeon) return this.renderSimpleNode(node); // Fallback

        const difficulty = getDungeonDifficulty(dungeon.recommendedPartyPower || 100);
        const diffDisplay = getDifficultyDisplay(difficulty);

        return `
            <div class="dungeon-file-card fs-item" data-name="${node.name}" data-type="file">
              <div class="df-icon">${node.icon}</div>
              <div class="df-content">
                <div class="df-header">
                  <span class="df-name">${dungeon.name}</span>
                  <span class="df-filename">${node.name}</span>
                </div>
                <div class="df-meta">
                   <span class="df-tag df-difficulty" style="color: ${diffDisplay.color}">${diffDisplay.emoji} ${diffDisplay.label}</span>
                   <span class="df-tag df-power">⚡ ${dungeon.recommendedPartyPower || '?'}</span>
                </div>
              </div>
              <div class="df-action">
                <span class="material-icon">▶</span>
              </div>
            </div>
          `;
      }).join('')}
      </div>`;
    }

    // Default Grid for Folders
    return directory.children.map(node => this.renderSimpleNode(node)).join('');
  },

  renderSimpleNode(node) {
    return `
      <div class="fs-item ${node.type}" data-name="${node.name}" data-type="${node.type}">
        <div class="fs-icon">${node.icon || (node.type === 'folder' || node.type === 'drive' ? '📁' : '📄')}</div>
        <div class="fs-name">${node.name}</div>
      </div>
    `;
  },

  attachEventListeners(rootEl) {
    // Navigation
    rootEl.querySelector('#qe-btn-up')?.addEventListener('click', () => {
      if (this.currentPath.length > 0) {
        this.currentPath.pop();
        this.selectedFile = null;
        this.render(rootEl);
      }
    });

    // Party Manager
    rootEl.querySelector('#qe-btn-party')?.addEventListener('click', () => {
      this.renderPartyManager(rootEl);
    });

    // File/Folder Clicking
    rootEl.querySelectorAll('.fs-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const type = item.dataset.type;
        const currentDir = this.getCurrentDirectory();
        const node = currentDir.children.find(c => c.name === name);

        if (type === 'folder' || type === 'drive') {
          this.currentPath.push(name);
          this.selectedFile = null;
          this.render(rootEl);
        } else if (type === 'file') {
          this.selectedFile = node;
          if (node.isRaid) {
            this.showRaidDetails(rootEl, node);
          } else {
            this.showFileDetails(rootEl, node);
          }
        }
      });
    });

    // Stop Button
    rootEl.querySelector('#qe-stop-run')?.addEventListener('click', () => {
      stopDungeon();
      this.render(rootEl);
    });
  },

  showFileDetails(rootEl, node) {
    const detailsPanel = rootEl.querySelector('#qe-file-details');
    if (!detailsPanel) return;

    const dungeon = getDungeonById(node.dungeonId);
    if (!dungeon) {
      detailsPanel.innerHTML = `<div class="error">Error: Corrupted File Link (${node.dungeonId})</div>`;
      detailsPanel.style.display = 'flex';
      return;
    }

    const difficulty = getDungeonDifficulty(dungeon.recommendedPartyPower || 100);
    const diffDisplay = getDifficultyDisplay(difficulty);

    detailsPanel.innerHTML = `
      <div class="file-details-content">
        <div class="details-header">
          <div class="details-icon">${node.icon}</div>
          <div class="details-title">
            <h3>${node.name}</h3>
            <span class="details-type">${dungeon.type.toUpperCase()}</span>
          </div>
          <button class="btn-close-details">×</button>
        </div>
        
        <div class="details-body">
          <div class="details-info-grid">
            <div class="info-item">
              <label>Target:</label>
              <span>${dungeon.name}</span>
            </div>
            <div class="info-item">
              <label>Difficulty:</label>
              <span style="color: ${diffDisplay.color}">${diffDisplay.emoji} ${diffDisplay.label}</span>
            </div>
            <div class="info-item">
              <label>Waves:</label>
              <span>${dungeon.waves === Infinity ? '∞ Endless' : dungeon.waves}</span>
            </div>
            <div class="info-item">
              <label>Rec. Power:</label>
              <span>${dungeon.recommendedPartyPower || 100}</span>
            </div>
          </div>

          <div class="details-rewards">
            <h4>Potential Rewards</h4>
            <ul>
              <li>💰 ${dungeon.rewards.goldPerWave} Gold / Wave</li>
              <li>✨ ${dungeon.rewards.xpPerWave} XP / Wave</li>
              <li>📦 ${(dungeon.rewards.itemDropRate * 100).toFixed(0)}% Drop Rate</li>
            </ul>
          </div>
        </div>

        <div class="details-actions">
          <button id="qe-btn-execute" class="btn btn-primary btn-large">EXECUTE ${node.name}</button>
        </div>
      </div>
    `;

    detailsPanel.style.display = 'flex';

    // Close button
    detailsPanel.querySelector('.btn-close-details').addEventListener('click', () => {
      detailsPanel.style.display = 'none';
      this.selectedFile = null;
    });

    // Execute button
    detailsPanel.querySelector('#qe-btn-execute').addEventListener('click', () => {
      this.executeDungeon(dungeon.id, rootEl);
    });
  },

  showRaidDetails(rootEl, node) {
    const detailsPanel = rootEl.querySelector('#qe-file-details');
    if (!detailsPanel) return;

    const target = node.raidTarget;
    const diffDisplay = {
      label: target.difficulty.label,
      emoji: '💀',
      color: '#ef4444'
    };

    detailsPanel.innerHTML = `
      <div class="file-details-content raid-details">
        <div class="details-header">
          <div class="details-icon">${node.icon}</div>
          <div class="details-title">
            <h3>${node.name}</h3>
            <span class="details-type">NETWORK TARGET</span>
          </div>
          <button class="btn-close-details">×</button>
        </div>
        
        <div class="details-body">
          <div class="details-info-grid">
            <div class="info-item">
              <label>Host:</label>
              <span>${target.name}</span>
            </div>
            <div class="info-item">
              <label>Security:</label>
              <span style="color: ${diffDisplay.color}">${diffDisplay.emoji} ${diffDisplay.label}</span>
            </div>
            <div class="info-item">
              <label>Power:</label>
              <span>${target.power}</span>
            </div>
          </div>

          <div class="details-rewards">
            <h4>Bounty Rewards</h4>
            <ul>
              <li>💰 ${target.rewards.gold} Gold</li>
              <li>✨ ${target.rewards.xp} XP</li>
              ${target.rewards.codeFragments ? `<li>🧩 ${target.rewards.codeFragments} Fragments</li>` : ''}
            </ul>
          </div>
        </div>

        <div class="details-actions">
          <button id="qe-btn-execute-raid" class="btn btn-danger btn-large">HACK TARGET</button>
        </div>
      </div>
    `;

    detailsPanel.style.display = 'flex';

    detailsPanel.querySelector('.btn-close-details').addEventListener('click', () => {
      detailsPanel.style.display = 'none';
      this.selectedFile = null;
    });

    detailsPanel.querySelector('#qe-btn-execute-raid').addEventListener('click', () => {
      startRaid(target);
      this.render(rootEl);
    });
  },

  executeDungeon(dungeonId, rootEl) {
    gameState.currentDungeonId = dungeonId;
    gameState.wave = 1;
    toggleDungeon(); // Start it
    this.render(rootEl); // Re-render to show process monitor
  },

  updateBattleView(rootEl) {
    const stats = getDungeonStats();

    // Update simple stats
    const waveEl = rootEl.querySelector('#qe-wave');
    const goldEl = rootEl.querySelector('#qe-gold');
    const progressFill = rootEl.querySelector('#qe-progress-fill');

    if (waveEl) waveEl.textContent = stats.wave;
    if (goldEl) goldEl.textContent = Math.floor(stats.gold);
    if (progressFill) progressFill.style.width = `${stats.progress}%`;

    // Update Synergies
    const synergyEl = rootEl.querySelector('#qe-synergies');
    if (synergyEl) {
      const activeSynergies = getActiveSynergies();
      if (activeSynergies.length > 0) {
        synergyEl.innerHTML = activeSynergies.map(syn => `
          <div class="synergy-badge" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 4px;
          " title="${syn.description}">
            <span>${syn.icon}</span>
            <span>${syn.name}</span>
          </div>
        `).join('');
      } else {
        synergyEl.innerHTML = '<div style="color: #666; font-size: 11px; font-style: italic;">No active synergies</div>';
      }
    }

    // Update Party
    const partyList = rootEl.querySelector('#qe-party-list');
    if (partyList) {
      partyList.innerHTML = gameState.heroes.map(hero => {
        const hpPercent = Math.floor((hero.currentHp / hero.currentStats.hp) * 100);
        const hpColor = hpPercent > 50 ? '#10b981' : hpPercent > 25 ? '#f59e0b' : '#ef4444';

        return `
          <div class="battle-unit hero ${hero.currentHp === 0 ? 'dead' : ''}">
            <div class="unit-icon">${hero.role?.[0]?.toUpperCase() || 'H'}</div>
            <div class="unit-bars">
              <div class="unit-name">${hero.name}</div>
              <div class="hp-bar"><div class="fill" style="width: ${hpPercent}%; background: ${hpColor}"></div></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Enemies
    const enemyList = rootEl.querySelector('#qe-enemy-list');
    if (enemyList) {
      if (!stats.running) {
        enemyList.innerHTML = '<div class="status-msg">Process Terminated</div>';
      } else if (!stats.enemies || stats.enemies.length === 0) {
        enemyList.innerHTML = '<div class="status-msg">Scanning...</div>';
      } else {
        enemyList.innerHTML = stats.enemies.map(enemy => {
          const hpPercent = enemy.hpPercent;
          const hpColor = hpPercent > 50 ? '#ef4444' : hpPercent > 25 ? '#f59e0b' : '#dc2626';

          return `
            <div class="battle-unit enemy ${enemy.isBoss ? 'boss' : ''} ${enemy.currentHp === 0 ? 'dead' : ''}">
              <div class="unit-icon">${enemy.isBoss ? '💀' : '👾'}</div>
              <div class="unit-bars">
                <div class="unit-name">${enemy.name}</div>
                <div class="hp-bar"><div class="fill" style="width: ${hpPercent}%; background: ${hpColor}"></div></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Update Log
    const logEl = rootEl.querySelector('#qe-combat-log');
    if (logEl) {
      const log = getCombatLog(5);
      logEl.innerHTML = log.map(entry => {
        let text = '';
        if (entry.type === 'hero-attack') text = `> ${entry.attacker} hits ${entry.target} (${entry.damage})`;
        else if (entry.type === 'enemy-attack') text = `> ${entry.attacker} hits ${entry.target} (${entry.damage})`;
        else if (entry.type === 'enemy-defeated') text = `> Process killed: ${entry.enemy}`;
        else text = `> ${entry.type}`;
        return `<div class="log-line">${text}</div>`;
      }).join('');
    }
  },

  checkOfflineResults(rootEl) {
    if (gameState.pendingDungeonResult) {
      this.renderOfflineResults(rootEl, gameState.pendingDungeonResult);
    }
  },

  renderOfflineResults(rootEl, result) {
    const modalContainer = rootEl.querySelector('#qe-modals');
    if (!modalContainer) return;

    const itemsFound = result.itemsFound || [];

    modalContainer.innerHTML = `
      <div class="qe-modal-overlay">
        <div class="qe-modal">
          <div class="qe-modal-header">
            <h3>Process Execution Report</h3>
          </div>
          <div class="qe-modal-body">
            <div class="report-summary">
              <div class="report-row"><span>Waves Cleared:</span> <span>${result.wavesCleared || 0}</span></div>
              <div class="report-row"><span>Gold Mined:</span> <span class="text-gold">${Math.floor(result.goldEarned || 0)}</span></div>
              <div class="report-row"><span>XP Gained:</span> <span class="text-xp">${Math.floor(result.xpEarned || 0)}</span></div>
              <div class="report-row"><span>Items Found:</span> <span>${itemsFound.length}</span></div>
            </div>
            ${itemsFound.length > 0 ? `
              <div class="report-items">
                <h4>Recovered Assets:</h4>
                <div class="item-list">
                  ${itemsFound.map(item => `<div class="item-entry">${item.name}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
      <div class="qe-modal-footer">
            <button id="qe-btn-rerun" class="btn btn-secondary">🔄 Re-Run Protocol</button>
            <button id="qe-btn-ack" class="btn btn-primary">Acknowledge</button>
          </div>
        </div>
      </div>
    `;

    modalContainer.querySelector('#qe-btn-ack')?.addEventListener('click', () => {
      acknowledgePendingDungeonResult();
      modalContainer.innerHTML = '';
      this.render(rootEl);
    });

    modalContainer.querySelector('#qe-btn-rerun')?.addEventListener('click', () => {
      const dungeonId = result.dungeonId; // Ensure pendingDungeonResult has ID
      acknowledgePendingDungeonResult();
      modalContainer.innerHTML = '';
      this.executeDungeon(dungeonId, rootEl);
    });
  },

  renderPartyManager(rootEl) {
    const modalContainer = rootEl.querySelector('#qe-modals');
    if (!modalContainer) return;

    const renderList = () => {
      return gameState.heroes.map((hero, index) => `
        <div class="party-member-row">
          <div class="member-info">
            <span class="member-icon">${hero.role?.[0]?.toUpperCase() || 'H'}</span>
            <span class="member-name">${hero.name}</span>
            <span class="member-lvl">Lvl ${hero.level}</span>
          </div>
          <div class="member-controls">
            <button class="btn-move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>⬆️</button>
            <button class="btn-move-down" data-index="${index}" ${index === gameState.heroes.length - 1 ? 'disabled' : ''}>⬇️</button>
          </div>
        </div>
      `).join('');
    };

    modalContainer.innerHTML = `
      <div class="qe-modal-overlay">
        <div class="qe-modal">
          <div class="qe-modal-header">
            <h3>System Configuration: Party</h3>
            <button class="btn-close-modal">×</button>
          </div>
          <div class="qe-modal-body">
            <div class="party-list-container">
              ${renderList()}
            </div>
          </div>
        </div>
      </div>
    `;

    const attachEvents = () => {
      modalContainer.querySelector('.btn-close-modal')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      modalContainer.querySelectorAll('.btn-move-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          if (index > 0) {
            this.swapHeroes(index, index - 1);
            this.renderPartyManager(rootEl); // Re-render modal
            this.updateBattleView(rootEl); // Update main view
          }
        });
      });

      modalContainer.querySelectorAll('.btn-move-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          if (index < gameState.heroes.length - 1) {
            this.swapHeroes(index, index + 1);
            this.renderPartyManager(rootEl);
            this.updateBattleView(rootEl);
          }
        });
      });
    };

    attachEvents();
  },

  swapHeroes(idx1, idx2) {
    const temp = gameState.heroes[idx1];
    gameState.heroes[idx1] = gameState.heroes[idx2];
    gameState.heroes[idx2] = temp;
  }
};
