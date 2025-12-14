// ===== Prestige System (OS Upgrades) =====
// "Reinstalling Windows... please wait."

import { gameState, saveGame, createHero } from './gameState.js';
import { CONFIG } from './config.js';

export const prestigeSystem = {
    // Calculate potential Entropy Dust based on lifetime gold
    calculateEntropyGain() {
        // Formula: (Lifetime Gold / 10000) ^ 0.5
        // Example: 10,000 Gold -> 1 Dust
        // Example: 1,000,000 Gold -> 10 Dust
        if (gameState.lifetimeGold < 10000) return 0;
        return Math.floor(Math.pow(gameState.lifetimeGold / 10000, 0.5));
    },

    // Calculate cost for next OS Version
    getNextVersionCost() {
        // Version 1.0 -> 2.0 costs 10 Dust
        // Version 2.0 -> 3.0 costs 50 Dust
        // etc.
        const currentVersion = parseFloat(gameState.version) || 1.0;
        const nextVersionInt = Math.floor(currentVersion) + 1;

        // Simple exponential cost
        return Math.floor(10 * Math.pow(5, nextVersionInt - 2));
    },

    // Perform System Reinstall (Soft Reset)
    performReinstall() {
        const dustGain = this.calculateEntropyGain();

        // 1. Grant Prestige Currency
        gameState.resources.entropyDust = (gameState.resources.entropyDust || 0) + dustGain;

        // 2. Reset Game State
        this.resetStateForUpdate();

        // 3. Save
        saveGame();

        return {
            success: true,
            dustGained: dustGain
        };
    },

    // Purchase Next OS Version
    performUpgrade() {
        const cost = this.getNextVersionCost();
        if ((gameState.resources.entropyDust || 0) < cost) {
            return { success: false, message: 'Insufficient Entropy Dust' };
        }

        // Pay Cost
        gameState.resources.entropyDust -= cost;

        // Increment Version
        const currentVersion = parseFloat(gameState.version) || 1.0;
        const newVersion = (Math.floor(currentVersion) + 1) + ".0.0";
        gameState.version = newVersion;

        saveGame();

        return {
            success: true,
            newVersion: newVersion
        };
    },

    resetStateForUpdate() {
        // Reset Progress
        gameState.wave = 1;
        gameState.gold = 0;
        gameState.xp = 0;
        gameState.lifetimeGold = 0; // Reset for next prestige calculation? Or keep cumulative? Usually reset for "current run" calculation.
        // Let's reset lifetimeGold so the formula works on "gold earned this run"

        // Reset Heroes
        gameState.heroes = [
            createHero('warrior', 'Sword Saint', 1),
            createHero('mage', 'Archmage', 1),
            createHero('ranger', 'Hunter', 1),
            createHero('cleric', 'Healer', 1)
        ];

        // Reset Inventory
        gameState.inventory = [];

        // Reset Dungeon State
        gameState.currentDungeonId = 'story_node_1';
        gameState.dungeonState = {
            running: false,
            autoRun: false,
            currentWave: 1,
            timeInWave: 0,
            isRaid: false,
            raidTarget: null
        };

        // Reset Temporary Resources (Keep Entropy Dust, Code Fragments?)
        // Let's keep Code Fragments as they are "files" on the disk
        gameState.resources.gold = 0;
        gameState.resources.cpuCycles = 100; // Reset CPU

        // Reset Upgrades that aren't permanent (Soulware Store might be permanent? Let's say yes for now, or maybe partial reset)
        // For now, let's keep upgrades to make it a "New Game+" feel
        // If we wanted a hard reset, we'd clear gameState.upgrades
    },

    // Get Global Multiplier based on OS Version
    getGlobalMultiplier() {
        const version = parseFloat(gameState.version) || 1.0;
        return Math.pow(2, Math.floor(version) - 1);
    },

    // ===== Hardware Upgrades =====

    getHardwareCost(type) {
        const hardwareConfig = CONFIG.hardware[type];
        if (!hardwareConfig) return 999999;

        const currentLevel = gameState.prestigeState.hardware[type] || 0;
        if (currentLevel >= hardwareConfig.maxLevel) return 0; // Maxed

        // Cost Formula: Base * Scale ^ Level
        return Math.floor(hardwareConfig.baseCost * Math.pow(hardwareConfig.costScale, currentLevel));
    },

    buyHardware(type) {
        const cost = this.getHardwareCost(type);
        const currentLevel = gameState.prestigeState.hardware[type] || 0;
        const hardwareConfig = CONFIG.hardware[type];

        if (!hardwareConfig) return { success: false, error: 'Invalid hardware type' };
        if (currentLevel >= hardwareConfig.maxLevel) return { success: false, error: 'Max level reached' };
        if (gameState.prestigeState.sigilPoints < cost) return { success: false, error: 'Not enough Sigil Points' };

        // Deduct Cost
        gameState.prestigeState.sigilPoints -= cost;

        // Upgrade
        gameState.prestigeState.hardware[type] = currentLevel + 1;

        // Save
        saveGame();

        return {
            success: true,
            newLevel: currentLevel + 1,
            message: `Upgraded ${hardwareConfig.name} to Level ${currentLevel + 1}`
        };
    },

    // Calculate dynamic bonuses from Hardware
    getHardwareBonus(bonusType) {
        let total = 0;

        // RAM: inventorySlots
        if (bonusType === 'inventorySlots') {
            total += (gameState.prestigeState.hardware.ram || 0) * CONFIG.hardware.ram.effects.inventorySlots;
        }

        // CPU: damageMult, combatSpeed
        if (bonusType === 'heroDamage') {
            total += (gameState.prestigeState.hardware.cpu || 0) * CONFIG.hardware.cpu.effects.damageMult;
        }
        if (bonusType === 'combatSpeed') { // additive speed mult
            total += (gameState.prestigeState.hardware.cpu || 0) * CONFIG.hardware.cpu.effects.combatSpeed;
        }

        // GPU: goldMult, luck
        if (bonusType === 'goldMultiplier') {
            total += (gameState.prestigeState.hardware.gpu || 0) * CONFIG.hardware.gpu.effects.goldMult;
        }

        // SSD: offlineTime
        if (bonusType === 'maxOfflineTime') {
            total += (gameState.prestigeState.hardware.ssd || 0) * CONFIG.hardware.ssd.effects.offlineTime;
        }

        return total;
    }
};
