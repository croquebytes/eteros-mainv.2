// ===== Miner System (Crypto Mining) =====
// Passive resource generation engine

import { gameState, saveGame } from './enhancedGameState.js';
import { prestigeSystem } from './prestigeSystem.js';

export const MINER_GPUS = [
    { id: 'integrated', name: 'Integrated Graphics', cost: 500, hashRate: 2, icon: '🥔' },
    { id: 'gtx_1080', name: 'TrashForce 1080', cost: 2000, hashRate: 10, icon: '📟' },
    { id: 'rtx_3090', name: 'RayTracer 9000', cost: 10000, hashRate: 50, icon: '📼' },
    { id: 'mining_rig', name: 'Basic Mining Rig', cost: 50000, hashRate: 200, icon: '🖥️' },
    { id: 'quantum_chip', name: 'Q-Chip Mk1', cost: 250000, hashRate: 1000, icon: '⚛️' }
];

export const minerSystem = {
    init() {
        this.calculateHashRate();
    },

    tick(deltaTime = 1) {
        if (!gameState.minerState.unlocked && gameState.gold < 500) return; // Unlock condition?

        // Generate BitCredits
        const rate = this.calculateHashRate();
        if (rate > 0) {
            const mined = rate * deltaTime * 0.1; // 0.1 coins per hash/sec baseline

            // Apply Prestige Bonus?
            // Let's say GPU hardware level from system BIOS also boosts mining efficiency!
            const biosBonus = prestigeSystem.getHardwareBonus ? prestigeSystem.getHardwareBonus('goldMultiplier') : 0; // reusing gold mult or separate?
            // Actually let's just stick to base rate for now, simple economy.
            // Re-use GPU bonus for hash rate?

            const gpuBonus = 1 + (biosBonus || 0);
            const finalMined = mined * gpuBonus;

            gameState.resources.bitCredits = (gameState.resources.bitCredits || 0) + finalMined;
            gameState.minerState.totalMined += finalMined;
        }
    },

    calculateHashRate() {
        let total = 0;
        if (gameState.minerState.gpus) {
            gameState.minerState.gpus.forEach(gpu => {
                total += gpu.hashRate;
            });
        }

        // Base rate from system BIOS GPU level?
        // Maybe BIOS GPU level * 10 is base hash rate?
        const biosGpuLevel = gameState.prestigeState?.hardware?.gpu || 0;
        total += biosGpuLevel * 5;

        gameState.minerState.hashRate = total;
        return total;
    },

    installGpu(gpuId) {
        const template = MINER_GPUS.find(g => g.id === gpuId);
        if (!template) return { success: false, error: 'Invalid GPU' };

        if (gameState.gold < template.cost) {
            return { success: false, error: 'Not enough gold' };
        }

        gameState.gold -= template.cost;

        if (!gameState.minerState.gpus) gameState.minerState.gpus = [];
        gameState.minerState.gpus.push({ ...template, installedAt: Date.now() });

        gameState.minerState.unlocked = true;
        this.calculateHashRate();
        saveGame();

        return { success: true, message: `Installed ${template.name}` };
    },

    sellCrypto(amount) {
        if (gameState.resources.bitCredits < amount) {
            return { success: false, error: 'Not enough BitCredits' };
        }

        // Exchange Rate Logic
        // Base rate: 10 Gold per Credit
        // Market Fluctuation could be added here
        const exchangeRate = 10;

        const goldValue = Math.floor(amount * exchangeRate);

        gameState.resources.bitCredits -= amount;
        gameState.gold += goldValue;
        gameState.lifetimeGold += goldValue;

        return { success: true, goldEarned: goldValue };
    }
};
