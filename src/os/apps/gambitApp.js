// ===== Gambit Editor App =====
// UI for programming Hero AI
// "If (Alive) Then (Fight)"



import { gameState } from '../../state/gameState.js';
import { gambitSystem, GAMBIT_TARGETS, GAMBIT_CONDITIONS, GAMBIT_ACTIONS } from '../../state/gambitSystem.js';

export const gambitEditor = {
  id: 'gambitEditor',
  title: 'Gambit Editor – AI_Script.js',

  selectedHeroId: null,

  createContent(rootEl) {
    // Default to first hero if none selected
    if (!this.selectedHeroId && gameState.heroes.length > 0) {
      this.selectedHeroId = gameState.heroes[0].id;
    }

    this.render(rootEl);
  },

  render(rootEl) {
    const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
    if (!hero) {
      rootEl.innerHTML = '<div class="error">No Hero Selected</div>';
      return;
    }

    // Ensure hero has gambits initialized
    gambitSystem.initHeroGambits(hero);

    rootEl.innerHTML = `
            <div class="window-content gambit-editor">
                <div class="ge-sidebar">
                    <h3>Heroes</h3>
                    <div class="ge-hero-list">
                        ${gameState.heroes.map(h => `
                            <div class="ge-hero-item ${h.id === this.selectedHeroId ? 'active' : ''}" data-id="${h.id}">
                                <div class="ge-hero-icon">${h.role?.[0]?.toUpperCase() || 'H'}</div>
                                <div class="ge-hero-name">${h.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ge-main">
                    <div class="ge-header">
                        <h2>${hero.name}'s Logic</h2>
                        <div class="ge-controls">
                            <button id="ge-add-slot" class="btn btn-small">+ Add Slot</button>
                        </div>
                    </div>

                    <div class="ge-gambit-list">
                        ${hero.gambits.map((gambit, index) => this.renderGambitRow(gambit, index)).join('')}
                    </div>
                </div>
            </div>
        `;

    this.attachEventListeners(rootEl);
  },

  renderGambitRow(gambit, index) {
    return `
            <div class="ge-gambit-row ${gambit.active ? '' : 'inactive'}" data-index="${index}">
                <div class="ge-row-controls">
                    <div class="ge-priority">${index + 1}</div>
                    <input type="checkbox" class="ge-toggle" ${gambit.active ? 'checked' : ''}>
                </div>

                <div class="ge-logic-block">
                    <span class="logic-label">IF</span>
                    <select class="ge-select ge-target">
                        ${this.renderOptions(GAMBIT_TARGETS, gambit.target)}
                    </select>
                    <select class="ge-select ge-condition">
                        ${this.renderOptions(GAMBIT_CONDITIONS, gambit.condition)}
                    </select>
                </div>

                <div class="ge-arrow">➜</div>

                <div class="ge-logic-block action">
                    <span class="logic-label">THEN</span>
                    <select class="ge-select ge-action">
                        ${this.renderOptions(GAMBIT_ACTIONS, gambit.action)}
                    </select>
                </div>

                <div class="ge-row-actions">
                    <button class="btn-icon ge-move-up" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-icon ge-move-down" ${index === 4 ? 'disabled' : ''}>⬇️</button>
                    <button class="btn-icon ge-delete">🗑️</button>
                </div>
            </div>
        `;
  },

  renderOptions(optionsObj, selectedValue) {
    return Object.values(optionsObj).map(opt => `
            <option value="${opt.id}" ${opt.id === selectedValue ? 'selected' : ''}>${opt.label}</option>
        `).join('');
  },

  attachEventListeners(rootEl) {
    // Hero Selection
    rootEl.querySelectorAll('.ge-hero-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectedHeroId = item.dataset.id;
        this.render(rootEl);
      });
    });

    // Add Slot
    rootEl.querySelector('#ge-add-slot')?.addEventListener('click', () => {
      const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
      if (hero && hero.gambits.length < 10) {
        hero.gambits.push({
          id: Date.now(),
          active: true,
          target: 'enemy_any',
          condition: 'always',
          action: 'attack'
        });
        this.render(rootEl);
      }
    });

    // Row Interactions
    rootEl.querySelectorAll('.ge-gambit-row').forEach(row => {
      const index = parseInt(row.dataset.index);
      const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
      if (!hero) return;

      // Toggle Active
      row.querySelector('.ge-toggle').addEventListener('change', (e) => {
        hero.gambits[index].active = e.target.checked;
        this.render(rootEl); // Re-render to update styling
      });

      // Change Target
      row.querySelector('.ge-target').addEventListener('change', (e) => {
        hero.gambits[index].target = e.target.value;
      });

      // Change Condition
      row.querySelector('.ge-condition').addEventListener('change', (e) => {
        hero.gambits[index].condition = e.target.value;
      });

      // Change Action
      row.querySelector('.ge-action').addEventListener('change', (e) => {
        hero.gambits[index].action = e.target.value;
      });

      // Move Up
      row.querySelector('.ge-move-up')?.addEventListener('click', () => {
        if (index > 0) {
          const temp = hero.gambits[index];
          hero.gambits[index] = hero.gambits[index - 1];
          hero.gambits[index - 1] = temp;
          this.render(rootEl);
        }
      });

      // Move Down
      row.querySelector('.ge-move-down')?.addEventListener('click', () => {
        if (index < hero.gambits.length - 1) {
          const temp = hero.gambits[index];
          hero.gambits[index] = hero.gambits[index + 1];
          hero.gambits[index + 1] = temp;
          this.render(rootEl);
        }
      });

      // Delete
      row.querySelector('.ge-delete').addEventListener('click', () => {
        hero.gambits.splice(index, 1);
        this.render(rootEl);
      });
    });
  }
};
