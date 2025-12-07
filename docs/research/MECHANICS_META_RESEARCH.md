# Mechanics & Meta Research – ReincarnOS

> **Role:** Mechanics & Meta Systems Researcher
> **Date:** 2025-12-07
> **Purpose:** Comprehensive research on idle game mechanics, OS-themed games, auto-battlers, and retention systems to inform ReincarnOS feature development

---

## Project Snapshot

**ReincarnOS** is a browser-based OS-style idle RPG that runs inside a fake desktop operating system. The game combines:
- **Auto-battler combat** in Quest Explorer (dungeons with wave-based progression)
- **Hero progression** via skill trees, equipment, synergies, and summoning
- **Multi-currency economy** (gold, XP, code fragments, memory blocks, CPU cycles, entropy dust)
- **OS-themed apps** mapping game systems to desktop metaphors (24+ apps implemented)
- **Meta progression** via prestige (System Sigils) and research tech trees
- **Mini-games & side loops** including Firewall Defense, Pet Terminal (Tamagotchi), Fake Browser, Task Scheduler

**Current State:**
- Solid foundation with comprehensive systems (heroes, dungeons, skills, research, resources)
- Many systems exist in **isolation** with limited interconnection
- Strong OS metaphor maintained throughout
- Vanilla JS + Vite, offline-capable, no runtime frameworks

**Key Constraint:** Logic must remain portable to Love2D/Lua in the future.

---

## Mechanics Research Log

