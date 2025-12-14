// ===== Daily Quests App =====
// Display and manage daily quests

import {
  getDailyQuests,
  claimQuestReward,
  refreshDailyQuests,
  areAllQuestsComplete
} from '../../state/dailyQuestSystem.js';
import { eventBus, EVENTS } from '../../state/eventBus.js';

export const dailyQuestsApp = {
  id: 'dailyQuests',
  title: 'Daily Quests – Tasks.exe',

  createContent(rootEl) {
    this.render(rootEl);

    // Listen for quest events
    eventBus.on(EVENTS.QUEST_COMPLETED, () => this.render(rootEl));
    eventBus.on(EVENTS.QUEST_PROGRESS_UPDATED, () => this.render(rootEl));
    eventBus.on(EVENTS.QUEST_REWARD_CLAIMED, () => this.render(rootEl));
  },

  render(rootEl) {
    const questData = getDailyQuests();
    const allComplete = areAllQuestsComplete();

    rootEl.innerHTML = `
      <div class="window-content daily-quests-app">
        <!-- Header -->
        <div class="quest-header" style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin-bottom: 20px; color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="margin: 0 0 5px 0; font-size: 24px;">📋 Daily Quests</h2>
              <div style="font-size: 14px; opacity: 0.9;">Complete quests to earn rewards!</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; opacity: 0.8;">Streak</div>
              <div style="font-size: 28px; font-weight: bold;">${questData.streak} 🔥</div>
              <div style="font-size: 11px; opacity: 0.7;">Total: ${questData.totalCompleted}</div>
            </div>
          </div>
        </div>

        <!-- All Complete Bonus -->
        ${allComplete ? `
          <div class="all-complete-banner" style="padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; color: white; text-align: center; margin-bottom: 20px; font-weight: bold;">
            🎉 All Quests Complete! Check back tomorrow for new challenges!
          </div>
        ` : ''}

        <!-- Refresh Notice -->
        ${questData.canRefresh ? `
          <div class="refresh-notice" style="padding: 12px; background: #f59e0b; color: white; border-radius: 6px; text-align: center; margin-bottom: 20px; font-weight: bold;">
            ⚠️ New quests available! <button id="btn-refresh-quests" class="btn btn-sm btn-light" style="margin-left: 10px;">Refresh Now</button>
          </div>
        ` : ''}

        <!-- Quest List -->
        <div class="quest-list" style="display: flex; flex-direction: column; gap: 15px;">
          ${questData.quests.length > 0 ? questData.quests.map(quest => this.renderQuestCard(quest)).join('') : `
            <div style="text-align: center; padding: 40px; color: #64748b;">
              <div style="font-size: 48px; margin-bottom: 10px;">📭</div>
              <div style="font-size: 16px;">No quests available</div>
              <div style="font-size: 12px; margin-top: 5px;">Check back tomorrow!</div>
            </div>
          `}
        </div>
      </div>
    `;

    // Add event listeners
    this.attachEventListeners(rootEl);
  },

  renderQuestCard(quest) {
    const progress = Math.min(quest.progress, quest.target);
    const progressPercent = (progress / quest.target) * 100;
    const isComplete = quest.completed;
    const isClaimed = quest.claimed;

    // Status badge
    let statusBadge = '';
    if (isClaimed) {
      statusBadge = '<div class="quest-status claimed">✓ Claimed</div>';
    } else if (isComplete) {
      statusBadge = '<div class="quest-status complete">✓ Complete</div>';
    } else {
      statusBadge = `<div class="quest-status in-progress">${progress}/${quest.target}</div>`;
    }

    // Reward display
    const rewardsList = Object.entries(quest.rewards).map(([key, value]) => {
      const label = this.formatResourceName(key);
      const icon = this.getResourceIcon(key);
      return `<span class="reward-item">${icon} ${value} ${label}</span>`;
    }).join('');

    return `
      <div class="quest-card ${isComplete ? 'complete' : ''} ${isClaimed ? 'claimed' : ''}"
           data-quest-id="${quest.id}"
           style="
             border: 2px solid ${isClaimed ? '#64748b' : isComplete ? '#10b981' : '#3b82f6'};
             border-radius: 8px;
             padding: 16px;
             background: ${isClaimed ? '#f1f5f9' : isComplete ? '#ecfdf5' : '#eff6ff'};
             opacity: ${isClaimed ? '0.6' : '1'};
           ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 24px;">${quest.icon}</span>
              <h3 style="margin: 0; font-size: 16px; color: #1e293b;">${quest.name}</h3>
            </div>
            <div style="font-size: 13px; color: #64748b; margin-left: 32px;">${quest.description}</div>
          </div>
          ${statusBadge}
        </div>

        <!-- Progress Bar -->
        <div class="quest-progress-bar" style="
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        ">
          <div style="
            width: ${progressPercent}%;
            height: 100%;
            background: ${isClaimed ? '#94a3b8' : isComplete ? '#10b981' : '#3b82f6'};
            transition: width 0.3s;
          "></div>
        </div>

        <!-- Rewards & Claim Button -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="quest-rewards" style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: #475569;">
            ${rewardsList}
          </div>
          ${isComplete && !isClaimed ? `
            <button class="btn btn-sm btn-success btn-claim-quest" data-quest-id="${quest.id}">
              Claim Rewards
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  attachEventListeners(rootEl) {
    // Refresh quests button
    const refreshBtn = rootEl.querySelector('#btn-refresh-quests');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshDailyQuests();
        this.render(rootEl);
      });
    }

    // Claim reward buttons
    rootEl.querySelectorAll('.btn-claim-quest').forEach(btn => {
      btn.addEventListener('click', () => {
        const questId = btn.dataset.questId;
        const result = claimQuestReward(questId);

        if (result.success) {
          // Show success animation
          this.showClaimSuccess(btn, result);
          // Refresh after animation
          setTimeout(() => this.render(rootEl), 1500);
        } else {
          console.error('Failed to claim reward:', result.message);
        }
      });
    });
  },

  showClaimSuccess(button, result) {
    const originalText = button.textContent;
    button.textContent = '✓ Claimed!';
    button.disabled = true;
    button.style.background = '#10b981';

    // Create floating rewards animation
    const card = button.closest('.quest-card');
    const rewards = result.granted.join(', ');

    const floatingText = document.createElement('div');
    floatingText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: floatUp 1.5s ease-out forwards;
      z-index: 100;
      pointer-events: none;
    `;
    floatingText.textContent = `+${rewards}`;

    card.style.position = 'relative';
    card.appendChild(floatingText);

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        0% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -150%); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      floatingText.remove();
      style.remove();
    }, 1500);
  },

  formatResourceName(key) {
    const names = {
      gold: 'Gold',
      soulCores: 'Soul Cores',
      codeFragments: 'Code Fragments',
      memoryFragments: 'Memory Fragments',
      awakeningShards: 'Awakening Shards'
    };
    return names[key] || key;
  },

  getResourceIcon(key) {
    const icons = {
      gold: '💰',
      soulCores: '✨',
      codeFragments: '🔧',
      memoryFragments: '💾',
      awakeningShards: '⭐'
    };
    return icons[key] || '📦';
  }
};

// CSS Styles
const styleTag = document.createElement('style');
styleTag.textContent = `
  .daily-quests-app {
    padding: 20px;
    max-height: 600px;
    overflow-y: auto;
  }

  .quest-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
  }

  .quest-status.in-progress {
    background: #3b82f6;
    color: white;
  }

  .quest-status.complete {
    background: #10b981;
    color: white;
    animation: pulse 2s infinite;
  }

  .quest-status.claimed {
    background: #94a3b8;
    color: white;
  }

  .reward-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 4px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .quest-card.complete .reward-item {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .btn-claim-quest {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
document.head.appendChild(styleTag);
