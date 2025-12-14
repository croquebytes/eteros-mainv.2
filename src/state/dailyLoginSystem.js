// ===== Daily Login Reward System =====
// 7-day login calendar with escalating rewards

import { gameState, saveGame } from './enhancedGameState.js';
import { eventBus, EVENTS } from './eventBus.js';

// 7-day reward cycle
export const LOGIN_REWARDS = {
  day1: {
    day: 1,
    name: 'Day 1 - Welcome Back',
    rewards: {
      gold: 100,
      soulCores: 10
    },
    icon: '💰'
  },
  day2: {
    day: 2,
    name: 'Day 2 - Loyalty Bonus',
    rewards: {
      gold: 200,
      codeFragments: 5
    },
    icon: '📦'
  },
  day3: {
    day: 3,
    name: 'Day 3 - Midweek Boost',
    rewards: {
      gold: 300,
      soulCores: 20,
      memoryFragments: 2
    },
    icon: '✨'
  },
  day4: {
    day: 4,
    name: 'Day 4 - Persistence',
    rewards: {
      gold: 400,
      codeFragments: 10,
      awakeningShards: 1
    },
    icon: '🎁'
  },
  day5: {
    day: 5,
    name: 'Day 5 - Almost There',
    rewards: {
      gold: 500,
      soulCores: 50,
      memoryFragments: 5
    },
    icon: '🌟'
  },
  day6: {
    day: 6,
    name: 'Day 6 - Final Stretch',
    rewards: {
      gold: 750,
      codeFragments: 20,
      awakeningShards: 2,
      legendaryShards: 1
    },
    icon: '💎'
  },
  day7: {
    day: 7,
    name: 'Day 7 - JACKPOT!',
    rewards: {
      gold: 1500,
      soulCores: 150,
      codeFragments: 50,
      memoryFragments: 10,
      awakeningShards: 5,
      legendaryShards: 3,
      entropyDust: 1
    },
    icon: '🎉',
    special: true
  }
};

// Initialize daily login state if it doesn't exist
export function initDailyLoginState() {
  if (!gameState.dailyLogin) {
    gameState.dailyLogin = {
      currentStreak: 0,
      lastLoginDate: null,
      totalLogins: 0,
      rewardsClaimed: [],
      lastClaimDate: null
    };
  }
}

/**
 * Check if player can claim today's login reward
 */
export function canClaimDailyReward() {
  initDailyLoginState();

  const today = getTodayDateString();
  const lastClaim = gameState.dailyLogin.lastClaimDate;

  // Can claim if never claimed before OR last claim was not today
  return !lastClaim || lastClaim !== today;
}

/**
 * Check if player logged in today (even if not claimed)
 */
export function hasLoggedInToday() {
  initDailyLoginState();

  const today = getTodayDateString();
  return gameState.dailyLogin.lastLoginDate === today;
}

/**
 * Update login tracking (called on app load)
 */
export function trackDailyLogin() {
  initDailyLoginState();

  const today = getTodayDateString();
  const lastLogin = gameState.dailyLogin.lastLoginDate;

  if (lastLogin === today) {
    // Already logged in today
    return;
  }

  // Check if streak continues
  const yesterday = getYesterdayDateString();
  if (lastLogin === yesterday) {
    // Streak continues
    gameState.dailyLogin.currentStreak = Math.min(gameState.dailyLogin.currentStreak + 1, 7);
  } else if (lastLogin !== null) {
    // Streak broken - reset to day 1
    gameState.dailyLogin.currentStreak = 1;
    console.log('Login streak broken! Starting fresh.');
  } else {
    // First time login
    gameState.dailyLogin.currentStreak = 1;
  }

  gameState.dailyLogin.lastLoginDate = today;
  gameState.dailyLogin.totalLogins += 1;

  saveGame();

  eventBus.emit(EVENTS.DAILY_LOGIN_TRACKED, {
    streak: gameState.dailyLogin.currentStreak,
    totalLogins: gameState.dailyLogin.totalLogins
  });

  console.log(`Daily login tracked! Streak: ${gameState.dailyLogin.currentStreak} days`);
}

