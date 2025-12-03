// ===== Gambit System =====
// Programmable AI for Heroes (FFXII Style)
// "I'm not a glitch, I'm a feature."

// import { gameState } from './gameState.js';

export const GAMBIT_TARGETS = {
    SELF: { id: 'self', label: 'Self' },
    ALLY: { id: 'ally', label: 'Ally' },
    ENEMY: { id: 'enemy', label: 'Enemy' },
    ALLY_ANY: { id: 'ally_any', label: 'Any Ally' },
    ENEMY_ANY: { id: 'enemy_any', label: 'Any Enemy' }
};

export const GAMBIT_CONDITIONS = {
    ALWAYS: { id: 'always', label: 'Always', type: 'none' },
    HP_LT_50: { id: 'hp_lt_50', label: 'HP < 50%', type: 'threshold', value: 0.5, stat: 'hp', op: '<' },
    HP_LT_25: { id: 'hp_lt_25', label: 'HP < 25%', type: 'threshold', value: 0.25, stat: 'hp', op: '<' },
    MP_LT_20: { id: 'mp_lt_20', label: 'MP < 20%', type: 'threshold', value: 0.2, stat: 'mp', op: '<' },
    STATUS_DEAD: { id: 'status_dead', label: 'Status: KO', type: 'status', value: 'dead' },
    IS_BOSS: { id: 'is_boss', label: 'Is Boss', type: 'boolean', prop: 'isBoss' },
    ALLY_KO: { id: 'ally_ko', label: 'Ally: KO', type: 'status', value: 'dead' } // Specific target check
};

export const GAMBIT_ACTIONS = {
    ATTACK: { id: 'attack', label: 'Attack' },
    USE_SKILL_1: { id: 'skill_1', label: 'Use Skill 1' }, // We'll resolve actual skill ID at runtime
    USE_SKILL_2: { id: 'skill_2', label: 'Use Skill 2' },
    USE_SKILL_3: { id: 'skill_3', label: 'Use Skill 3' },
    USE_POTION: { id: 'item_potion', label: 'Use Potion' }
};

export const gambitSystem = {
    // Evaluate a hero's gambits and return the first valid action
    evaluate(hero, battleState) {
        if (!hero.gambits || hero.gambits.length === 0) return null;

        for (const gambit of hero.gambits) {
            if (!gambit.active) continue;

            const target = this.findTarget(hero, gambit.target, gambit.condition, battleState);

            if (target) {
                // Check if action is possible (cooldowns, resources)
                if (this.canPerformAction(hero, gambit.action, target)) {
                    return {
                        action: gambit.action,
                        target: target
                    };
                }
            }
        }

        return null; // No valid gambit found, fallback to default AI
    },

    findTarget(hero, targetType, conditionId, battleState) {
        const condition = Object.values(GAMBIT_CONDITIONS).find(c => c.id === conditionId);
        if (!condition) return null;

        let potentialTargets = [];

        // 1. Filter candidates based on Target Type
        switch (targetType) {
            case 'self':
                potentialTargets = [hero];
                break;
            case 'ally':
            case 'ally_any':
                potentialTargets = battleState.heroes.filter(h => h.id !== hero.id && h.currentHp > 0);
                // Include dead allies if looking for KO status
                if (condition.id === 'status_dead' || condition.id === 'ally_ko') {
                    potentialTargets = battleState.heroes.filter(h => h.id !== hero.id);
                }
                break;
            case 'enemy':
            case 'enemy_any':
                potentialTargets = battleState.enemies.filter(e => e.currentHp > 0);
                break;
        }

        // 2. Filter candidates based on Condition
        const validTargets = potentialTargets.filter(target => this.checkCondition(target, condition));

        // 3. Return best target (usually first valid one for now)
        return validTargets.length > 0 ? validTargets[0] : null;
    },

    checkCondition(target, condition) {
        switch (condition.type) {
            case 'none':
                return true;
            case 'threshold':
                if (condition.stat === 'hp') {
                    const pct = target.currentHp / target.maxHp;
                    if (condition.op === '<') return pct < condition.value;
                    if (condition.op === '>') return pct > condition.value;
                }
                return false;
            case 'status':
                if (condition.value === 'dead') return target.currentHp <= 0;
                // Future: check for poison, stun, etc.
                return false;
            case 'boolean':
                return !!target[condition.prop];
            default:
                return false;
        }
    },

    canPerformAction(hero, actionId, target) {
        // Basic check - real checks happen in combat engine
        if (actionId === 'attack') return true;

        // Check skill cooldowns
        if (actionId.startsWith('skill_')) {
            const skillIndex = parseInt(actionId.split('_')[1]) - 1;
            const skill = hero.skills[skillIndex];
            if (!skill) return false;
            // We'd need access to cooldown state here, assuming hero object has it
            return skill.cooldownRemaining <= 0;
        }

        return true;
    },

    // Helper to initialize a hero with default gambits
    initHeroGambits(hero) {
        if (!hero.gambits) {
            hero.gambits = [
                { id: 1, active: true, target: 'enemy_any', condition: 'always', action: 'attack' },
                { id: 2, active: false, target: 'self', condition: 'hp_lt_50', action: 'item_potion' }
            ];
        }
    }
};
