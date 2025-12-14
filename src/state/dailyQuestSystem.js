// ===== Daily Quest System =====
// 3 daily quests that refresh every 24 hours

import { gameState, saveGame } from './enhancedGameState.js';
import { eventBus, EVENTS } from './eventBus.js';

// Quest templates (pool to randomly select from)
export const QUEST_TEMPLATES = {
  defeat_enemies_50: {
    id: 'defeat_enemies_50',
    name: 'Enemy Exterminator I',
    description: 'Defeat 50 enemies',
    type: 'defeat_enemies',
    target: 50,
    rewards: {
      gold: 200,
      soulCores: 20
    },
    icon: '⚔️',
    weight: 10 // Higher = more common
  },
  defeat_enemies_100: {
    id: 'defeat_enemies_100',
    name: 'Enemy Exterminator II',
    description: 'Defeat 100 enemies',
    type: 'defeat_enemies',
    target: 100,
    rewards: {
      gold: 500,
      soulCores: 50,
      codeFragments: 10
    },
    icon: '⚔️',
    weight: 5
  },
  complete_dungeons_3: {
    id: 'complete_dungeons_3',
    name: 'Dungeon Crawler',
    description: 'Complete 3 dungeons',
    type: 'complete_dungeons',
    target: 3,
    rewards: {
      gold: 300,
      codeFragments: 15
    },
    icon: '🏰',
    weight: 8
  },
  complete_dungeons_5: {
    id: 'complete_dungeons_5',
    name: 'Dungeon Master',
    description: 'Complete 5 dungeons',
    type: 'complete_dungeons',
    target: 5,
    rewards: {
      gold: 600,
      codeFragments: 30,
      memoryFragments: 5
    },
    icon: '🏰',
    weight: 4
  },
  earn_gold_1000: {
    id: 'earn_gold_1000',
    name: 'Gold Collector',
    description: 'Earn 1,000 gold',
    type: 'earn_gold',
    target: 1000,
    rewards: {
      soulCores: 30,
      codeFragments: 10
    },
    icon: '💰',
    weight: 7
  },
  earn_gold_5000: {
    id: 'earn_gold_5000',
    name: 'Treasure Hunter',
    description: 'Earn 5,000 gold',
    type: 'earn_gold',
    target: 5000,
    rewards: {
      soulCores: 100,
      codeFragments: 30,
      memoryFragments: 10
    },
    icon: '💰',
    weight: 3
  },
  summon_heroes_1: {
    id: 'summon_heroes_1',
    name: 'Soul Summoner',
    description: 'Summon 1 hero',
    type: 'summon_heroes',
    target: 1,
    rewards: {
      gold: 500,
      soulCores: 30
    },
    icon: '✨',
    weight: 6
  },
  summon_heroes_3: {
    id: 'summon_heroes_3',
    name: 'Mass Summoning',
    description: 'Summon 3 heroes',
    type: 'summon_heroes',
    target: 3,
    rewards: {
      gold: 1500,
      soulCores: 100,
      awakeningShards: 2
    },
    icon: '✨',
    weight: 2
  },
  level_up_hero: {
    id: 'level_up_hero',
    name: 'Training Day',
    description: 'Level up a hero',
    type: 'level_up_hero',
    target: 1,
    rewards: {
      gold: 400,
      codeFragments: 20
    },
    icon: '📈',
    weight: 6
  },
  complete_research: {
    id: 'complete_research',
    name: 'Researcher',
    description: 'Complete 1 research',
    type: 'complete_research',
    target: 1,
    rewards: {
      gold: 300,
      codeFragments: 25,
      memoryFragments: 5
    },
    icon: '🔬',
    weight: 5
  },
  recycle_items_5: {
    id: 'recycle_items_5',
    name: 'Recycler',
    description: 'Recycle 5 items',
    type: 'recycle_items',
    target: 5,
    rewards: {
      gold: 200,
      codeFragments: 15
    },
    icon: '♻️',
    weight: 7
  },
  defeat_boss: {
    id: 'defeat_boss',
    name: 'Boss Slayer',
    description: 'Defeat 1 boss',
    type: 'defeat_boss',
    target: 1,
    rewards: {
      gold: 800,
      soulCores: 50,
      memoryFragments: 10
    },
    icon: '💀',
    weight: 4
  }
};

