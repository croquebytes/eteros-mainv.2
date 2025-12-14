// ===== Achievement System =====
// Long-term goals and milestones with rewards

import { gameState, saveGame } from './enhancedGameState.js';
import { eventBus, EVENTS } from './eventBus.js';

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  PROGRESSION: 'progression',
  COMBAT: 'combat',
  COLLECTION: 'collection',
  MASTERY: 'mastery',
  ECONOMY: 'economy',
  SECRETS: 'secrets'
};

// Achievement definitions
export const ACHIEVEMENTS = {
  // ===== PROGRESSION =====
  wave_100: {
    id: 'wave_100',
    name: 'Wave Warrior',
    description: 'Reach Wave 100',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    icon: '🌊',
    requirement: { type: 'wave', value: 100 },
    rewards: { gold: 1000, soulCores: 50 },
    points: 10
  },
  wave_500: {
    id: 'wave_500',
    name: 'Wave Master',
    description: 'Reach Wave 500',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    icon: '🌊',
    requirement: { type: 'wave', value: 500 },
    rewards: { gold: 5000, soulCores: 200, awakeningShards: 5 },
    points: 25
  },
  wave_1000: {
    id: 'wave_1000',
    name: 'Wave Legend',
    description: 'Reach Wave 1,000',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    icon: '🌊',
    requirement: { type: 'wave', value: 1000 },
    rewards: { gold: 10000, soulCores: 500, legendaryShards: 10 },
    points: 50
  },
  first_prestige: {
    id: 'first_prestige',
    name: 'System Reinstaller',
    description: 'Complete your first prestige',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    icon: '🔄',
    requirement: { type: 'prestige', value: 1 },
    rewards: { entropyDust: 5 },
    points: 20
  },
  prestige_5: {
    id: 'prestige_5',
    name: 'Reincarnation Expert',
    description: 'Prestige 5 times',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    icon: '🔄',
    requirement: { type: 'prestige', value: 5 },
    rewards: { entropyDust: 20 },
    points: 40
  },

  // ===== COMBAT =====
  enemies_1000: {
    id: 'enemies_1000',
    name: 'Slayer',
    description: 'Defeat 1,000 enemies',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '⚔️',
    requirement: { type: 'enemies_defeated', value: 1000 },
    rewards: { gold: 500, soulCores: 30 },
    points: 10
  },
  enemies_10000: {
    id: 'enemies_10000',
    name: 'Executioner',
    description: 'Defeat 10,000 enemies',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '⚔️',
    requirement: { type: 'enemies_defeated', value: 10000 },
    rewards: { gold: 5000, soulCores: 300 },
    points: 25
  },
  enemies_100000: {
    id: 'enemies_100000',
    name: 'Apocalypse',
    description: 'Defeat 100,000 enemies',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '⚔️',
    requirement: { type: 'enemies_defeated', value: 100000 },
    rewards: { gold: 50000, legendaryShards: 50 },
    points: 50
  },
  bosses_10: {
    id: 'bosses_10',
    name: 'Boss Hunter',
    description: 'Defeat 10 bosses',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '💀',
    requirement: { type: 'bosses_defeated', value: 10 },
    rewards: { gold: 1000, memoryFragments: 20 },
    points: 15
  },
  bosses_100: {
    id: 'bosses_100',
    name: 'Boss Slayer',
    description: 'Defeat 100 bosses',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '💀',
    requirement: { type: 'bosses_defeated', value: 100 },
    rewards: { gold: 10000, legendaryShards: 20 },
    points: 30
  },
  flawless_victory: {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Complete a dungeon without any hero dying',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '✨',
    requirement: { type: 'flawless_dungeon', value: 1 },
    rewards: { soulCores: 100 },
    points: 20
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a dungeon in under 30 seconds',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '⚡',
    requirement: { type: 'fast_dungeon', value: 30 },
    rewards: { soulCores: 150, codeFragments: 50 },
    points: 25
  },
  synergy_master: {
    id: 'synergy_master',
    name: 'Synergy Master',
    description: 'Activate 5 synergies at once',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    icon: '🔗',
    requirement: { type: 'synergies_active', value: 5 },
    rewards: { awakeningShards: 10 },
    points: 20
  },

  // ===== COLLECTION =====
  summon_10: {
    id: 'summon_10',
    name: 'Summoner',
    description: 'Summon 10 heroes',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '✨',
    requirement: { type: 'heroes_summoned', value: 10 },
    rewards: { soulCores: 50 },
    points: 10
  },
  summon_50: {
    id: 'summon_50',
    name: 'Soul Collector',
    description: 'Summon 50 heroes',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '✨',
    requirement: { type: 'heroes_summoned', value: 50 },
    rewards: { soulCores: 300, legendaryShards: 5 },
    points: 25
  },
  summon_100: {
    id: 'summon_100',
    name: 'Gacha Addict',
    description: 'Summon 100 heroes',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '✨',
    requirement: { type: 'heroes_summoned', value: 100 },
    rewards: { soulCores: 1000, legendaryShards: 20 },
    points: 40
  },
  items_100: {
    id: 'items_100',
    name: 'Hoarder',
    description: 'Collect 100 items',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '📦',
    requirement: { type: 'items_collected', value: 100 },
    rewards: { gold: 2000 },
    points: 10
  },
  items_500: {
    id: 'items_500',
    name: 'Pack Rat',
    description: 'Collect 500 items',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '📦',
    requirement: { type: 'items_collected', value: 500 },
    rewards: { gold: 10000, codeFragments: 100 },
    points: 25
  },
  legendary_item: {
    id: 'legendary_item',
    name: 'Legend Found',
    description: 'Obtain your first legendary item',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '⭐',
    requirement: { type: 'legendary_item', value: 1 },
    rewards: { legendaryShards: 10 },
    points: 20
  },
  full_party_legendary: {
    id: 'full_party_legendary',
    name: 'Legendary Squad',
    description: 'Have 4 legendary rarity heroes in your party',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    icon: '⭐',
    requirement: { type: 'party_legendary', value: 4 },
    rewards: { legendaryShards: 50, entropyDust: 5 },
    points: 50
  },

  // ===== MASTERY =====
  hero_level_50: {
    id: 'hero_level_50',
    name: 'Trainer',
    description: 'Level a hero to 50',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '📈',
    requirement: { type: 'hero_level', value: 50 },
    rewards: { gold: 3000, awakeningShards: 5 },
    points: 15
  },
  hero_level_100: {
    id: 'hero_level_100',
    name: 'Master Trainer',
    description: 'Level a hero to 100',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '📈',
    requirement: { type: 'hero_level', value: 100 },
    rewards: { gold: 10000, awakeningShards: 20 },
    points: 30
  },
  hero_max_awakening: {
    id: 'hero_max_awakening',
    name: 'Fully Awakened',
    description: 'Fully awaken a hero (5 stars)',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '⭐',
    requirement: { type: 'hero_awakening', value: 5 },
    rewards: { awakeningShards: 50, entropyDust: 10 },
    points: 40
  },
  research_10: {
    id: 'research_10',
    name: 'Researcher',
    description: 'Complete 10 research projects',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🔬',
    requirement: { type: 'research_completed', value: 10 },
    rewards: { codeFragments: 100, memoryFragments: 50 },
    points: 20
  },
  research_all: {
    id: 'research_all',
    name: 'Tech Wizard',
    description: 'Complete all research projects',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🔬',
    requirement: { type: 'research_all', value: 1 },
    rewards: { entropyDust: 20, legendaryShards: 100 },
    points: 50
  },
  skill_tree_master: {
    id: 'skill_tree_master',
    name: 'Skill Tree Master',
    description: 'Unlock all skill nodes for a hero',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🌳',
    requirement: { type: 'skill_tree_complete', value: 1 },
    rewards: { gold: 5000, soulCores: 200 },
    points: 30
  },
  no_healer_win: {
    id: 'no_healer_win',
    name: 'No Healing Allowed',
    description: 'Win a dungeon without any healers',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '💪',
    requirement: { type: 'no_healer_dungeon', value: 1 },
    rewards: { soulCores: 100 },
    points: 25
  },
  solo_hero: {
    id: 'solo_hero',
    name: 'Solo Warrior',
    description: 'Win a dungeon with only 1 hero',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '👤',
    requirement: { type: 'solo_dungeon', value: 1 },
    rewards: { legendaryShards: 25 },
    points: 35
  },

  // ===== ECONOMY =====
  gold_10k: {
    id: 'gold_10k',
    name: 'Getting Rich',
    description: 'Earn 10,000 total gold',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '💰',
    requirement: { type: 'lifetime_gold', value: 10000 },
    rewards: { gold: 500 },
    points: 10
  },
  gold_100k: {
    id: 'gold_100k',
    name: 'Wealthy',
    description: 'Earn 100,000 total gold',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '💰',
    requirement: { type: 'lifetime_gold', value: 100000 },
    rewards: { gold: 5000 },
    points: 20
  },
  gold_1m: {
    id: 'gold_1m',
    name: 'Millionaire',
    description: 'Earn 1,000,000 total gold',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '💰',
    requirement: { type: 'lifetime_gold', value: 1000000 },
    rewards: { gold: 50000, entropyDust: 10 },
    points: 40
  },
  recycle_50: {
    id: 'recycle_50',
    name: 'Recycler',
    description: 'Recycle 50 items',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '♻️',
    requirement: { type: 'items_recycled', value: 50 },
    rewards: { codeFragments: 50 },
    points: 15
  },
  big_spender: {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend 50,000 gold in the Soulware Store',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '🛒',
    requirement: { type: 'gold_spent', value: 50000 },
    rewards: { soulCores: 200 },
    points: 20
  },
  market_trader: {
    id: 'market_trader',
    name: 'Market Trader',
    description: 'Complete 100 E-Buy transactions',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    icon: '📈',
    requirement: { type: 'ebuy_trades', value: 100 },
    rewards: { gold: 10000 },
    points: 25
  },

  // ===== SECRETS =====
  pet_max_mood: {
    id: 'pet_max_mood',
    name: 'Pet Whisperer',
    description: 'Get your pet to 100 mood',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '🐾',
    requirement: { type: 'pet_mood', value: 100 },
    rewards: { soulCores: 100 },
    points: 15,
    hidden: true
  },
  login_streak_30: {
    id: 'login_streak_30',
    name: 'Dedicated',
    description: 'Login for 30 days in a row',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '📅',
    requirement: { type: 'login_streak', value: 30 },
    rewards: { entropyDust: 10, legendaryShards: 50 },
    points: 40,
    hidden: true
  },
  daily_quest_perfect: {
    id: 'daily_quest_perfect',
    name: 'Quest Master',
    description: 'Complete all daily quests 7 days in a row',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '📋',
    requirement: { type: 'quest_streak', value: 7 },
    rewards: { soulCores: 500, entropyDust: 5 },
    points: 30,
    hidden: true
  },
  speed_prestige: {
    id: 'speed_prestige',
    name: 'Speed Runner',
    description: 'Prestige in under 1 hour of gameplay',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '⚡',
    requirement: { type: 'fast_prestige', value: 3600 },
    rewards: { entropyDust: 20 },
    points: 45,
    hidden: true
  },
  gambit_master: {
    id: 'gambit_master',
    name: 'Gambit Master',
    description: 'Create a 10-line gambit script',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '📜',
    requirement: { type: 'gambit_lines', value: 10 },
    rewards: { soulCores: 200 },
    points: 20,
    hidden: true
  },
  overclock_survived: {
    id: 'overclock_survived',
    name: 'Thermal Survivor',
    description: 'Survive 100% heat without throttling',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '🔥',
    requirement: { type: 'heat_survived', value: 100 },
    rewards: { codeFragments: 200 },
    points: 30,
    hidden: true
  },
  hidden_file: {
    id: 'hidden_file',
    name: 'File Explorer',
    description: 'Find a hidden .cfg file in the file system',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '📁',
    requirement: { type: 'hidden_file', value: 1 },
    rewards: { entropyDust: 5, legendaryShards: 10 },
    points: 25,
    hidden: true
  },
  all_apps_opened: {
    id: 'all_apps_opened',
    name: 'Power User',
    description: 'Open all desktop applications',
    category: ACHIEVEMENT_CATEGORIES.SECRETS,
    icon: '🖥️',
    requirement: { type: 'apps_opened', value: 20 },
    rewards: { soulCores: 300 },
    points: 15,
    hidden: true
  },

  // Meta achievements
  achievement_hunter_10: {
    id: 'achievement_hunter_10',
    name: 'Achievement Hunter',
    description: 'Unlock 10 achievements',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🏆',
    requirement: { type: 'achievements_unlocked', value: 10 },
    rewards: { gold: 2000 },
    points: 10
  },
  achievement_hunter_25: {
    id: 'achievement_hunter_25',
    name: 'Achievement Seeker',
    description: 'Unlock 25 achievements',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🏆',
    requirement: { type: 'achievements_unlocked', value: 25 },
    rewards: { gold: 10000, legendaryShards: 10 },
    points: 25
  },
  achievement_hunter_all: {
    id: 'achievement_hunter_all',
    name: 'Completionist',
    description: 'Unlock ALL achievements',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    icon: '🏆',
    requirement: { type: 'achievements_unlocked', value: Object.keys(this || {}).length - 1 }, // -1 to exclude self
    rewards: { entropyDust: 100, legendaryShards: 500 },
    points: 100,
    hidden: false
  }
};

