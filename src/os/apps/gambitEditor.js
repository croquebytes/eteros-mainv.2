// ===== Gambit Editor App =====
// Configure AI scripts for heroes

import { gameState, saveGame } from '../../state/enhancedGameState.js';
import { CONDITIONS, ACTIONS } from '../../state/gambitSystem.js';

export const gambitEditor = {
    id: 'gambitEditor',
    title: 'Gambit Editor',
    icon: '🧠',

    selectedHeroId: null,

    createContent(rootEl) {
        this.render(rootEl);
    },

    render(rootEl) {
        // Determine selected hero
        if (!this.selectedHeroId && gameState.heroes.length > 0) {
            this.selectedHeroId = gameState.heroes[0].id;
        }

        const selectedHero = gameState.heroes.find(h => h.id === this.selectedHeroId);

        rootEl.innerHTML = `
      <div class="window-content gambit-editor">
        <div class="ge-layout">
          <!-- Left: Hero List -->
          <div class="ge-hero-list">
            ${this.renderHeroList()}
          </div>

          <!-- Right: Script Editor -->
          <div class="ge-editor-panel">
            ${selectedHero ? this.renderEditor(selectedHero) : '<div class="ge-empty">No Hero Selected</div>'}
          </div>
        </div>
      </div>
    `;

        this.attachEvents(rootEl);
    },

    renderHeroList() {
        return gameState.heroes.map(hero => `
      <div class="ge-hero-item ${hero.id === this.selectedHeroId ? 'active' : ''}" data-id="${hero.id}">
        <div class="ge-hero-icon">${hero.role?.[0]?.toUpperCase() || 'H'}</div>
        <div class="ge-hero-info">
          <div class="ge-hero-name">${hero.name}</div>
          <div class="ge-hero-lines">${hero.script ? hero.script.length : 0} Lines</div>
        </div>
      </div>
    `).join('');
    },

    renderEditor(hero) {
        if (!hero.script) hero.script = [];

        return `
      <div class="ge-header">
        <h3>${hero.name} - Logic Script</h3>
        <button class="btn btn-primary btn-add-line">+ Add Line</button>
      </div>
      <div class="ge-script-lines">
        ${hero.script.map((line, index) => this.renderScriptLine(line, index)).join('')}
      </div>
    `;
    },

    renderScriptLine(line, index) {
        // Generate dropdown options
        const conditionOptions = Object.values(CONDITIONS).map(c =>
            `<option value="${c.id}" ${line.conditionId === c.id ? 'selected' : ''}>${c.name}</option>`
        ).join('');

        const actionOptions = Object.values(ACTIONS).map(a =>
            `<option value="${a.id}" ${line.actionId === a.id ? 'selected' : ''}>${a.name}</option>`
        ).join('');

        return `
      <div class="ge-line" data-index="${index}">
        <div class="ge-line-controls">
           <span class="ge-line-num">${index + 1}</span>
           <input type="checkbox" class="ge-line-active" ${line.active ? 'checked' : ''}>
        </div>
        
        <div class="ge-line-logic">
          <span class="ge-keyword">IF</span>
          <select class="ge-select ge-condition">${conditionOptions}</select>
          
          ${this.renderParameterInput(line)}
          
          <span class="ge-keyword">THEN</span>
          <select class="ge-select ge-action">${actionOptions}</select>
        </div>

        <button class="btn-icon btn-delete-line">🗑️</button>
      </div>
    `;
    },

    renderParameterInput(line) {
        const condition = CONDITIONS[line.conditionId];
        if (!condition || !condition.paramType) return '';

        return `
        <input type="number" class="ge-input ge-param" value="${line.parameter || 0}" placeholder="Val">
        <span class="ge-unit">${condition.paramType === 'percentage' ? '%' : ''}</span>
    `;
    },

    attachEvents(rootEl) {
        // Hero Selection
        rootEl.querySelectorAll('.ge-hero-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectedHeroId = item.dataset.id;
                this.render(rootEl);
            });
        });

        // Add Line
        rootEl.querySelector('.btn-add-line')?.addEventListener('click', () => {
            const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
            if (hero) {
                hero.script.push({ active: true, conditionId: 'ALWAYS', actionId: 'ATTACK' });
                saveGame();
                this.render(rootEl);
            }
        });

        // Delete Line
        rootEl.querySelectorAll('.btn-delete-line').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.ge-line').dataset.index);
                const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
                if (hero) {
                    hero.script.splice(index, 1);
                    saveGame();
                    this.render(rootEl);
                }
            });
        });

        // Change Events (Condition, Action, Param, Active)
        rootEl.querySelectorAll('.ge-select, .ge-input, .ge-line-active').forEach(input => {
            input.addEventListener('change', (e) => {
                const lineEl = e.target.closest('.ge-line');
                const index = parseInt(lineEl.dataset.index);
                const hero = gameState.heroes.find(h => h.id === this.selectedHeroId);
                const line = hero.script[index];

                if (e.target.classList.contains('ge-condition')) {
                    line.conditionId = e.target.value;
                    // Reset param if needed
                    line.parameter = null;
                    this.render(rootEl); // Re-render to show/hide param input
                } else if (e.target.classList.contains('ge-action')) {
                    line.actionId = e.target.value;
                } else if (e.target.classList.contains('ge-param')) {
                    line.parameter = parseFloat(e.target.value);
                } else if (e.target.classList.contains('ge-line-active')) {
                    line.active = e.target.checked;
                }
                saveGame();
            });
        });
    }
};