/**
 * Claim today's daily login reward
 */
export function claimDailyReward() {
  initDailyLoginState();

  if (!canClaimDailyReward()) {
    return {
      success: false,
      message: 'Reward already claimed today!'
    };
  }

  const currentDay = gameState.dailyLogin.currentStreak || 1;
  const rewardKey = `day${currentDay}`;
  const reward = LOGIN_REWARDS[rewardKey];

  if (!reward) {
    return {
      success: false,
      message: 'Invalid reward day'
    };
  }

  // Grant rewards
  const granted = [];

  if (reward.rewards.gold) {
    gameState.gold += reward.rewards.gold;
    granted.push(`${reward.rewards.gold} Gold`);
  }

  if (reward.rewards.soulCores) {
    gameState.soulCores += reward.rewards.soulCores;
    granted.push(`${reward.rewards.soulCores} Soul Cores`);
  }

  if (reward.rewards.codeFragments) {
    gameState.currencies.codeFragments += reward.rewards.codeFragments;
    granted.push(`${reward.rewards.codeFragments} Code Fragments`);
  }

  if (reward.rewards.memoryFragments) {
    gameState.currencies.memoryFragments += reward.rewards.memoryFragments;
    granted.push(`${reward.rewards.memoryFragments} Memory Fragments`);
  }

  if (reward.rewards.awakeningShards) {
    gameState.currencies.awakeningShards += reward.rewards.awakeningShards;
    granted.push(`${reward.rewards.awakeningShards} Awakening Shards`);
  }

  if (reward.rewards.legendaryShards) {
    gameState.currencies.legendaryShards += reward.rewards.legendaryShards;
    granted.push(`${reward.rewards.legendaryShards} Legendary Shards`);
  }

  if (reward.rewards.entropyDust) {
    gameState.resources.entropyDust += reward.rewards.entropyDust;
    granted.push(`${reward.rewards.entropyDust} Entropy Dust`);
  }

  // Mark as claimed
  const today = getTodayDateString();
  gameState.dailyLogin.lastClaimDate = today;
  gameState.dailyLogin.rewardsClaimed.push({
    date: today,
    day: currentDay,
    rewards: reward.rewards
  });

  saveGame();

  eventBus.emit(EVENTS.DAILY_REWARD_CLAIMED, {
    day: currentDay,
    rewards: reward.rewards,
    granted: granted
  });

  console.log(`Daily reward claimed! Day ${currentDay}: ${granted.join(', ')}`);

  return {
    success: true,
    day: currentDay,
    reward: reward,
    granted: granted
  };
}

/**
 * Get current login streak info
 */
export function getLoginStreakInfo() {
  initDailyLoginState();

  return {
    currentStreak: gameState.dailyLogin.currentStreak || 0,
    totalLogins: gameState.dailyLogin.totalLogins || 0,
    canClaim: canClaimDailyReward(),
    nextReward: LOGIN_REWARDS[`day${gameState.dailyLogin.currentStreak || 1}`]
  };
}

/**
 * Get all 7 days of rewards with claim status
 */
export function getAllRewardsStatus() {
  initDailyLoginState();

  const currentDay = gameState.dailyLogin.currentStreak || 1;
  const canClaim = canClaimDailyReward();

  return Object.values(LOGIN_REWARDS).map(reward => ({
    ...reward,
    claimed: reward.day < currentDay || (reward.day === currentDay && !canClaim),
    current: reward.day === currentDay,
    locked: reward.day > currentDay
  }));
}

// ===== Helper Functions =====

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

// Export for event bus
if (!EVENTS.DAILY_LOGIN_TRACKED) {
  EVENTS.DAILY_LOGIN_TRACKED = 'daily_login_tracked';
  EVENTS.DAILY_REWARD_CLAIMED = 'daily_reward_claimed';
}