// Initialize achievement state
export function initAchievementState() {
  if (!gameState.achievements) {
    gameState.achievements = {
      unlocked: [],
      progress: {}, // Track progress for each achievement
      totalPoints: 0,
      lastUnlocked: null
    };
  }
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievementId) {
  initAchievementState();
  return gameState.achievements.unlocked.includes(achievementId);
}

/**
 * Check achievement progress
 */
export function checkAchievement(achievementId) {
  initAchievementState();

  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return null;

  if (isAchievementUnlocked(achievementId)) {
    return { unlocked: true, progress: achievement.requirement.value, target: achievement.requirement.value };
  }

  const progress = getAchievementProgress(achievement);
  const target = achievement.requirement.value;

  return {
    unlocked: false,
    progress: progress,
    target: target,
    percentage: (progress / target) * 100
  };
}

/**
 * Get current progress for an achievement
 */
function getAchievementProgress(achievement) {
  const req = achievement.requirement;

  switch (req.type) {
    case 'wave':
      return gameState.wave || 0;
    case 'prestige':
      return gameState.prestigeCount || 0;
    case 'enemies_defeated':
      return gameState.stats?.totalEnemiesKilled || 0;
    case 'bosses_defeated':
      return gameState.stats?.totalBossesKilled || 0;
    case 'heroes_summoned':
      return gameState.stats?.totalHeroesSummoned || 0;
    case 'items_collected':
      return gameState.stats?.totalItemsFound || 0;
    case 'lifetime_gold':
      return gameState.lifetimeGold || 0;
    case 'items_recycled':
      return gameState.stats?.totalItemsRecycled || 0;
    case 'research_completed':
      return gameState.research?.completed?.length || 0;
    case 'hero_level':
      return Math.max(...(gameState.heroes || []).map(h => h.level || 0), 0);
    case 'login_streak':
      return gameState.dailyLogin?.currentStreak || 0;
    case 'quest_streak':
      return gameState.dailyQuests?.streakDays || 0;
    case 'pet_mood':
      return gameState.petState?.mood || 0;
    case 'achievements_unlocked':
      return gameState.achievements?.unlocked?.length || 0;
    default:
      return gameState.achievements?.progress?.[achievement.id] || 0;
  }
}

