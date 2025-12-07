# Mechanics & Meta Research – ReincarnOS

**Role:** Mechanics & Meta Systems Researcher  
**Date:** 2025-12-07  
**Version:** 1.0

---

## Project Snapshot

ReincarnOS is a **browser-based idle RPG** running inside a simulated desktop OS.  
**Core Metaphor:** You are the User; the "game" is just software running on your virtual machine.  
**Tech Stack:** Vanilla JS + Vite (Framework-free runtime).

**Current State:**
- **loop:** Heroes auto-battle in `Quest Explorer`. Rewards (Gold, XP) feed upgrades.
- **Heroes:** Standard RPG classes (Warrior, Mage, etc.) with `Skill Tree` apps.
- **Progression:** `Soulware Store` (multipliers), `System Sigils` (Prestige).
- **Resources:** Gold, Code Fragments, Memory Blocks, CPU Cycles.
- **Key Apps:** Quest Explorer, Loot Downloads, Recycle Shrine, Task Scheduler, E-Buy.

**Design Goal:** Deepen engagement through "OS-native" mechanics and stickier idle loops without breaking the offline-first, vanilla JS architecture.

---

## Mechanics Research Log

**Research Scope:** Analyzed mechanics from top-tier idle/incremental games (*NGU Idle*, *Melvor Idle*, *Trimps*) and OS-sim games (*Progressbar95*, *Hypnospace Outlaw*, *Kingsway*).

| Theme | Mechanic | Source | Why it works | ReincarnOS Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Combat** | **Gambit / AI Scripting** | *Final Fantasy XII*, *Soda Dungeon 2* | Automates complexity. Players feel smart "programming" their wins. | **"Shell Scripts":** Simple `IF HP < 50% THEN Heal` logic for heroes. Fits the OS theme perfectly. |
| **Meta** | **Hardware as Stats** | *Progressbar95*, *Computer Tycoon* | Tangible progression. "Buying RAM" feels more impactful than "Upgrade 12". | **"Hardware Upgrade":** Prestige currency buys "Physical" upgrades (RAM = Inventory, CPU = Game Speed). |
| **OS Sim** | **Defrag / Optimize** | *Progressbar95* | Satisfying visual cleanup. Turns inventory management into a mini-game. | **"Disk Defragger":** A mini-game to optimize stored resources or merge inventory items for bonuses. |
| **Defense** | **Popup / Virus Defense** | *Hypnospace Outlaw* | frantic active engagement vs passive idle. | **"Firewall Defense":** Active mini-game where you click/destroy incoming "packets" (enemies) attacking the system. |
| **Idle** | **Background Service** | *Melvor Idle* | Allows progress in multiple skills simultaneously but at a cost. | **"Background Process":** Run a dungeon in "background mode" at 50% efficiency while doing active management elsewhere. |
| **Econ** | **Stock Market / Crypto** | *Cookie Clicker*, *GTAV* | Speculation adds risk/reward and daily checking. | **"Crypto Miner":** Uses `CPU Cycles` (resource) to mine `Fragments` or volatile currency. |
| **Gacha** | **Shard/Fragment System** | *Generic Gacha* | Deterministic bad luck protection. | **"Code Snipets":** Duplicate hero summons give snippets to upgrade existing heroes' "Version" (v1.0 -> v1.1). |

---

## ReincarnOS-Fit Mechanics

Synthesized proposals to deepen the game while adhering to the technical constraints.

### 1. Core Loop Enhancers

#### **A. Shell Scripts (Hero AI)**
*   **Concept:** Instead of random skill usage, heroes execute a simple priority list.
*   **Mechanic:** Players drag-and-drop logic blocks in a "Code Editor" window for each hero.
    *   `[CONDITION: Enemy Boss] -> [ACTION: Cast Ultimate]`
    *   `[CONDITION: HP < 30%] -> [ACTION: Drink Potion]`
*   **Integration:** Adds depth to generic auto-battles. Unlocked via "Developer Mode" research.
*   **Complexity:** Medium (Needs a logic evaluator in the combat loop).

#### **B. Overclocking (Risk/Reward)**
*   **Concept:** Push the system harder for faster progress but risk "Overheating".
*   **Mechanic:** Toggle switch in settings/tray.
    *   **ON:** Game speed 2x (attacks, movement, mining).
    *   **COST:** Generates "Heat". If Heat > 100%, System crashes (blue screen for 10s, progress paused) or hardware takes damage.
    *   **Sink:** Spend "Coolant" (Water/Ice resources) to maintain high overclocks.