// Initialize daily quest state
export function initDailyQuestState() {
  if (!gameState.dailyQuests) {
    gameState.dailyQuests = {
      quests: [],
      lastRefreshDate: null,
      totalQuestsCompleted: 0,
      streakDays: 0
    };
  }
}

/**
 * Check if quests need to be refreshed (24 hour cycle)
 */
export function shouldRefreshQuests() {
  initDailyQuestState();

  const today = getTodayDateString();
  const lastRefresh = gameState.dailyQuests.lastRefreshDate;

  return !lastRefresh || lastRefresh !== today;
}

/**
 * Generate 3 random quests from the pool
 */
export function generateDailyQuests() {
  const templates = Object.values(QUEST_TEMPLATES);
  const selected = [];

  // Use weighted random selection
  const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0);

  while (selected.length < 3) {
    let random = Math.random() * totalWeight;

    for (const template of templates) {
      random -= template.weight;
      if (random <= 0) {
        // Check if not already selected
        if (!selected.find(q => q.id === template.id)) {
          selected.push({ ...template });
        }
        break;
      }
    }
  }

  return selected.map(template => ({
    ...template,
    progress: 0,
    completed: false,
    claimed: false
  }));
}

/**
 * Refresh daily quests (call this on login)
 */
export function refreshDailyQuests() {
  initDailyQuestState();

  if (!shouldRefreshQuests()) {
    console.log('Daily quests already refreshed today');
    return;
  }

  // Check if all previous quests were completed (for streak)
  const allCompleted = gameState.dailyQuests.quests.length > 0 &&
    gameState.dailyQuests.quests.every(q => q.completed);

  if (allCompleted) {
    gameState.dailyQuests.streakDays = (gameState.dailyQuests.streakDays || 0) + 1;
  } else if (gameState.dailyQuests.quests.length > 0) {
    gameState.dailyQuests.streakDays = 0;
  }

  // Generate new quests
  gameState.dailyQuests.quests = generateDailyQuests();
  gameState.dailyQuests.lastRefreshDate = getTodayDateString();

  saveGame();

  eventBus.emit(EVENTS.DAILY_QUESTS_REFRESHED, {
    quests: gameState.dailyQuests.quests,
    streak: gameState.dailyQuests.streakDays
  });

  console.log('Daily quests refreshed! New quests available.');
}

/**
 * Update quest progress
 */
export function updateQuestProgress(type, amount = 1) {
  initDailyQuestState();

  if (!gameState.dailyQuests.quests || gameState.dailyQuests.quests.length === 0) {
    return;
  }

  let updated = false;

  for (const quest of gameState.dailyQuests.quests) {
    if (quest.type === type && !quest.completed) {
      quest.progress = Math.min(quest.progress + amount, quest.target);

      if (quest.progress >= quest.target) {
        quest.completed = true;
        console.log(`Quest completed: ${quest.name}!`);

        eventBus.emit(EVENTS.QUEST_COMPLETED, quest);
      }

      updated = true;
    }
  }

  if (updated) {
    saveGame();
    eventBus.emit(EVENTS.QUEST_PROGRESS_UPDATED, { type, amount });
  }
}

/**
 * Claim quest rewards
 */