/**
 * Unlock an achievement
 */
export function unlockAchievement(achievementId) {
  initAchievementState();

  if (isAchievementUnlocked(achievementId)) {
    return { success: false, message: 'Already unlocked' };
  }

  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) {
    return { success: false, message: 'Achievement not found' };
  }

  // Grant rewards
  const granted = [];

  if (achievement.rewards.gold) {
    gameState.gold += achievement.rewards.gold;
    granted.push(`${achievement.rewards.gold} Gold`);
  }

  if (achievement.rewards.soulCores) {
    gameState.soulCores += achievement.rewards.soulCores;
    granted.push(`${achievement.rewards.soulCores} Soul Cores`);
  }

  if (achievement.rewards.codeFragments) {
    gameState.currencies.codeFragments += achievement.rewards.codeFragments;
    granted.push(`${achievement.rewards.codeFragments} Code Fragments`);
  }

  if (achievement.rewards.memoryFragments) {
    gameState.currencies.memoryFragments += achievement.rewards.memoryFragments;
    granted.push(`${achievement.rewards.memoryFragments} Memory Fragments`);
  }

  if (achievement.rewards.awakeningShards) {
    gameState.currencies.awakeningShards += achievement.rewards.awakeningShards;
    granted.push(`${achievement.rewards.awakeningShards} Awakening Shards`);
  }

  if (achievement.rewards.legendaryShards) {
    gameState.currencies.legendaryShards += achievement.rewards.legendaryShards;
    granted.push(`${achievement.rewards.legendaryShards} Legendary Shards`);
  }

  if (achievement.rewards.entropyDust) {
    gameState.resources.entropyDust += achievement.rewards.entropyDust;
    granted.push(`${achievement.rewards.entropyDust} Entropy Dust`);
  }

  // Mark as unlocked
  gameState.achievements.unlocked.push(achievementId);
  gameState.achievements.totalPoints += achievement.points;
  gameState.achievements.lastUnlocked = {
    id: achievementId,
    timestamp: Date.now()
  };

  saveGame();

  eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, {
    achievement: achievement,
    granted: granted
  });

  console.log(`🏆 Achievement Unlocked: ${achievement.name}! +${achievement.points} points`);
  console.log(`Rewards: ${granted.join(', ')}`);

  return {
    success: true,
    achievement: achievement,
    granted: granted
  };
}