*   **Complexity:** Low (Global time multiplier variable modified by heat logic).

### 2. Meta Progression (The "Hardware" Layer)

#### **A. Hardware Upgrades (Prestige)**
*   **Concept:** Replace abstract prestige upgrades with "Physical" hardware changes.
*   **Mechanic:**
    *   **CPU Upgrade:** Increases global Tick Speed (Simulate faster).
    *   **RAM Upgrade:** Increases Max Inventory, Max Active Tasks, Max Hero Party Size.
    *   **HDD Upgrade:** Increases Offline time bank (e.g., 24h -> 48h).
    *   **GPU Upgrade:** Increases "Resolution" (Drop rates/Quality).
*   **Integration:** Replaces or augments `System Sigils`.
*   **Complexity:** Medium (State adjustments).

#### **B. OS Versions (Eras)**
*   **Concept:** Major resets (Tier 2 Prestige) install a "New OS" (e.g., *Win 95* -> *XP*).
*   **Mechanic:** Resets *everything* (even Hardware) but unlocks entirely new mechanics/apps.
    *   *v1.0 (DOS-like):* CLI only.
    *   *v2.0 (Win95-like):* Windows, Multitasking.
    *   *v3.0 (Modern):* Cloud saves, Networking raids.
*   **Complexity:** High (Future roadmap).

### 3. OS-Flavored Mechanics

#### **A. "Quarantine" (Graveyard/Hospital)**
*   **Concept:** When heroes die, they aren't deleted; they are moved to "Quarantine" folder.
*   **Mechanic:** They heal slowly over time, or you can run an "Antivirus Scan" (mini-game/resource cost) to recover them instantly.
*   **Integration:** Adds consequence to death without permadeath frustration.

#### **B. "Recycle Bin" (Hoarding)**
*   **Concept:** Deleted items aren't gone instantly.
*   **Mechanic:** They sit in the Recycle Bin. You can "Restore" them (if you made a mistake) or "Empty Bin" to permanently delete and gain 10% of their resource value (Entropy Dust).
*   **Complexity:** Low (Temporary array inventory).

### 4. Economy & Sinks

#### **A. "Miner.exe" (Resource Sink)**
*   **Concept:** An idle app that consumes `CPU Cycles` and raises `Heat` to generate `CryptoCoins`.
*   **Mechanic:** `CryptoCoins` can be exchanged on the "Dark Web" (Rare Shop) for items not found in dungeons.
*   **Dynamic:** The exchange rate fluctuates daily (RNG seed based on date).

---

## Recommendations & Priorities

Based on "High Impact vs. Low Engine Cost":

| Priority | ID | Feature | Rationale |
| :--- | :--- | :--- | :--- |
| **TOP PRIORITY** | **1** | **Hardware Upgrades** | Best generic prestige "hook". Easy to visualize. Fits "Number Go Up" perfectly by just changing variable caps/rates. |
| **TOP PRIORITY** | **2** | **Shell Scripts (Basic)** | Transforms passive combat into strategic planning. Even a simple "Use Heal at X%" default adds massive depth. |
| **MEDIUM** | **3** | **Miners & Heat** | Good resource sink for the new expanded resources (`CPU Cycles`). Adds a management layer. |
| **MEDIUM** | **4** | **Recycle Bin** | Simple UX win. "Deleting" feels bad; "Recycling" feels smart. Easy implementation. |
| **EXPERIMENTAL** | **5** | **Firewall Mini-game** | High dev cost for a different genre (Tower Defense). Keep as a future "App" expansion. |

---

## Notes / Open Questions

1.  **"Shell Script" UI:** Does the current window manager support drag-and-drop *within* a window robustly? (Likely yes, but needs testing).
2.  **Hardware vs. Sigils:** Should "Hardware" replace "System Sigils" entirely, or be a separate layer? *Recommendation: Rename Sigils to "BIOS Settings" and make Hardware a new layer.*
3.  **Offline Calculation:** "Overclocking" logic is hard to simulate offline safely. We might disable Heat mechanics during offline calculation for simplicity (assume standard clock speed).
