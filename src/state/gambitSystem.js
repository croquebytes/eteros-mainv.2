// ===== Gambit System (Shell Scripts) =====
// Logic engine for Hero AI scripting

export const CONDITIONS = {
    ALWAYS: {
        id: 'always',
        name: 'Always',
        evaluate: () => true
    },
    HP_LESS_THAN: {
        id: 'hp_less_than',
        name: 'Self HP < X%',
        paramType: 'percentage',
        evaluate: (source, target, param) => (source.currentHp / source.currentStats.hp) < (param / 100)
    },
    TARGET_HP_LESS_THAN: {
        id: 'target_hp_less_than',
        name: 'Target HP < X%',
        paramType: 'percentage',
        evaluate: (source, target, param) => target && (target.currentHp / target.maxHp) < (param / 100)
    },
    TARGET_IS_BOSS: {
        id: 'target_is_boss',
        name: 'Target is Boss',
        evaluate: (source, target) => target && target.isBoss
    }
};

export const ACTIONS = {
    ATTACK: { id: 'attack', name: 'Basic Attack' },
    ITEM_POTION: { id: 'item_potion', name: 'Drink Potion (Heal 50%)' },
    CAST_SKILL_1: { id: 'cast_skill_1', name: 'Cast Skill 1' }
};

export const gambitSystem = {
    evaluate(hero, battleState) {
        if (!hero.script || hero.script.length === 0) return null;

        for (const line of hero.script) {
            if (!line.active) continue;

            // Find appropriate target based on action logic or default to random enemy
            let potentialTarget = null;
            if (line.actionId === 'item_potion') {
                potentialTarget = hero;
            } else {
                // Default target is random alive enemy
                const aliveEnemies = battleState && battleState.enemies ? battleState.enemies.filter(e => e.currentHp > 0) : [];
                if (aliveEnemies.length > 0) {
                    potentialTarget = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                }
            }

            const condition = CONDITIONS[line.conditionId];
            if (condition && condition.evaluate(hero, potentialTarget, line.parameter)) {

                let finalTarget = potentialTarget;

                // Re-select target for attack if potentialTarget was just for condition checking
                // Actually, simplistic view: If condition met on potentialTarget, use that target.

                return {
                    action: line.actionId,
                    target: finalTarget
                };
            }
        }

        return null;
    }
};

export function createDefaultScript(role) {
    const script = [];

    if (role === 'healer') {
        script.push({ active: true, conditionId: 'HP_LESS_THAN', parameter: 50, actionId: 'item_potion' });
    }

    script.push({ active: true, conditionId: 'ALWAYS', active: true, parameter: null, actionId: 'attack' });
    return script;
}