/**
 * Check all achievements and unlock any that are ready
 */
export function checkAllAchievements() {
  initAchievementState();

  const newlyUnlocked = [];

  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    if (isAchievementUnlocked(id)) continue;

    const progress = getAchievementProgress(achievement);
    const target = achievement.requirement.value;

    if (progress >= target) {
      const result = unlockAchievement(id);
      if (result.success) {
        newlyUnlocked.push(result.achievement);
      }
    }
  }

  return newlyUnlocked;
}

/**
 * Get all achievements with status
 */
export function getAllAchievements() {
  initAchievementState();

  return Object.values(ACHIEVEMENTS).map(achievement => {
    const status = checkAchievement(achievement.id);
    return {
      ...achievement,
      ...status
    };
  });
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
  return getAllAchievements().filter(a => a.category === category);
}

/**
 * Get achievement statistics
 */
export function getAchievementStats() {
  initAchievementState();

  const total = Object.keys(ACHIEVEMENTS).length;
  const unlocked = gameState.achievements.unlocked.length;
  const points = gameState.achievements.totalPoints;

  return {
    total: total,
    unlocked: unlocked,
    locked: total - unlocked,
    points: points,
    percentage: (unlocked / total) * 100
  };
}

// Export event types
if (!EVENTS.ACHIEVEMENT_UNLOCKED) {
  EVENTS.ACHIEVEMENT_UNLOCKED = 'achievement_unlocked';
}

/**
 * Setup achievement tracking (run on app init)
 */
export function initAchievementTracking() {
  initAchievementState();

  // Check achievements every 10 seconds
  setInterval(() => {
    checkAllAchievements();
  }, 10000);

  console.log('Achievement tracking initialized');
}
