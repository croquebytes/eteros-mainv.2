// ===== Daily Login Calendar Modal =====
// Shows 7-day login rewards and allows claiming

import {
  getAllRewardsStatus,
  claimDailyReward,
  getLoginStreakInfo,
  canClaimDailyReward
} from '../../state/dailyLoginSystem.js';

// ===== Daily Rewards App =====
// Windowed version of proper daily login system

export const dailyRewardsApp = {
  id: 'dailyRewards',
  title: 'Daily Rewards',
  icon: '📅',

  createContent(rootEl) {
    this.render(rootEl);
  },

  render(rootEl) {
    const rewards = getAllRewardsStatus();
    const streakInfo = getLoginStreakInfo();

    rootEl.innerHTML = `
      <div class="window-content daily-rewards-app" style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); padding: 20px; color: white; display: flex; flex-direction: column; height: 100%;">
        
        <!-- Header Section -->
        <div class="streak-header" style="
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
        ">
          <div class="streak-info">
             <div style="font-size: 13px; opacity: 0.8; letter-spacing: 1px; text-transform: uppercase;">Current Streak</div>
             <div style="font-size: 36px; font-weight: 800; line-height: 1.2;">
                ${streakInfo.currentStreak} <span style="font-size: 16px; font-weight: 600; opacity: 0.9;">DAYS</span>
             </div>
          </div>
          <div class="streak-icon" style="font-size: 48px;">🔥</div>
        </div>

        <!-- Scrollable Grid -->
        <div class="rewards-scroll-container" style="flex: 1; overflow-y: auto; padding-right: 4px;">
           <div class="daily-rewards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
             ${rewards.map(reward => renderRewardCard(reward)).join('')}
           </div>
        </div>

        <!-- Footer / Status -->
        <div class="rewards-footer" style="margin-top: 20px;">
           ${canClaimDailyReward() ? `
             <div class="status-banner" style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; animation: pulse-green 2s infinite;">
               ✨ Reward Available! Claim Day ${streakInfo.currentStreak} above.
             </div>
           ` : `
             <div class="status-banner" style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; color: #60a5fa; padding: 12px; border-radius: 8px; text-align: center; font-size: 13px;">
               Next reward available in: <span id="dr-timer">Calculating...</span>
             </div>
           `}
        </div>

      </div>
    `;

    // Attach Event Listeners
    rootEl.querySelectorAll('.reward-card').forEach(card => {
      card.addEventListener('click', () => {
        const day = parseInt(card.dataset.day);
        const status = card.dataset.status;

        if (status === 'current' && canClaimDailyReward()) {
          const result = claimDailyReward();
          if (result.success) {
            // Play sound if available
            // soundManager.play('success'); 

            // Show overlay animation
            showClaimSuccess(rootEl, result);

            // Notify system (remove badge)
            if (window.onDailyRewardClaimed) window.onDailyRewardClaimed();

            // Re-render after delay
            setTimeout(() => {
              this.render(rootEl);
            }, 2500);
          }
        } else if (status === 'locked') {
          // Shake animation?
        }
      });
    });

    if (!canClaimDailyReward()) {
      this.startTimer(rootEl);
    }
  },

  startTimer(rootEl) {
    // Simple countdown to midnight logic could go here
    const timerEl = rootEl.querySelector('#dr-timer');
    if (timerEl) timerEl.textContent = "Tomorrow";
  }
};

/**
 * Legacy modal function - redirected to open Window now?
 * Or kept for backward compatibility but unused.
 */
export function showDailyLoginModal() {
  // no-op or redirect
  console.warn("showDailyLoginModal is deprecated. Use windowManager.openWindow('dailyRewards')");
}

function renderRewardCard(reward) {
  let statusClass = '';
  let statusLabel = '';
  let clickable = false;

  if (reward.claimed) {
    statusClass = 'claimed';
    statusLabel = '✓';
  } else if (reward.current) {
    statusClass = 'current';
    statusLabel = canClaimDailyReward() ? 'CLAIM!' : 'TODAY';
    clickable = canClaimDailyReward();
  } else if (reward.locked) {
    statusClass = 'locked';
    statusLabel = '🔒';
  }

  const rewardsList = Object.entries(reward.rewards).map(([key, value]) => {
    const label = formatResourceName(key);
    return `<div style="font-size: 11px; color: #94a3b8;">${value} ${label}</div>`;
  }).join('');

  return `
    <div class="reward-card ${statusClass} ${clickable ? 'clickable' : ''}"
         data-day="${reward.day}"
         data-status="${reward.current ? 'current' : reward.locked ? 'locked' : 'claimed'}"
         style="
           position: relative;
           padding: 12px;
           border: 2px solid ${reward.current ? '#10b981' : reward.locked ? '#64748b' : '#3b82f6'};
           border-radius: 8px;
           background: ${reward.current ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : reward.locked ? '#1e293b' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
           cursor: ${clickable ? 'pointer' : 'default'};
           opacity: ${reward.locked ? '0.5' : '1'};
           transition: transform 0.2s, box-shadow 0.2s;
           ${clickable ? 'animation: pulse 2s infinite;' : ''}
         ">
      <div style="text-align: center; color: white;">
        <div style="font-size: 32px; margin-bottom: 5px;">${reward.icon}</div>
        <div style="font-size: 12px; font-weight: bold; margin-bottom: 3px;">Day ${reward.day}</div>
        ${reward.special ? '<div style="font-size: 10px; background: #fbbf24; color: #000; padding: 2px 6px; border-radius: 3px; display: inline-block; margin-bottom: 5px;">SPECIAL</div>' : ''}
        <div style="min-height: 60px;">
          ${rewardsList}
        </div>
        <div style="font-size: 11px; font-weight: bold; margin-top: 8px; padding: 4px; background: rgba(0,0,0,0.2); border-radius: 4px;">
          ${statusLabel}
        </div>
      </div>
    </div>
  `;
}

function formatResourceName(key) {
  const names = {
    gold: 'Gold',
    soulCores: 'Soul Cores',
    codeFragments: 'Code Fragments',
    memoryFragments: 'Memory Frag',
    awakeningShards: 'Awake Shards',
    legendaryShards: 'Legend Shards',
    entropyDust: 'Entropy Dust'
  };
  return names[key] || key;
}

function showClaimSuccess(modal, result) {
  const successDiv = document.createElement('div');
  successDiv.className = 'claim-success-overlay';
  successDiv.innerHTML = `
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 30px 50px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      text-align: center;
      animation: bounceIn 0.5s;
    ">
      <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Day ${result.day} Claimed!</div>
      <div style="font-size: 14px; opacity: 0.9;">
        ${result.granted.join('<br>')}
      </div>
    </div>
  `;
  modal.appendChild(successDiv);

  // Add animation keyframes (Global style usually, but handled here for encapsulation)
  if (!document.getElementById('daily-reward-styles')) {
    const style = document.createElement('style');
    style.id = 'daily-reward-styles';
    style.textContent = `
      @keyframes bounceIn {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
      @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      .reward-card.clickable:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
      }
    `;
    document.head.appendChild(style);
  }
}

function showTooltip(element, message) {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e293b;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11px;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  tooltip.textContent = message;
  element.style.position = 'relative';
  element.appendChild(tooltip);

  setTimeout(() => tooltip.remove(), 2000);
}

/**
 * Check if modal should auto-show (on app load if reward available)
 */
export function shouldAutoShowDailyLogin() {
  return canClaimDailyReward();
}
