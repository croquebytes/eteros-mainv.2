// ===== Daily Login Calendar Modal =====
// Shows 7-day login rewards and allows claiming

import {
  getAllRewardsStatus,
  claimDailyReward,
  getLoginStreakInfo,
  canClaimDailyReward
} from '../../state/dailyLoginSystem.js';

/**
 * Show the daily login calendar modal
 * @param {HTMLElement} containerEl - Container to append modal to
 * @param {Function} onClose - Callback when modal closes
 */
export function showDailyLoginModal(containerEl, onClose) {
  const rewards = getAllRewardsStatus();
  const streakInfo = getLoginStreakInfo();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay daily-login-modal';
  modal.innerHTML = `
    <div class="modal-dialog" style="max-width: 700px;">
      <div class="modal-header">
        <h2>📅 Daily Login Calendar</h2>
        <button class="btn-close-modal" id="close-daily-login">×</button>
      </div>
      <div class="modal-body">
        <div class="login-streak-info" style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
          <div style="font-size: 14px; opacity: 0.9;">Current Streak</div>
          <div style="font-size: 32px; font-weight: bold; margin: 5px 0;">${streakInfo.currentStreak} ${streakInfo.currentStreak === 1 ? 'Day' : 'Days'}</div>
          <div style="font-size: 12px; opacity: 0.8;">Total Logins: ${streakInfo.totalLogins}</div>
        </div>

        <div class="daily-rewards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
          ${rewards.map(reward => renderRewardCard(reward)).join('')}
        </div>

        ${canClaimDailyReward() ? `
          <div class="claim-notice" style="margin-top: 20px; padding: 12px; background: #10b981; color: white; border-radius: 6px; text-align: center; font-weight: bold;">
            ✅ Reward available! Click Day ${streakInfo.currentStreak} to claim!
          </div>
        ` : `
          <div class="claim-notice" style="margin-top: 20px; padding: 12px; background: #3b82f6; color: white; border-radius: 6px; text-align: center;">
            ⏰ Come back tomorrow for Day ${Math.min(streakInfo.currentStreak + 1, 7)} reward!
          </div>
        `}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="close-footer">Close</button>
      </div>
    </div>
  `;

  containerEl.appendChild(modal);

  // Event listeners
  const closeBtn = modal.querySelector('#close-daily-login');
  const closeFooter = modal.querySelector('#close-footer');

  const handleClose = () => {
    modal.remove();
    if (onClose) onClose();
  };

  closeBtn.addEventListener('click', handleClose);
  closeFooter.addEventListener('click', handleClose);

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      handleClose();
    }
  });

  // Claim buttons
  modal.querySelectorAll('.reward-card').forEach(card => {
    card.addEventListener('click', () => {
      const day = parseInt(card.dataset.day);
      const status = card.dataset.status;

      if (status === 'current' && canClaimDailyReward()) {
        const result = claimDailyReward();
        if (result.success) {
          // Show success animation
          showClaimSuccess(modal, result);
          // Refresh modal
          setTimeout(() => {
            modal.remove();
            showDailyLoginModal(containerEl, onClose);
          }, 2000);
        }
      } else if (status === 'locked') {
        showTooltip(card, 'Keep your streak to unlock this reward!');
      } else if (status === 'claimed') {
        showTooltip(card, 'Already claimed!');
      }
    });
  });
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

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounceIn {
      0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.05); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }
      50% { transform: scale(1.03); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6); }
    }
    .reward-card.clickable:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
    }
  `;
  document.head.appendChild(style);
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