### 1. Core Idle/Incremental Retention Patterns

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Exponential Prestige** | Cookie Clicker, NGU Idle, Realm Grinder | Reset progress for permanent multipliers that compound across runs | Creates "ladder climbing" power fantasy; strategic timing decision | ✅ Already exists (System Sigils); could add **layered prestige** (multiple tiers like Realm Grinder's abdicate/reincarnate/ascend) |
| **Offline Progress Notification** | Melvor Idle, AFK Arena | Show detailed summary of what happened while away | Rewards players for closing the game; guilt-free breaks | ✅ Already implemented; could enhance with **offline-only events** (special encounters that only trigger when offline) |
| **Strategic Depth Over Speed** | NGU Idle, Idle Wizard | Require resource allocation, timing, and optimization choices | Engages brain beyond mindless clicking | 🟡 Partial; skill trees exist but need deeper integration; **add optimization challenges** |
| **Layered Meta Loops** | Realm Grinder, Antimatter Dimensions | Multiple prestige currencies/systems unlock sequentially | Provides long-term goals; "always something new to discover" | 🟡 Could add: **Sigil skill trees** (prestige-specific upgrades), **Ascension currency** (above prestige) |
| **Slow Mechanic Introduction** | Most successful idle games | Unlock new systems gradually over 10-50+ hours | Prevents overwhelming new players; maintains novelty | ✅ Good foundation; could add **tutorial quest chain** to guide unlocks |

### 2. OS/Desktop Metaphor Games

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Fake Internet Browsing** | Hypnospace Outlaw, Emily is Away | Simulated web pages with lore, mini-games, ads | Enhances world-building; nostalgic immersion | ✅ Already implemented (NetSim Fake Browser); could add **ad-clicking mini-game** for gold |
| **OS Update Events** | Hypnospace Outlaw | Major updates change UI, add features, alter content | Feels like actual software evolution; recontextualizes existing content | 🔴 Missing; could add **OS Version eras** (v1.0, v2.0, etc.) that unlock new app tiers |
| **File System Exploration** | Desktop Detective, Hypnospace | Hidden files, secrets in directory structures | Rewards curiosity; puzzle-like discovery | 🟡 Could add **hidden .cfg files** in Loot Downloads with cheat codes or lore |
| **Simulated Task Manager** | Various OS sims | Show processes, CPU/RAM usage tied to game state | Grounds game mechanics in OS metaphor | ✅ Partial (System Monitor); could make **processes correspond to active systems** (dungeon running = high CPU) |
| **Desktop Customization** | Desktop Goose, Wallpaper Engine | Themes, backgrounds, icon packs, widgets | Player expression; long-term collection goal | 🟡 Themes exist; could add **unlockable icon sets**, **animated wallpapers** (rewards from dungeons) |

### 3. Auto-Battler Progression

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Faction Synergies** | Teamfight Tactics, Idle Heroes, Automon | Bonuses for fielding heroes from same faction/class | Encourages diverse roster; team-building puzzle | ✅ Already implemented (heroSynergies.js); **needs UI visibility** in Quest Explorer |
| **Formation Positioning** | AFK Arena, Idle Heroes | Hero placement affects damage/protection | Adds tactical layer to auto-combat | 🔴 Missing; could add **grid-based formation** (front/mid/back rows) |
| **Unit Fusion/Evolution** | Waitventure, Automon | Combine duplicate units to create stronger versions | Soft gacha pity; reward for duplicate pulls | 🔴 Missing; could add **hero awakening** (duplicates → star upgrades → new abilities) |
| **Persistent Team Building** | Auto Battles Online | Heroes carry over between runs with permanent upgrades | Long-term investment; not just run-specific builds | ✅ Already implemented; strengthen with **hero bonds** (pairing heroes increases bond level → unique synergies) |
| **Risk-Reward Follower Synergies** | Lootbane | Experimental builds have high variance outcomes | Encourages trying new comps; memorable moments | 🟡 Could add **gambit system** (pre-battle wagers: "No healing this run for 2x gold") |

### 4. Gacha & Summoning Retention

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Pity System** | Genshin Impact, most gacha | Guaranteed rare after X failed pulls | Removes worst-case frustration; predictable investment | 🟡 Could add to summoning; **guarantee Epic hero every 10 summons** |
| **Duplicate Conversion** | Most gacha games | Turn extra copies into currency/shards | Reduces waste; all pulls have value | 🔴 Missing; could add **soul shards** (recycle duplicate hero → shards → buy specific hero) |
| **Limited Banners** | All gacha games | Themed summon pools with rate-ups, time-limited | FOMO; collection goals; "event feel" | 🔴 Missing; could add **weekly featured hero** with 2x pull rate |
| **Free Daily Pulls** | Most F2P gacha | 1 free summon per day (or every 24h) | Daily login incentive; non-payers engage with gacha | 🔴 Missing; could add **free daily summon** (basic pool, no pity) |
| **Soft Currency Accumulation** | All gacha games | Earn summon currency through gameplay | Feels earnable; respects non-payers | ✅ Already exists (gold for summons); could add **summon tickets** from quests/milestones |

### 5. Daily/Weekly Time-Gating

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Daily Login Rewards** | Nearly all F2P games | Escalating rewards for consecutive logins | Habit formation; FOMO for missing streaks | 🔴 Missing; could add **login calendar** (7-day cycle with gold/fragments/tickets) |
| **Daily Missions** | Most idle games | 3-5 tasks refreshing every 24h (e.g., "defeat 50 enemies") | Gives short-term goals; 15-min engagement loop | 🔴 Missing; could add **daily quests** (kill X enemies, run X dungeons, earn X gold) |
| **Weekly Boss** | Idle Heroes, AFK Arena | High-difficulty boss with weekly reset, leaderboard | Social competition; long-term challenge | 🟡 Could add **Raid Console app** (weekly mega-boss, 3 attempts, leaderboard, unique rewards) |
| **Time-Limited Events** | Most mobile games | Special dungeons/shops available 2-7 days | Creates urgency; breaks routine | 🔴 Missing; could add **event dungeons** (rotating special modifiers, unique loot tables) |
| **Battle Pass / Season System** | Fortnite, mobile games | Tiered rewards for completing seasonal objectives | Long-term engagement (30-90 days); goal progression | 🔴 Missing; could add **OS Update Season Pass** (free track with cosmetics/resources) |

### 6. Resource Economy & Sinks

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Multi-Tier Currency** | Most F2P games | Soft (gold), mid (fragments), premium (dust) with conversion limits | Creates bottlenecks; monetization without P2W | ✅ Already exists (5 currencies); **needs more conversion paths** |
| **Exponential Sink Growth** | Industry Idle, most incremental | Costs grow faster than production (eventually) | Creates "pinch points"; makes prestige appealing | 🟡 Partial; could add **exponential research costs** for late-game gold sinks |
| **Resource Conversion Markets** | Industry Idle, Realm Grinder | Trade resources at varying rates (static or dynamic) | Gives value to excess resources; strategic choices | ✅ E-Buy exists; could add **dynamic rates** (prices fluctuate based on usage) |
| **Time-Gated Shops** | Most mobile games | Shops refresh daily/weekly with limited stock | Prevents infinite spending; creates scarcity | 🟡 E-Buy has daily limits; could add **weekly rare shop** (entropy dust items) |
| **Prestige Currency Sinks** | Antimatter Dimensions, NGU Idle | Spend prestige currency on permanent upgrades | Long-term progression; reason to prestige multiple times | 🟡 Could add **Sigil skill tree** (spend sigil points on permanent bonuses) |

### 7. Mini-Games & Side Content

| Mechanic | Source Game(s) | What It Does | Why It Works | ReincarnOS Fit |
|----------|---------------|--------------|--------------|----------------|
| **Active Mini-Games** | Cookie Clicker, Cell: Idle Factory | Optional skill-based games for bonus resources | Breaks idle monotony; rewards active play | ✅ Firewall Defense exists; could add **2-3 more mini-games** (Defrag Tetris, Packet Sorting) |
| **Collection Side Loops** | Most idle games | Cosmetics, achievements, lore entries to collect | Appeals to completionists; long-tail goals | 🟡 Could add **achievement system**, **lore codex** (entries unlock from dungeon milestones) |
| **Virtual Pet System** | Neopets, Tamagotchi clones | Care for pet; gain passive bonuses when happy | Emotional attachment; daily engagement ritual | ✅ Pet Terminal exists; could **integrate pet mood → idle bonuses** (happy pet = +5% gold) |
| **Puzzle/Brain Teasers** | Various | Logic puzzles, word games, matching | Engages different mental muscle; variety | 🟡 Could add **Hex Words** mini-game in Fake Browser (combine runes for lore/small rewards) |

---

## ReincarnOS-Fit Mechanics

### A. Core Loop Enhancers (High Priority)

#### 1. **Synergy Visibility & Effects**
**What:** Display active synergies in Quest Explorer with glowing borders; implement special effects (revive, cleave, triple-strike)
**How it works:** When 2+ heroes in party match synergy conditions, show badge and apply bonuses during combat
**Integration:** Already defined in `heroSynergies.js`; needs UI hooks in `questExplorer.js` and combat integration in `combatEngine.js`
**Complexity:** Low (UI updates + combat hooks)
**Impact:** Makes team composition meaningful; visible power spikes

#### 2. **Formation Positioning**
**What:** 3-row grid (front/mid/back) where position affects targeting and damage taken
**How it works:** Warriors in front take aggro; rangers in back avoid damage; formation strategy matters
**Integration:** Add `position` to hero objects; modify combat targeting in `combatEngine.js`
**Complexity:** Medium (combat engine refactor)
**Impact:** Adds tactical depth to party building

#### 3. **Skill Tree Active Integration**
**What:** Apply skill node bonuses to hero stats in real-time; implement passives (regen, lifesteal, block)
**How it works:** `updateHeroStats()` reads unlocked nodes and applies effects
**Integration:** Hook `skillTrees.js` into `heroSystem.js`
**Complexity:** Low (additive bonuses)
**Impact:** Makes skill point investment immediately rewarding

#### 4. **Dungeon Modifier Enforcement**
**What:** Challenge dungeons actually apply modifiers (no_healing, time_limit, all_bosses)
**How it works:** `dungeonRunner.js` passes modifiers to `combatEngine.js`; combat respects rules
**Integration:** Implement modifier checks in combat loops
**Complexity:** Medium (edge case handling)
**Impact:** Makes dungeons feel distinct; creates specific challenges

#### 5. **Research Effect Application**
**What:** Completed research actually grants bonuses (damage multipliers, resource generation, unlocks)
**How it works:** On research completion, apply effects to `gameState.globalBonuses`
**Integration:** Hook `researchLab.js` to state management
**Complexity:** Low (state mutation)
**Impact:** Makes research meaningful; clear progression payoff

---

### B. Meta Progression & Long-Term Goals (Medium Priority)

#### 6. **Layered Prestige System**
**What:** Multiple prestige tiers (Soft Reset → OS Update → Ascension) with different currencies
**How it works:**
- **Tier 1:** Soft Reset (costs nothing, keep heroes, reset dungeons) → Sigil Points
- **Tier 2:** OS Update (current prestige, reset more) → Sigil Fragments
- **Tier 3:** Ascension (reset everything including sigils) → Divinity Cores (unlock new game modes)
**Integration:** Extend `prestigeSystem.js` with tier logic
**Complexity:** High (multi-tier state management)
**Impact:** Deep endgame; "always one more layer"

#### 7. **Sigil Skill Tree**
**What:** Permanent upgrade tree unlocked by prestige, similar to hero skill trees but account-wide
**How it works:** Spend Sigil Points on nodes like "+5% idle gold forever", "Unlock auto-equip", "Start with 100 gold on prestige"
**Integration:** New file `sigilSkillTree.js`; UI in `systemSigils.js`
**Complexity:** Medium (new system, similar to existing skill trees)
**Impact:** Makes prestige rewarding beyond multipliers; build variety

#### 8. **Hero Awakening / Evolution**
**What:** Max-level heroes can "awaken" using duplicate souls or rare materials
**How it works:** Each awakening (up to 5 stars) grants stat boosts, new ability slot, visual upgrade
**Integration:** Add `awakeningLevel` to hero objects; UI in soul summoner
**Complexity:** Medium (gacha-style star system)
**Impact:** Adds endgame hero progression; duplicate hero value

#### 9. **Hero Bond System**
**What:** Pairing specific heroes repeatedly increases bond level → unique synergies unlock
**How it works:** Track which heroes are fielded together; at bond milestones (10, 25, 50 runs), unlock special effects
**Integration:** New `heroBonds.js` system; track party history in `gameState`
**Complexity:** Medium (relationship tracking)
**Impact:** Encourages stable team comps; emotional attachment to pairs

#### 10. **Achievement System**
**What:** 50-100 achievements for milestones, secrets, challenges (e.g., "Reach wave 100", "Win with no healers")
**How it works:** Track conditions in `eventBus`; grant cosmetic rewards, titles, minor bonuses
**Integration:** New `achievementSystem.js`; UI in Settings or new app
**Complexity:** Medium (condition tracking)
**Impact:** Completionist goals; guides player behavior

---

### C. OS-Flavored Mechanics (OS Metaphor Enhancements)

#### 11. **OS Version Eras**
**What:** Every X prestige unlocks a new OS version (ReincarnOS v1.0 → v2.0 → v3.0) with visual overhaul
**How it works:** Each version changes desktop theme, unlocks new app tier, alters UI aesthetics
**Integration:** Track `osVersion` in state; apply theme changes in `themeManager.js`
**Complexity:** High (art/CSS work)
**Impact:** Makes prestige feel like major milestones; fresh visual experience

#### 12. **Process Monitor Integration**
**What:** System Monitor shows "processes" corresponding to active game systems
**How it works:** Running dungeon = high CPU; active research = high RAM; idle = low usage
**Integration:** Update `systemMonitor.js` to read active systems from state
**Complexity:** Low (UI update)
**Impact:** Reinforces OS metaphor; information at a glance

#### 13. **File System Secrets**
**What:** Hidden files in Loot Downloads (e.g., `.config`, `README.txt`) contain cheat codes, lore, or easter eggs
**How it works:** Right-click items → "Show Hidden Files" toggle reveals special entries
**Integration:** Add hidden items to inventory; require toggle to see
**Complexity:** Low (filter mechanic)
**Impact:** Rewards exploration; easter egg hunting

#### 14. **Ad-Clicking Mini-Game**
**What:** Fake Browser shows in-world "ads" you can click for small gold rewards (daily limit)
**How it works:** Scripted ads appear on NetSim pages; clicking grants 10-50 gold (10/day limit)
**Integration:** Extend `fakeBrowser.js` with ad system
**Complexity:** Low (simple clicker)
**Impact:** Monetizes browser exploration; humor element

#### 15. **Desktop Widget System**
**What:** Unlockable widgets (mini resource tracker, pet status, quick dungeon start) placeable on desktop
**How it works:** Drag widgets onto desktop like icons; persist positions; real-time updates
**Integration:** Extend `desktop.js` with widget layer
**Complexity:** Medium (new UI layer)
**Impact:** Customization; functional QoL

---

### D. Economy & Resource Sinks (Balance & Retention)

#### 16. **Dynamic E-Buy Market**
**What:** Resource exchange rates fluctuate based on player usage trends
**How it works:** If everyone's buying fragments, fragment price increases 10-50%; resets weekly
**Integration:** Extend `eBuy.js` with dynamic pricing
**Complexity:** Medium (simulation logic)
**Impact:** Strategic timing; living economy feel

#### 17. **Weekly Rare Shop**
**What:** Special shop tab in E-Buy with 3-5 premium items (entropy dust cost) that refresh weekly
**How it works:** Unique items like epic gear, summon tickets, cosmetics; limited stock
**Integration:** Add shop layer to `eBuy.js`
**Complexity:** Low (additional shop logic)
**Impact:** Weekly ritual; chase goals

#### 18. **Crafting System**
**What:** Combine resources to create equipment or consumables
**How it works:** Recipes unlock from research; craft in Loot Downloads or new Crafting app
**Integration:** New `craftingSystem.js`; recipes in config
**Complexity:** Medium (recipe system)
**Impact:** Resource sink; player agency over gear

#### 19. **Equipment Enhancement**
**What:** Spend resources to upgrade existing equipment (+1, +2, etc.) with success rates
**How it works:** Click item → Enhance → spend fragments + gold → % chance of success (RNG)
**Integration:** Add `enhancementLevel` to items; upgrade logic in `lootDownloads.js`
**Complexity:** Medium (RNG + failure states)
**Impact:** Gold/fragment sink; gear progression beyond drops

#### 20. **Respec System (Paid)**
**What:** Reset hero skill points for gold cost
**How it works:** Button in Skill Tree app; costs 500 gold per hero; refunds all points
**Integration:** Add respec function to `skillTreeApp.js`
**Complexity:** Low (state reset)
**Impact:** Experimentation; gold sink

---

### E. Daily/Weekly Engagement Hooks (Retention)

#### 21. **Daily Login Calendar**
**What:** 7-day repeating reward track (day 1: 50 gold, day 7: 1 summon ticket)
**How it works:** Auto-shows on login; claim reward; tracks consecutive days
**Integration:** New `dailyRewards.js`; modal on boot
**Complexity:** Low (simple tracking)
**Impact:** Daily login incentive; FOMO for missing days

#### 22. **Daily Quest System**
**What:** 3 daily quests (e.g., "Defeat 50 enemies", "Complete 1 dungeon", "Earn 500 gold")
**How it works:** Refreshes every 24h; completing all 3 grants bonus reward
**Integration:** New `dailyQuests.js`; UI in Mail or new Quests app
**Complexity:** Medium (quest tracking)
**Impact:** 15-min engagement loop; predictable goals

#### 23. **Weekly Raid Boss**
**What:** Ultra-hard boss in new Raid Console app; 3 attempts per week; leaderboard
**How it works:** Boss has 1M+ HP; track damage dealt; top 10 get unique rewards
**Integration:** New `raidSystem.js` and `raidConsole.js` app
**Complexity:** High (boss mechanics + leaderboard)
**Impact:** Social competition; weekly ritual

#### 24. **Event Dungeon Rotation**
**What:** Weekly rotating special dungeon with unique modifiers and loot table
**How it works:** Each week, different event dungeon appears (e.g., "Gold Rush Week" = 3x gold)
**Integration:** Add `eventDungeons` to config; rotate on weekly timer
**Complexity:** Medium (rotation logic)
**Impact:** Breaks routine; chase specific rewards

#### 25. **Season Pass (Free Track)**
**What:** 30-day progression track with cosmetic and resource rewards
**How it works:** Complete quests/dungeons to earn season XP; unlock rewards at milestones
**Integration:** New `seasonPass.js`; UI as new app or in Soulware Store
**Complexity:** High (progression tracking)
**Impact:** Long-term engagement (monthly cycle); collection goals

---

### F. Mini-Games & Side Loops (Variety)

#### 26. **Defrag Tetris**
**What:** Tetris-like mini-game where clearing lines grants memory blocks
**How it works:** Standard Tetris rules; score converts to memory blocks (100 score = 1 block)
**Integration:** New app `defragTetris.js`; reuse Tetris logic
**Complexity:** Medium (Tetris implementation)
**Impact:** Active play option; memory block source

#### 27. **Packet Sorting Mini-Game**
**What:** Sort colored packets into matching bins within time limit
**How it works:** Packets fall from top; drag to correct bin; score grants CPU cycles
**Integration:** Extend `fakeBrowser.js` or new mini-game app
**Complexity:** Low (simple drag logic)
**Impact:** CPU cycle source; quick engagement

#### 28. **Pet Mood → Idle Bonuses**
**What:** Pet happiness level grants passive bonuses
**How it works:** High mood (>80) = +5% idle gold; high stability (>85) = +10% offline XP
**Integration:** Hook `petTerminal.js` to idle calculation in `gameState`
**Complexity:** Low (bonus application)
**Impact:** Makes pet meaningful; daily care ritual

#### 29. **Lore Codex**
**What:** Unlockable encyclopedia of heroes, enemies, dungeons with flavor text
**How it works:** Entries unlock on first encounter; read in new Codex app
**Integration:** New `codexSystem.js` and app; track unlocks in state
**Complexity:** Medium (content writing)
**Impact:** World-building; completionist goal

#### 30. **Speculation Terminal Enhancements**
**What:** Add new gamble modes (coin flip, high-low, roulette)
**How it works:** Wager gold on simple RNG games; higher risk = higher reward
**Integration:** Extend `speculationTerminal.js` with new game modes
**Complexity:** Low (RNG logic)
**Impact:** Gold sink; excitement/variance

---

## Recommendations & Priorities

### 🔥 Top Priority (Weeks 1-2) – Maximum Impact, Low Risk

1. **Synergy Visibility & Effects** (#1) – Makes existing system player-facing; 1-2 days work
2. **Skill Tree Active Integration** (#3) – Unlocks depth already designed; 1 day work
3. **Research Effect Application** (#5) – Makes research meaningful; 1 day work
4. **Daily Login Calendar** (#21) – Proven retention mechanic; 1 day work
5. **Pet Mood → Idle Bonuses** (#28) – Connects existing pet system to core loop; 1 day work

**Rationale:** These leverage existing systems to create immediate depth without adding complexity. All are 80% designed already.

---

### ⭐ Medium Priority (Weeks 3-4) – High Impact, Medium Effort

6. **Daily Quest System** (#22) – 15-min engagement loop; proven retention; 2-3 days
7. **Dungeon Modifier Enforcement** (#4) – Makes challenges distinct; 2 days
8. **Formation Positioning** (#2) – Adds tactical layer; 3-4 days
9. **Achievement System** (#10) – Completionist goals; 3-4 days
10. **Weekly Rare Shop** (#17) – Weekly engagement hook; 1-2 days

**Rationale:** Proven retention mechanics with moderate implementation cost. Significantly increase perceived depth.

---

### 🎯 Stretch Goals (Month 2+) – High Impact, High Effort

11. **Hero Awakening System** (#8) – Deep endgame hero progression; 5-7 days
12. **Layered Prestige System** (#6) – "Always one more layer" depth; 7-10 days
13. **Weekly Raid Boss** (#23) – Social competition; 5-7 days
14. **Season Pass** (#25) – Monthly engagement cycle; 7-10 days
15. **OS Version Eras** (#11) – Visual milestones; 10+ days (art heavy)

**Rationale:** Large features with significant long-term retention impact. Require more design and implementation time.

---

### 🧪 Experimental / Low Priority

- Dynamic E-Buy Market (#16) – Complex simulation; may confuse players
- Crafting System (#18) – Adds complexity; may dilute existing systems
- Defrag Tetris (#26) – Fun but not core to idle loop
- File System Secrets (#13) – Easter eggs; low retention impact

---

## Notes / Open Questions

### Integration Concerns

1. **Synergy Combat Hooks:** Confirm `combatEngine.js` can access party composition during damage calculation
2. **Skill Tree Bonuses:** Verify `updateHeroStats()` is called when unlocking nodes (or add hook)
3. **Research State:** Where are completed research projects stored? Need to persist effects
4. **Offline Calculation:** How do modifiers/bonuses apply during offline progress simulation?

### Design Clarifications Needed

1. **Formation System:** Should positioning be automatic (based on class) or manual drag-and-drop?
2. **Daily Quests:** Should they auto-complete or require manual claim? Notification system?
3. **Raid Boss:** Solo leaderboard or guild-based? (ReincarnOS doesn't seem to have guilds)
4. **Hero Awakening:** Use duplicate heroes, special items, or both for awakening material?
5. **Layered Prestige:** At what wave/progression should Tier 2 and Tier 3 unlocks happen?

### Balance Considerations

1. **Synergy Power Budget:** How much bonus is appropriate? (35-200% seems high; risk of mandatory comps)
2. **Daily Quest Rewards:** What's the right balance vs idle earnings? (Should be 10-20% of daily passive income)
3. **Raid Boss Difficulty:** How to make challenging without being impossible for F2P?
4. **Pet Bonuses:** +5% idle gold is meaningful but not mandatory; good starting point
5. **E-Buy Daily Limits:** Current limits prevent bottlenecks; maintain or expand?

### Technical Questions

1. **Leaderboard Storage:** Client-side only (localStorage) or would need backend? (Probably localStorage for offline-first)
2. **Event Rotation:** Time-based (real dates) or wave-based (every 1000 waves)?
3. **Season Pass Duration:** 30 days real-time or 30 hours playtime?
4. **Achievement Tracking:** Retroactive for past accomplishments or fresh start?

---

## Sources

### Idle/Incremental Game Mechanics
- [Best Idle Game in 2025: What to Play for Endless Progression - Clicker Heroes Blogs](https://blog.clickerheroes.com/best-idle-game-2025/)
- [The 28 Best Idle Games To Sink Your Time Into In 2025 - GameSpot](https://www.gamespot.com/gallery/best-idle-games/2900-5676/)
- [How to design idle games • Machinations.io](https://machinations.io/articles/idle-games-and-how-to-design-them)
- [The Math of Idle Games, Part I - Kongregate](https://blog.kongregate.com/the-math-of-idle-games-part-i/)
- [The Math of Idle Games, Part III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii)

### OS Simulator Games
- [Top Five Internet and/or Operating System Simulation Videogames](https://www.trentarthur.ca/news/top-five-internet-and-or-operating-system-simulation-videogames)
- [15 games with their own simulated operating systems | PC Gamer](https://www.pcgamer.com/15-games-with-their-own-simulated-operating-systems/)
- [Top games tagged operating-system - itch.io](https://itch.io/games/tag-operating-system)
- [Hypnospace Outlaw Review - Gamesline](https://gamesline.net/hypnospace-outlaw-review/)

### Auto-Battler Progression
- [What is an Auto-Battler? Complete Guide for Mobile Gamers 2025](https://bounty-bash.com/auto-battler-guide.html)
- [17 Best Auto Battler Games, Ranked](https://gamerant.com/best-autobattler-games/)
- [18 Games Like AFK Arena You Need to Play in 2025](https://www.eneba.com/hub/games/best-games-like-afk-arena/)
- [Lootbane Is an Auto-Battler RPG](https://turnbasedlovers.com/overview/lootbane-auto-battler-rpg/)

### Gacha Retention Mechanics
- [Everything you need to know about gacha mobile games | Adjust](https://www.adjust.com/blog/gacha-mechanics-for-mobile-games-explained/)
- [Gacha System: A deep dive into the Revenue Strategy | Medium](https://yougalchettri.medium.com/gacha-system-5d22470b3df4)
- [How To Design A Gacha System — Mobile Free To Play](https://mobilefreetoplay.com/design-gacha-system/)
- [Game systems: An in-depth look at gacha boxes • Machinations.io](https://machinations.io/articles/an-in-depth-look-at-gacha-boxes)

### Daily/Weekly Retention
- [Hooked on Your Game: How to Use Retention Mechanics](https://www.vgames.vc/post/hooked-on-your-game-how-to-use-retention-mechanics-to-keep-players-coming-back)
- [How to Keep Players Engaged and Coming Back to Your Idle Game — GameAnalytics](https://www.gameanalytics.com/blog/how-to-keep-players-engaged-and-coming-back-to-your-idle-game)
- [How to Use Daily Login Rewards to Drive Engagement & Retention - MAF](https://maf.ad/en/blog/daily-login-rewards-engagement-retention/)
- [Play Every Day - TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/PlayEveryDay)

### Battle Pass & Seasonal Events
- [The Evolution of Battle Pass, Event Pass, and Season Pass Systems](https://www.gamigion.com/the-evolution-of-battle-pass-event-pass-and-season-pass-systems/)
- [Drive-Up Your Revenues with Seasonal Events - GameRefinery](https://www.gamerefinery.com/drive-up-your-revenues-with-seasonal-events/)
- [Battle Pass is a hot trend in mobile games - GameRefinery](https://www.gamerefinery.com/battle-pass-trend-mobile-games/)
- [Battle pass - Wikipedia](https://en.wikipedia.org/wiki/Battle_pass)

### Resource Economy
- [The Principles of Building A Game Economy - Department of Play](https://departmentofplay.net/the-principles-of-building-a-game-economy/)
- [Passive Resource Systems in Idle Games - AC&A](https://adriancrook.com/passive-resource-systems-in-idle-games/)

### Prestige Systems
- [Incremental game - Wikipedia](https://en.wikipedia.org/wiki/Incremental_game)
- [The Math of Idle Games (GameAnalytics)](https://gameanalytics.com/blog/idle-game-mathematics/)

### Mini-Games
- [The Wide World of Incremental Games](https://www.ramblingaboutgames.com/blog/incremental-games)
- [Lessons of my first incremental game](https://www.gamedeveloper.com/design/lessons-of-my-first-incremental-game)

---

**End of Research Document**
