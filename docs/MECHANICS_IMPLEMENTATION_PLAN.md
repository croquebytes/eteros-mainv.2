# Mechanics Implementation Plan

**Tracking Document for ReincarnOS Expansion**
**Based on:** `docs/research/mechanics_research.md`

This document tracks the implementation status of the new mechanics derived from the research phase.

---

## 1. Hardware Upgrades (Meta Layer)
**Priority:** High
**Goal:** Replace/Augment the abstract "System Sigils" with tangible Hardware Upgrades that provide stats fitting the OS theme.

- [x] **Data Model Updates** (`src/state/gameState.js`)
    - [x] Add `hardware` state object (RAM, CPU, GPU, HDD).
    - [x] Ensure persistence in save/load.
- [x] **Configuration** (`src/config.js`)
    - [x] Define costs (Sigil Points) and scaling for hardware levels.
    - [x] Define stat formulas (e.g., Level 1 RAM = +5 slots).
- [x] **Integration**
    - [x] **RAM:** Hook into Inventory capacity check.
    - [x] **CPU:** Hook into Combat tick rate or Task speed.
    - [x] **GPU:** Hook into Loot generation (rarity boost).
    - [x] **HDD:** Hook into Offline time calculation.
- [x] **UI Implementation**
    - [x] Update `System Sigils` app (or rename to `System BIOS`) to show Hardware cards instead of generic sigils.
    - [x] Visuals: "Install New RAM", "Upgrade CPU".

## 2. Shell Scripts (Combat Logic)
**Priority:** High
**Goal:** Create a "Gambit" system where players program simple logic for their heroes (e.g., "If HP < 50%, Use Heal").

- [x] **Logic Engine** (`src/state/gambitSystem.js`)
    - [x] Define Conditions: HP thresholds, Status effects, Target properties.
    - [x] Define Actions: Attack, Skill 1, Defend, Use Potion.
    - [x] Create evaluator function `evaluateGambit(hero, battleState)`.
- [x] **Integration**
    - [x] Update `Hero` object to store `scripts` (array of logic objects).
    - [x] Modify `combatEngine.js` to check script before default AI.
- [x] **UI Implementation**
    - [x] New App: `Script Editor` (or integrate into Hero Details).
    - [x] Visual Logic Builder (If Condition Then Action).r for logic blocks.

## 3. Economy & Resources (Miner.exe)
**Priority:** Medium
**Goal:** Introduce a passive resource generator themed as a "Crypto Miner".

- [x] **Data Model**
    - [x] Add `bitCredits` (or similar) to Resources.
    - [x] Add `miner` state (Hash Rate, GPU levels).
- [x] **Miner System** (`src/state/minerSystem.js`)
    - [x] Logic for calculating Hash Rate based on GPUs.
    - [x] Passive generation tick.
- [x] **UI Implementation** (`src/os/apps/minerApp.js`)
    - [x] "Terminal" style text scrolling (Mining logs).
    - [x] Shop to buy GPUs (Hardware Store).
    - [x] Exchange: Sell BitCredits for Gold.und in dungeons.

## 4. OS Polish (Shell)
**Priority:** Low (Ongoing)

- [ ] **Recycle Bin**
    - [ ] Intercept item deletion.
    - [ ] "Empty Bin" action for Entropy Dust.
- [ ] **Quarantine**
    - [ ] Handle Hero death state.

---

## Implementation Log

*   **[DATE]**: Plan created. Starting Phase 1 (Hardware Upgrades).
