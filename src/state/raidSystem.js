// ===== Raid System =====
// Asynchronous Multiplayer Simulation
// "Hack the planet!"

import { gameState } from './gameState.js';
import { CONFIG } from './config.js';

export const RAID_DIFFICULTIES = {
    EASY: { id: 'easy', label: 'Script Kiddie', multiplier: 0.8, lootMult: 0.8 },
    MEDIUM: { id: 'medium', label: 'SysAdmin', multiplier: 1.0, lootMult: 1.0 },
    HARD: { id: 'hard', label: 'NetRunner', multiplier: 1.5, lootMult: 1.5 },
    INSANE: { id: 'insane', label: 'AI Core', multiplier: 2.5, lootMult: 3.0 }
};

export const raidSystem = {
    availableTargets: [],
    lastRefreshTime: 0,
    refreshCooldown: 60000, // 1 minute

    // Generate a list of potential raid targets
    generateTargets() {
        const playerPower = this.calculatePlayerPower();
        const targets = [];

        // Generate 3-5 targets
        const count = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            const difficultyKeys = Object.keys(RAID_DIFFICULTIES);
            const difficultyKey = difficultyKeys[Math.floor(Math.random() * difficultyKeys.length)];
            const difficulty = RAID_DIFFICULTIES[difficultyKey];

            targets.push(this.createRival(playerPower, difficulty));
        }

        this.availableTargets = targets;
        this.lastRefreshTime = Date.now();
        return targets;
    },

    createRival(playerPower, difficulty) {
        const names = ['ZeroCool', 'AcidBurn', 'CerealKiller', 'Neo', 'Trinity', 'Morpheus', 'CrashOverride', 'LordNikon'];
        const name = names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 1000);

        const targetPower = Math.floor(playerPower * difficulty.multiplier * (0.9 + Math.random() * 0.2));

        return {
            id: `rival_${Date.now()}_${Math.random()}`,
            name: name,
            difficulty: difficulty,
            power: targetPower,
            rewards: {
                gold: Math.floor(targetPower * 5 * difficulty.lootMult),
                xp: Math.floor(targetPower * 2 * difficulty.lootMult),
                // Chance for system resources
                codeFragments: Math.random() < 0.5 ? Math.floor(10 * difficulty.lootMult) : 0
            },
            // Simulated party for display
            party: [
                { class: 'warrior', level: Math.floor(targetPower / 10) },
                { class: 'mage', level: Math.floor(targetPower / 10) },
                { class: 'ranger', level: Math.floor(targetPower / 10) }
            ]
        };
    },

    calculatePlayerPower() {
        // Simple power calculation: Sum of all heroes' stats
        const totalStats = gameState.heroes.reduce((acc, hero) => {
            const attack = hero.currentStats?.attack || hero.attack || 0;
            const defense = hero.currentStats?.defense || hero.defense || 0;
            const hp = hero.currentStats?.hp || hero.maxHp || 0;
            return acc + attack + defense + (hp / 10);
        }, 0);
        return totalStats || 100;
    },

    getTargets() {
        if (Date.now() - this.lastRefreshTime > this.refreshCooldown || this.availableTargets.length === 0) {
            this.generateTargets();
        }
        return this.availableTargets;
    },

    refreshTargets() {
        return this.generateTargets();
    }
};

window.raidSystem = raidSystem;