export function claimQuestReward(questId) {
  initDailyQuestState();

  const quest = gameState.dailyQuests.quests.find(q => q.id === questId);

  if (!quest) {
    return { success: false, message: 'Quest not found' };
  }

  if (!quest.completed) {
    return { success: false, message: 'Quest not completed yet' };
  }

  if (quest.claimed) {
    return { success: false, message: 'Reward already claimed' };
  }

  // Grant rewards
  const granted = [];

  if (quest.rewards.gold) {
    gameState.gold += quest.rewards.gold;
    granted.push(`${quest.rewards.gold} Gold`);
  }

  if (quest.rewards.soulCores) {
    gameState.soulCores += quest.rewards.soulCores;
    granted.push(`${quest.rewards.soulCores} Soul Cores`);
  }

  if (quest.rewards.codeFragments) {
    gameState.currencies.codeFragments += quest.rewards.codeFragments;
    granted.push(`${quest.rewards.codeFragments} Code Fragments`);
  }

  if (quest.rewards.memoryFragments) {
    gameState.currencies.memoryFragments += quest.rewards.memoryFragments;
    granted.push(`${quest.rewards.memoryFragments} Memory Fragments`);
  }

  if (quest.rewards.awakeningShards) {
    gameState.currencies.awakeningShards += quest.rewards.awakeningShards;
    granted.push(`${quest.rewards.awakeningShards} Awakening Shards`);
  }

  // Mark as claimed
  quest.claimed = true;
  gameState.dailyQuests.totalQuestsCompleted += 1;

  saveGame();

  eventBus.emit(EVENTS.QUEST_REWARD_CLAIMED, {
    quest: quest,
    granted: granted
  });

  console.log(`Quest reward claimed: ${granted.join(', ')}`);

  return {
    success: true,
    quest: quest,
    granted: granted
  };
}

/**
 * Get all daily quests with status
 */
export function getDailyQuests() {
  initDailyQuestState();

  return {
    quests: gameState.dailyQuests.quests || [],
    streak: gameState.dailyQuests.streakDays || 0,
    totalCompleted: gameState.dailyQuests.totalQuestsCompleted || 0,
    canRefresh: shouldRefreshQuests()
  };
}

/**
 * Check if all daily quests are complete
 */
export function areAllQuestsComplete() {
  initDailyQuestState();

  if (!gameState.dailyQuests.quests || gameState.dailyQuests.quests.length === 0) {
    return false;
  }

  return gameState.dailyQuests.quests.every(q => q.completed);
}

// ===== Helper Functions =====

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Export event types
if (!EVENTS.DAILY_QUESTS_REFRESHED) {
  EVENTS.DAILY_QUESTS_REFRESHED = 'daily_quests_refreshed';
  EVENTS.QUEST_COMPLETED = 'quest_completed';
  EVENTS.QUEST_PROGRESS_UPDATED = 'quest_progress_updated';
  EVENTS.QUEST_REWARD_CLAIMED = 'quest_reward_claimed';
}

// ===== Quest Progress Tracking Hooks =====

/**
 * Setup automatic quest tracking by listening to game events
 */
export function initQuestTracking() {
  // Enemy defeats
  eventBus.on('ENEMY_DEFEATED', () => {
    updateQuestProgress('defeat_enemies', 1);
  });

  // Boss defeats
  eventBus.on('BOSS_DEFEATED', () => {
    updateQuestProgress('defeat_boss', 1);
  });

  // Dungeon completions
  eventBus.on(EVENTS.DUNGEON_COMPLETED, () => {
    updateQuestProgress('complete_dungeons', 1);
  });

  // Gold earned
  let lastGoldAmount = gameState.gold;
  setInterval(() => {
    const currentGold = gameState.gold;
    const goldEarned = currentGold - lastGoldAmount;
    if (goldEarned > 0) {
      updateQuestProgress('earn_gold', goldEarned);
    }
    lastGoldAmount = currentGold;
  }, 5000); // Check every 5 seconds

  // Hero summons
  eventBus.on(EVENTS.HERO_SUMMONED, () => {
    updateQuestProgress('summon_heroes', 1);
  });

  // Hero level ups
  eventBus.on('HERO_LEVEL_UP', () => {
    updateQuestProgress('level_up_hero', 1);
  });

  // Research completed
  eventBus.on(EVENTS.RESEARCH_COMPLETED, () => {
    updateQuestProgress('complete_research', 1);
  });

  // Items recycled
  eventBus.on('ITEM_RECYCLED', () => {
    updateQuestProgress('recycle_items', 1);
  });

  console.log('Quest tracking initialized');
}
