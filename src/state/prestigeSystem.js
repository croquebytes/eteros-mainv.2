// ===== Prestige System (OS Upgrades) =====
// "Reinstalling Windows... please wait."

// Removed circular import
import { CONFIG } from './config.js';

let _gameState = null;

export const prestigeSystem = {
    setGameState(state) {
        _gameState = state;
    },

    getGameState() {
        return _gameState;
    },

    // Calculate potential Entropy Dust based on lifetime gold
    calculateEntropyGain() {
        if (!_gameState) return 0;
        // Formula: (Lifetime Gold / 10000) ^ 0.5
        // Example: 10,000 Gold -> 1 Dust
        // Example: 1,000,000 Gold -> 10 Dust
        if (_gameState.lifetimeGold < 10000) return 0;
        return Math.floor(Math.pow(_gameState.lifetimeGold / 10000, 0.5));
    },

    // Calculate cost for next OS Version
    getNextVersionCost() {
        if (!_gameState) return 999999;
        // Version 1.0 -> 2.0 costs 10 Dust
        // Version 2.0 -> 3.0 costs 50 Dust
        // etc.
        const currentVersion = parseFloat(_gameState.version) || 1.0;
        const nextVersionInt = Math.floor(currentVersion) + 1;

        // Simple exponential cost
        return Math.floor(10 * Math.pow(5, nextVersionInt - 2));
    },

    // Perform System Reinstall (Soft Reset)
    performReinstall() {
        if (!_gameState) return { success: false, error: 'System not initialized' };
        const dustGain = this.calculateEntropyGain();

        // 1. Grant Prestige Currency
        _gameState.resources.entropyDust = (_gameState.resources.entropyDust || 0) + dustGain;

        // 2. Reset Game State
        this.resetStateForUpdate();

        // 3. Save (Function needs to be passed or handled by main)
        // For now we assume gameState has save capability or we trigger auto-save
        // But enhancedGameState has saveGame function export, not on object.
        return {
            success: true,
            dustGained: dustGain
        };
    },

    // Purchase Next OS Version
    performUpgrade() {
        if (!_gameState) return { success: false, error: 'System not initialized' };
        const cost = this.getNextVersionCost();
        if ((_gameState.resources.entropyDust || 0) < cost) {
            return { success: false, message: 'Insufficient Entropy Dust' };
        }

        // Pay Cost
        _gameState.resources.entropyDust -= cost;

        // Increment Version
        const currentVersion = parseFloat(_gameState.version) || 1.0;
        const newVersion = (Math.floor(currentVersion) + 1) + ".0.0";
        _gameState.version = newVersion;

        return {
            success: true,
            newVersion: newVersion
        };
    },

    resetStateForUpdate() {
        if (!_gameState) return;
        // Reset Progress
        _gameState.wave = 1;
        _gameState.gold = 0;
        _gameState.xp = 0;
        _gameState.lifetimeGold = 0; // Reset for next prestige calculation? Or keep cumulative? Usually reset for "current run" calculation.
        // Let's reset lifetimeGold so the formula works on "gold earned this run"

        // Reset Heroes (Need createHero from somewhere else if not imported)
        // For now, we manually reset heroes to basic state if we can't import createHero
        // Or we rely on main logic to handle hero reset. 
        // enhancedGameState.js actually handles hero reset in performPrestige()!
        // So this function might be redundant or needs to coordinate.

        // Let's leave minimal reset here or defer to enhancedGameState's logic
        _gameState.inventory = [];
        _gameState.currentDungeonId = 'story_node_1';
        _gameState.dungeonState = {
            running: false,
            autoRun: false,
            currentWave: 1,
            timeInWave: 0,
            isRaid: false,
            raidTarget: null
        };
        _gameState.resources.gold = 0;
        _gameState.resources.cpuCycles = 100; // Reset CPU
    },

    // Get Global Multiplier based on OS Version
    getGlobalMultiplier() {
        if (!_gameState) return 1;
        const version = parseFloat(_gameState.version) || 1.0;
        return Math.pow(2, Math.floor(version) - 1);
    },

    // ===== Hardware Upgrades =====

    getHardwareCost(type) {
        if (!_gameState) return 999999;
        const hardwareConfig = CONFIG.hardware[type];
        if (!hardwareConfig) return 999999;

        // Use prestigeState from enhancedGameState structure
        const currentLevel = (_gameState.prestigeState && _gameState.prestigeState.hardware[type]) || 0;
        if (currentLevel >= hardwareConfig.maxLevel) return 0; // Maxed

        // Cost Formula: Base * Scale ^ Level
        return Math.floor(hardwareConfig.baseCost * Math.pow(hardwareConfig.costScale, currentLevel));
    },

    buyHardware(type) {
        if (!_gameState) return { success: false, error: 'System not initialized' };

        const cost = this.getHardwareCost(type);
        const currentLevel = (_gameState.prestigeState && _gameState.prestigeState.hardware[type]) || 0;
        const hardwareConfig = CONFIG.hardware[type];

        if (!hardwareConfig) return { success: false, error: 'Invalid hardware type' };
        if (currentLevel >= hardwareConfig.maxLevel) return { success: false, error: 'Max level reached' };

        if (!_gameState.prestigeState) _gameState.prestigeState = { sigilPoints: 0, hardware: {} };

        if (_gameState.prestigeState.sigilPoints < cost) return { success: false, error: 'Not enough Sigil Points' };

        // Deduct Cost
        _gameState.prestigeState.sigilPoints -= cost;

        // Upgrade
        if (!_gameState.prestigeState.hardware) _gameState.prestigeState.hardware = {};
        _gameState.prestigeState.hardware[type] = currentLevel + 1;

        // Save should be handled by caller or auto-save loop

        return {
            success: true,
            newLevel: currentLevel + 1,
            message: `Upgraded ${hardwareConfig.name} to Level ${currentLevel + 1}`
        };
    },

    // Calculate dynamic bonuses from Hardware
    getHardwareBonus(bonusType) {
        if (!_gameState || !_gameState.prestigeState || !_gameState.prestigeState.hardware) return 0;

        let total = 0;

        // RAM: inventorySlots
        if (bonusType === 'inventorySlots') {
            total += (_gameState.prestigeState.hardware.ram || 0) * CONFIG.hardware.ram.effects.inventorySlots;
        }

        // CPU: damageMult, combatSpeed
        if (bonusType === 'heroDamage') {
            total += (_gameState.prestigeState.hardware.cpu || 0) * CONFIG.hardware.cpu.effects.damageMult;
        }
        if (bonusType === 'combatSpeed') { // additive speed mult
            total += (_gameState.prestigeState.hardware.cpu || 0) * CONFIG.hardware.cpu.effects.combatSpeed;
        }

        // GPU: goldMult, luck
        if (bonusType === 'goldMultiplier') {
            total += (_gameState.prestigeState.hardware.gpu || 0) * CONFIG.hardware.gpu.effects.goldMult;
        }

        // SSD: offlineTime
        if (bonusType === 'maxOfflineTime') {
            total += (_gameState.prestigeState.hardware.ssd || 0) * CONFIG.hardware.ssd.effects.offlineTime;
        }

        return total;
    }
};
