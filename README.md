
# 2026-group-11

## Sunnyvale Gate

Love the art style of Stardew Valley and enjoy playing Kingdom Rush? Then this game is tailor-made for you — through spring, summer, autumn, and winter, protect your village in every season!

<img width="823" height="392" alt="title" src="https://github.com/user-attachments/assets/2e51c86c-477f-465f-b64c-6416c9d0a930" />

[Click here to play the game](https://uob-comsm0166.github.io/2026-group-11/)

## Demo Video
[Click here to watch the demo video](https://drive.google.com/file/d/1NNac17kYhQpIFFcfJK7L5xvaH5aljUwt/view?usp=drive_link)

# Table of Contents

1. [Team](#team)

2. [Introduction](#introduction)
   - [Defensive Towers](#defensive-towers)
   - [Enemies](#enemies)

3. [Requirements](#requirements)
   - [2.1 Early stages design](#21-early-stages-design)
   - [2.2 Requirement elicitation and refinement](#22-requirement-elicitation-and-refinement)
   - [2.3 Stakeholders](#23-stakeholders)
   - [2.4 Epics, User Stories and Acceptance Criteria](#24-epics-user-stories-and-acceptance-criteria)
   - [2.5 Use Case Diagram](#25-use-case-diagram)
   - [2.6 Reflection](#26-reflection)

4. [Design](#design)
   - [3.1 System Architecture](#31-system-architecture)
   - [3.2 Class Diagram](#32-class-diagram)
   - [3.3 Behavioural Diagram](#33-behavioural-diagram)
   - [3.4 Design Reflection](#34-design-reflection)

5. [Implementation](#implementation)
   - [Challenge 1: Different defence towers](#challenge-1-different-defence-towers)
     - [Ice Tower targeting](#ice-tower-targeting)
     - [Cannon Tower splash targeting](#cannon-tower-splash-targeting)
   - [Challenge 2: Boss design](#challenge-2-boss-design)
     - [Boss split and revive](#boss-split-and-revive)
     - [Boss targeting the most valuable tower](#boss-targeting-the-most-valuable-tower)
   - [Challenge 3: Data-driven balancing and wave configuration](#challenge-3-data-driven-balancing-and-wave-configuration)

6. [Evaluation](#evaluation)
   - [Qualitative evaluation](#qualitative-evaluation)
     - [Think Aloud Evaluation](#think-aloud-evaluation)
   - [Heuristic Evaluation](#heuristic-evaluation)
   - [Quantitative Evaluation](#quantitative-evaluation)
     - [NASA TLX](#nasa-tlx)
     - [SUS](#sus)
   - [How code was tested](#how-code-was-tested)
     - [White box](#white-box)
     - [Black box](#black-box)

7. [Process](#process)
   - [Collaboration](#collaboration)
   - [Tools](#tools)

8. [Sustainability, Ethics and Accessibility](#sustainability-ethics-and-accessibility)
   - [Environmental](#environmental)
   - [Social](#social)
   - [Individual](#individual)

9. [Report and Code Quality](#report-and-code-quality)

10. [Conclusion](#conclusion)

11. [Contribution Statement](#contribution-statement)

12. [AI Statement](#ai-statement)

# Team

![image](https://github.com/user-attachments/assets/cf4abf93-01fc-4738-b1ac-b76788c01ac6)

| # | Name | Email | Role |
|:-:|------|-------|------|
| 1 | Yi Lin | adai08823@gmail.com | Developer & Game Designer |
| 2 | Chuhang Li | zgndylch@163.com | Developer & Game Designer |
| 3 | Yuxuan Cheng | chengyx0921@outlook.com | Developer & Graphic Artist |
| 4 | Wen Liang | fd21102@bristol.ac.uk | Report & Process Coordinator |
| 5 | Zishen Xu | eh25470@bristol.ac.uk | Coder & Report |

# Introduction

**Sunnyvale Gate** is a browser-based tower defence game developed with p5.js. The concept was inspired by two games that several members of our group enjoyed: *Stardew Valley* and *Kingdom Rush*. We wanted to draw on the warm seasonal style of *Stardew Valley*, while combining it with the clearer goals and strategic gameplay of a tower defence game.

In the game, the player protects a village from waves of slime enemies across four seasonal maps: spring, summer, autumn and winter. The player earns gold by defeating enemies, then uses it to build or upgrade towers. Different enemies have different health, speed and resistance values, so the player needs to decide which towers to build and when to upgrade them.

Our main twist is that the game uses a cosy farming-game atmosphere while adding more specialised tower behaviours. For example, the Frost Tower slows enemies that have not already been slowed, while the Cannon Tower attacks areas where enemies are most concentrated. The final level also includes a boss with special behaviours, including splitting, reviving and attacking the player’s most valuable tower. These features became the main technical challenges during implementation.

## Defensive Towers

| Tower Type | Image | Description |
|------------|-------|-------------|
| <div align="center"><strong>Archery Tower</strong><br>Level 1</div> | <img width="457" height="657" alt="tower2" src="https://github.com/user-attachments/assets/af7b8802-013b-4be1-9a71-cbdbf7a21c98" /> | This is the cheapest offensive tower, costing **70 gold**. It deals **10 physical damage** every **30 frames** within a **400 range**, so it is useful for setting up the first line of defence without spending too many resources. |
| <div align="center"><strong>Archery Tower</strong><br>Level 2</div> | <img width="424" height="433" alt="tower2_lv2" src="https://github.com/user-attachments/assets/64488e59-daf5-40e7-a7b4-65a21d1a7706" /> | The first upgrade costs **110 gold** and makes the tower noticeably faster. Its range increases to **500**, its damage rises to **15**, and it attacks every **20 frames**, which helps it deal with stronger enemies in the early and middle stages. |
| <div align="center"><strong>Archery Tower</strong><br>Level 3</div> | <img width="424" height="433" alt="tower2_lv3" src="https://github.com/user-attachments/assets/3d6633f6-868a-432c-a6c1-6ab3a27cf6ce" /> | At Level 3, the Archery Tower becomes a fast single-target damage source. It reaches **600 range**, attacks every **10 frames**, and deals **20 physical damage**, making it useful when the player needs steady damage against enemies with low physical resistance. |
| <div align="center"><strong>Magic Tower</strong><br>Level 1</div> | <img width="414" height="427" alt="tower1" src="https://github.com/user-attachments/assets/8abc3787-0faa-4eed-9885-ba528511cecd" /> | The Magic Tower costs **100 gold** and starts with **25 magic damage**, a **400 range**, and a **45-frame** attack interval. It gives the player an early option against enemies that are harder to defeat with physical attacks. |
| <div align="center"><strong>Magic Tower</strong><br>Level 2</div> | <img width="424" height="433" alt="tower1_lv2" src="https://github.com/user-attachments/assets/186a34c6-0836-46db-bd9e-13a3115ab420" /> | After spending **160 gold** on the upgrade, the tower improves to **40 magic damage**, **450 range**, and a **40-frame** attack interval. This makes it a more dependable counter to enemies with strong physical defence. |
| <div align="center"><strong>Magic Tower</strong><br>Level 3</div> | <img width="424" height="433" alt="tower1_lv3" src="https://github.com/user-attachments/assets/f8a1befc-ccd3-4f31-bc4d-634bc669dcc7" /> | The final upgrade costs **240 gold** and raises the tower to **60 magic damage** with **500 range**. Although it attacks more slowly than the Archery Tower, its higher magic damage makes it valuable against armoured enemies. |
| <div align="center"><strong>Cannon Tower</strong><br>Level 1</div> | <img width="457" height="657" alt="tower3" src="https://github.com/user-attachments/assets/2e983e7e-37fd-4259-89b4-f363c50ea82b" /> | The Cannon Tower is the most expensive basic tower, costing **125 gold**, but it can damage groups from the start. It deals **35 damage** every **65 frames** and uses a **100 splash radius**, which makes it useful when enemies move close together. |
| <div align="center"><strong>Cannon Tower</strong><br>Level 2</div> | <img width="424" height="433" alt="tower3_lv2" src="https://github.com/user-attachments/assets/3aba1165-7714-46e1-835f-98dd3ed498c1" /> | This upgrade costs **220 gold** and improves both damage and coverage. The tower deals **55 area damage**, reaches **440 range**, and expands its splash radius to **125**, giving the player a stronger answer to larger ground waves. |
| <div align="center"><strong>Cannon Tower</strong><br>Level 3</div> | <img width="424" height="433" alt="tower3_lv3" src="https://github.com/user-attachments/assets/91f1fef5-ac80-4c26-b505-00a5a1b5807b" /> | Once fully upgraded, the Cannon Tower deals **80 area damage** with a **150 splash radius** and **480 range**. It is especially useful on narrow parts of the map, where several enemies can be hit by one attack. |
| <div align="center"><strong>Ice Tower</strong><br>Level 1</div> | <img width="424" height="433" alt="tower4" src="https://github.com/user-attachments/assets/46b11b34-2670-4f40-bcfe-4bf9d5af13f3" /> | The Ice Tower costs **70 gold** and is mainly a support tower rather than a damage tower. It only deals **5 magic damage**, but it slows enemies to **50% speed** for **70 frames**, giving nearby damage towers more time to attack. |
| <div align="center"><strong>Ice Tower</strong><br>Level 2</div> | <img width="424" height="433" alt="tower4_lv2" src="https://github.com/user-attachments/assets/6885c8f2-7272-435b-aec9-5467cc970043" /> | For **110 gold**, this upgrade extends the tower’s range to **500** and strengthens the slow effect. Enemies are reduced to **40% speed** for **90 frames**, which makes this level useful when faster enemies start to appear. |
| <div align="center"><strong>Ice Tower</strong><br>Level 3</div> | <img width="424" height="433" alt="tower4_lv3" src="https://github.com/user-attachments/assets/b867bacc-1abd-4cdb-912a-d5a9857e8678" /> | At Level 3, the Ice Tower becomes the strongest control tower in the game. It reaches **600 range**, attacks every **25 frames**, and slows enemies to **30% speed** for **120 frames**, helping the defence stay stable during difficult waves. |

## Enemies

| Monster Type | Image | Description |
|--------------|-------|-------------|
| Baby Slime | <img width="32" height="24" alt="Black_Slime" src="https://github.com/user-attachments/assets/f9e1a700-4710-4b88-8d80-211f838544bd" /> | A small split enemy with only **35 HP** but **speed 4.0**, so it is weak on its own but can still be dangerous when several appear together. |
| Black Slime | <img width="32" height="24" alt="Black_Slime" src="https://github.com/user-attachments/assets/1bd14b8e-343c-4554-b986-cc60f70183c4" /> | With **180 HP** and **armour 0.75**, the Black Slime is harder to remove with basic physical damage than the early slime enemies. |
| Crime Slime | <img width="44" height="32" alt="Crimslime" src="https://github.com/user-attachments/assets/1dd89f73-0600-4d48-ba8c-a9147079e18c" /> | This is one of the tougher slime enemies, with **1000 HP** and a **50 gold reward**. It is used as a high-value target in later waves. |
| Dungeon Slime | <img width="44" height="32" alt="Dungeon_Slime" src="https://github.com/user-attachments/assets/8bb5ad5f-ea33-45db-a061-33c428e20378" /> | The Dungeon Slime has **600 HP** and gives **40 gold** when defeated, so it takes longer to kill but also rewards the player well. |
| Green Slime | <img width="32" height="24" alt="Green_Slime" src="https://github.com/user-attachments/assets/b9dbf4ba-d75f-44f8-aeb3-54cbe9f8caf4" /> | The Green Slime is the basic enemy type, with **40 HP**, **speed 2.0**, and a small **4 gold reward**. It introduces the main combat loop. |
| Mother Slime | <img width="44" height="32" alt="Mother_Slime" src="https://github.com/user-attachments/assets/aac1be4c-a83a-4fdb-bbd2-7494381efdb8" /> | The Mother Slime has **220 HP** and can **split into four Baby Slimes** after death, which means the threat continues even after the main body is defeated. |
| Purple Slime | <img width="32" height="24" alt="Purple_Slime" src="https://github.com/user-attachments/assets/d378d3f6-1b81-4b06-ab81-ac54e0794fe8" /> | With **70 HP** and **speed 4.0**, the Purple Slime is not very durable, but it can move through weak defences quickly. |
| Red Slime | <img width="32" height="24" alt="Red_Slime" src="https://github.com/user-attachments/assets/f0e06310-aa88-40fa-bf28-eb6853456692" /> | The Red Slime has **50 HP** and **speed 3.0**, making it a simple but faster enemy that tests early tower placement. |
| Glow Slime | <img width="36" height="30" alt="glow_Slime" src="https://github.com/user-attachments/assets/9c1e40b3-d428-420a-9481-bb0a31eacc1c" /> | The Glow Slime has **400 HP** and **magicResist 0.5**, so magic attacks are less effective against it than physical or cannon damage. |
| Gold Slime | <img width="34" height="24" alt="gold_Slime" src="https://github.com/user-attachments/assets/91bce274-a99f-4b0b-b5dd-7651de96d849" /> | The Gold Slime has **260 HP** and gives **12 gold** when defeated, making it useful for giving the player more upgrade resources. |
| Ice Spike Slime | <img width="40" height="30" alt="Spiked_Ice_Slime" src="https://github.com/user-attachments/assets/c911a855-47e7-421f-afac-18237fcf0617" /> | Because it has **400 HP** and **armour 0.25**, physical attacks are much weaker against it. Magic towers are usually the better choice. |
| Crystal Slime | <img width="38" height="30" alt="Crystal_Slime" src="https://github.com/user-attachments/assets/a8ff7869-9d90-400b-971b-471aa9da5b10" /> | The Crystal Slime also has **400 HP**, but its key feature is **magicResist 0.25**, which makes magic damage much less effective. |
| Rainbow Slime | <img width="70" height="46" alt="Rainbow_Slime" src="https://github.com/user-attachments/assets/1ed15559-f92e-4bd5-86a1-a73f57ea2008" /> | Slow but difficult to kill, the Rainbow Slime has **2000 HP** and a high **80 gold reward**. It works as a late-game endurance enemy. |
| King Slime | <img width="166" height="152" alt="King_Slime" src="https://github.com/user-attachments/assets/b03e2ca7-b963-40de-8b25-b96189e00b63" /> | The King Slime is the final boss, with **6000 HP**, a **150 gold reward**, and special behaviours such as **splitting**, **reviving**, and **targeting the most valuable tower**. |
| Gastropod | <img width="30" height="32" alt="Gastropod" src="https://github.com/user-attachments/assets/43377ff6-5f41-4513-8b4a-36aaf3f078fd" /> | The Gastropod is a flying enemy with **110 HP**, **speed 3.5**, and **canFly enabled**, so it adds pressure in a different way from ground slimes. |
| Spectral Gastropod | <img width="32" height="34" alt="Spectral_Gastropod" src="https://github.com/user-attachments/assets/1496b164-4bf6-431e-84a9-3d848b8d2b30" /> | The Spectral Gastropod is a stronger flying enemy, with **180 HP** and **speed 3.0**. It appears later to increase air-path pressure. |

# Requirements

## 2.1 Early stages design

At the start of the project, we compared several game ideas in online meetings. The two ideas we returned to most were a rhythm game and a tower defence game. We chose tower defence because it gave us a clear structure: enemies follow a path, the player places towers, and each level ends with a clear win or loss.

Our first plan was bigger than the final game. Around week three, we wanted to make a multiplayer tower defence game, where players could build defensive towers and send attacking units. We explored this idea with a PowerPoint prototype and some paper sketches.

https://github.com/user-attachments/assets/f44697fe-5f10-425b-bfe4-ec8478d52890

<p align="center">
  <strong>Figure 1: Early prototype video used to discuss the original multiplayer tower defence idea.</strong>
</p>

The prototype made the risk much easier to see. Multiplayer would have required **online synchronisation**, PvP balancing and more testing before the basic tower defence loop was even stable. Since our group had limited game development experience, we reduced the scope and moved to a single-player PvE game inspired by *Kingdom Rush*.

## 2.2 Requirement elicitation and refinement

After reducing the scope, we focused on what one match should contain. The player needed to choose a level, place towers on **valid positions**, survive **enemy waves**, earn **gold**, upgrade towers and protect the village.

We used *Kingdom Rush* as a reference, but not as something to copy directly. It helped us check whether our game included the features players would expect from a tower defence game: **visible enemy paths**, fixed building points, upgrades, resources and clear win-or-lose feedback. We built the basic parts first, such as map loading, enemy movement, tower placement, tower attacks, health, gold and level completion. Features such as sound effects, tutorial guidance, special tower behaviour and the boss were added later.

<p align="center">
  <img src="docs/assets/requirements_refinement.gif" alt="Requirement refinement process" width="760" />
</p>

<p align="center">
  <strong>Figure 2: Requirement refinement from the early multiplayer idea to the single-player PvE loop.</strong>
</p>

Testing also changed our thinking. At first, different tower images seemed enough to show variety. In practice, this did not give the player many real choices. Each tower needed a clear role: archery for fast single-target damage, magic for enemies with physical defence, cannon for grouped enemies and ice for slowing enemies. We used the same idea for enemies by giving them different **health**, **speed**, **resistance** and **gold reward** values.

<p align="center">
  <img src="docs/assets/requirements_roles_balance.gif" alt="Tower and enemy requirement refinement" width="760" />
</p>

<p align="center">
  <strong>Figure 3: Refining tower and enemy requirements into gameplay roles.</strong>
</p>

## 2.3 Stakeholders

Following the requirements lecture, we identified stakeholders before writing user stories. The most important stakeholders were the **players**. They needed to understand the path, tower positions, **health**, **gold** and level results without guessing what was happening.

The **development team** was another important stakeholder. The project had to fit our skills and the time available, which is why we removed multiplayer and used adjustable map, tower and wave data instead.

Other groups also affected the requirements. Designers cared about balance and level pacing. Artists cared about seasonal style and readability. Testers needed clear checks, such as whether towers attacked enemies in range or whether gold was deducted after an upgrade.

<p align="center">
  <img width="2048" height="2048" alt="image" src="https://github.com/user-attachments/assets/4c87d074-d6a2-406d-9b49-bfbc2a5acc7a" />
</p>

<p align="center">
  <strong>Figure 4: Stakeholder diagram for Sunnyvale Gate.</strong>
</p>

## 2.4 Epics, User Stories and Acceptance Criteria

**Epic E1: Core PvE Tower Defence Loop**

- **US1.1 – Player**: As a player, I want to defend my village from enemy waves, so that the level becomes more challenging over time.
  - **Acceptance Criteria**: Given that a level has loaded and enemies have spawned, when an enemy enters tower range, then the tower attacks a valid target.

- **US1.2 – Player**: As a player, I want to upgrade towers, so that I can handle stronger enemies.
  - **Acceptance Criteria**: Given that the player has enough **gold** and selects a tower, when the upgrade is confirmed, then gold is deducted and the tower statistics change.

- **US1.3 – Player**: As a player, I want clear defeat feedback, so that I know when the village has been lost.
  - **Acceptance Criteria**: Given that enemies are moving along the path, when an enemy reaches the village, then **health** decreases. If health reaches zero, then the defeat screen appears.

**Epic E2: Content and Balance**

- **US2.1 – Developer**: As a developer, I want adjustable values, so that damage, range, speed, resistance and rewards can be balanced.
  - **Acceptance Criteria**: Given that tower or enemy data has been changed, when the level is loaded, then the game uses the new values.

- **US2.2 – Game Designer**: As a game designer, I want configurable waves, so that maps can have different pacing and enemy combinations.
  - **Acceptance Criteria**: Given that wave data has been edited, when a level starts, then enemies spawn according to that data.

**Epic E3: Combat Feedback and Readability**

- **US3.1 – Player**: As a player, I want attack effects and sounds, so that I can see whether towers are working.
  - **Acceptance Criteria**: Given that an enemy is in range, when a tower attacks, then the game shows an attack effect and plays a sound.

- **US3.2 – Player**: As a player, I want **health**, **gold**, towers and enemies to be readable, so that I can make decisions quickly during a wave.
  - **Acceptance Criteria**: Given that the player is in a level, when they look at the game screen, then health, gold, towers and enemy movement are visible without opening another menu.

## 2.5 Use Case Diagram

The use case diagram summarises the player’s main actions: start the game, select a level, place and upgrade towers, pause, and reach victory or defeat. It also reminded us that player actions often need system checks, such as **valid placement**, enough **gold** and village **health**.

<p align="center">
  <img width="932" height="494" alt="Use case diagram" src="https://github.com/user-attachments/assets/0705505a-1ad3-4f4a-9b64-c0436f596fa1" />
</p>

<p align="center">
  <strong>Figure 5: Use case diagram showing the main player interactions in Sunnyvale Gate.</strong>
</p>

## 2.6 Reflection

Requirements work made the project more realistic. It helped us move from a broad idea to a game we could actually finish.

The user stories made us think less like developers and more like players. A tower was not finished just because it appeared on the map. It needed valid placement, cost, attacks and feedback. This made the requirements useful during testing, not just during planning.

We also learned that requirements change once the game becomes playable. Tower balance, enemy difficulty and interface clarity all changed during development, but having the requirements written down made those changes easier to discuss.

# Design

## 3.1 System Architecture

**Sunnyvale Gate** was designed as a browser-based p5.js game that runs from the `docs` folder on GitHub Pages. We kept the overall structure simple because the project needed to be playable in the browser, and because our group was still learning JavaScript and p5.js while building the game.

The main file is `sketch.js`, which acts as the central controller. It uses the p5.js lifecycle functions `preload()`, `setup()`, `draw()` and `mousePressed()` to load assets, create the canvas, update the game every frame and handle player input. A global `gameState` variable controls the main scene flow, including the home screen, comic introduction, level selection and gameplay. This gave the game a clear player journey without needing a more complicated screen management system.

Several design choices came directly from the requirements in Section 2. For example, the requirements for **enemy waves**, **tower upgrades**, **gold**, and **valid tower placement** meant that the game needed data that could be changed easily. For this reason, map data is stored in `maps.js`, enemy values are stored in `ENEMY_TYPES`, and tower values are stored in `TOWER_COST`, `TOWER_UPGRADE_COSTS` and `TOWER_LEVEL_STATS`. Wave patterns are defined in `LEVEL_WAVE_CONFIGS`. This data-driven approach made balancing easier, since we could adjust health, damage, range or wave timing without rewriting the whole battle system.

<p align="center">
  <img src="docs/assets/system_architecture_overview.png" alt="System architecture overview" width="900" />
</p>

<p align="center">
  <strong>Figure 6: System architecture overview of Sunnyvale Gate.</strong>
</p>

During a level, active objects are stored in arrays such as `towers`, `enemies` and `lasers`. Each frame, the game updates enemy movement, tower targeting, projectiles, visual effects, player gold, village health and win-or-lose checks. This fits p5.js well because the `draw()` loop already works as a repeated update cycle.

We also separated key responsibilities across different files. `preload_assets.js` handles asset loading, `maps.js` stores map layouts and build slots, `tower.js` manages tower behaviour and upgrade values, and `enemy.js` handles enemy movement and boss behaviour. In addition, `game_systems.js` manages waves, gold, player life and victory or defeat checks, while `towereffect.js` handles combat effects such as arrows, lasers, cannon bombs and explosions. Other supporting systems, including sound, pause control, speed control and tutorial guidance, are placed in separate files. This made the project easier to develop in parallel, even though `sketch.js` still became larger than we originally expected.

## 3.2 Class Diagram

The class diagram below summarises the main static structure of the game. It is based on the actual code rather than an ideal design only. Some parts, such as `Tower` and `Enemy`, are implemented as classes in the project. Others, like wave management and sound control, are closer to modules or controller-style responsibilities. We kept them in the diagram because they still play an important role in how the game is organised.

The most central gameplay class is `Tower`, defined in `tower.js`. It stores information such as position, tower type, level, range, damage and cooldown. More importantly, it also handles behaviour. A tower can upgrade itself, search for enemies, choose different targets depending on its type, and attack when the cooldown allows it. Since our four main tower types behave differently, putting this logic inside the class made the code easier to follow.

`Enemy`, defined in `enemy.js`, is the main class on the other side of combat. It stores movement, health, resistances and path progress, but it also includes behaviour such as taking damage, updating position and applying slow effects. In our game, enemy behaviour is not completely uniform. Boss enemies add more complex logic, including special movement and abilities, so the `Enemy` class ended up carrying both ordinary enemy behaviour and boss-related extensions.

The combat effect classes are grouped in `towereffect.js`. These include `ArrowProjectile`, `Laser`, `CannonBomb`, and several short-lived effect classes such as `ExplosionEffect`, `ArrowHitEffect`, `MagicHitEffect`, `TowerUpgradeEffect` and `TowerSellEffect`. These objects are temporary. They are created during battle, shown for a short period, and then removed. Separating them from `Tower` and `Enemy` helped keep combat feedback more readable.

Functions in `game_systems.js` manage wave progression, enemy spawning and victory or defeat checks. Strictly speaking, this part is more procedural than object-oriented, but in the diagram it is still useful to show it as a system-level component because towers and enemies both depend on the larger game flow. The same applies to sound and scene control: they are not the heart of combat, but they support the overall architecture.

This design is not highly abstract, and that was intentional. For a browser game built with p5.js, a flatter structure suited the project better than a complicated inheritance hierarchy. It was easier to debug, easier to extend, and easier for the whole group to understand.

```mermaid
classDiagram
    class GameController {
        +preload()
        +setup()
        +draw()
        +mousePressed()
        +loadMap()
        +handlePlayingClick()
    }

    class Tower {
        +x
        +y
        +type
        +level
        +range
        +damage
        +cooldown
        +upgrade()
        +findTarget()
        +findBestSplashTarget()
        +findBestIceTarget()
        +update()
        +display()
    }

    class Enemy {
        +x
        +y
        +hp
        +speed
        +armour
        +magicResist
        +pathIndex
        +takeDamage()
        +update()
        +applySlow()
        +display()
    }

    class CannonBomb {
        +damage
        +splashRadius
        +update()
        +display()
    }

    class ArrowProjectile {
        +damage
        +update()
        +display()
    }

    class Laser {
        +target
        +update()
        +display()
    }

    class ExplosionEffect {
        +update()
        +display()
    }

    class WaveSystem {
        +startWave()
        +spawnCurrentWave()
        +checkWaveAdvance()
        +isLevelVictory()
        +isLevelDefeat()
    }

    class SoundSystem {
        +playTowerAttackSfx()
        +playTowerUpgradeSfx()
        +setGameSoundsMuted()
    }

    GameController --> Tower
    GameController --> Enemy
    GameController --> WaveSystem
    GameController --> SoundSystem
    Tower --> Enemy : targets
    Tower --> ArrowProjectile : creates
    Tower --> CannonBomb : creates
    Tower --> Laser : creates
    CannonBomb --> ExplosionEffect : triggers
    WaveSystem --> Enemy : spawns
```
<p align="center">
  <strong>Figure 7: Class diagram showing the main classes, modules and relationships in Sunnyvale Gate.</strong>
</p>

## 3.3 Behavioural Diagram

The behavioural diagram shows the main flow of the game from the player’s point of view. The player starts on the home screen, enters the comic introduction, selects a level, and then moves into gameplay. This follows the same `gameState` structure described in the system architecture.

<p align="center">
  <img width="1448" height="1086" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/d7aa5286-a03b-4526-af83-febf6b36467e" />
</p>

<p align="center">
  <strong>Figure 8: Sequence diagram showing the main gameplay flow.</strong>
</p>

Once a level starts, the system loads the selected map and begins the wave process. Player actions such as placing or upgrading towers are not only visual updates. The game also checks **valid tower slots**, available **gold**, and the current scene state before changing the active objects.

The diagram also helped us understand the repeated combat loop. Enemies spawn and move along the path, while towers search for targets and attack enemies in range. At the same time, the system updates projectiles, effects, player health and win-or-loss conditions. Even though these parts are split across different files in the code, they need to work together every frame.

Pause control is included because it interrupts this normal loop. When the pause menu opens, gameplay updates need to stop, but the menu itself still has to respond to player input. This showed us that scene control and gameplay logic are connected, not completely separate.

Overall, the behavioural diagram helped us check whether the design supported a full player journey, from opening the game to reaching victory or defeat.

## 3.4 Design Reflection

Overall, the design was simple but practical. Using p5.js meant that a repeated frame update was natural, so the `draw()` loop became a clear place to update enemies, towers, effects and game state. This matched the type of game we were building.

The strongest part of the design was the data-driven structure. Tower statistics, enemy values, map routes and wave configurations were stored separately from most of the gameplay logic. This made balancing easier after testing, because we could adjust values such as **damage**, **range**, **health**, **speed** and **spawn timing** without rewriting the whole system.

The modular file structure also helped the team work more clearly. For example, tower behaviour, enemy behaviour, wave control, sound and UI support were placed in different files. This made the project easier to understand than putting everything into one script.

The main weakness was that `sketch.js` still became too large by the end of the project. It handled scene switching, player input, UI actions and some gameplay control at the same time. If we continued development, we would split scene management and UI interaction into separate modules. This would make the central game loop easier to read and reduce the risk of small UI changes affecting unrelated gameplay logic.

# Implementation

The game was implemented as a browser-based p5.js project. The main flow is controlled by `sketch.js`, where `preload()`, `setup()`, `draw()` and `mousePressed()` handle asset loading, initial setup, frame updates and player input. Around this file, we separated the main systems into smaller scripts: `tower.js` for tower behaviour, `enemy.js` for enemies and boss logic, `game_systems.js` for waves and level state, and `towereffect.js` for projectiles and combat effects.

The game is partly data-driven. Tower costs and upgrades are stored in `TOWER_COST`, `TOWER_UPGRADE_COSTS` and `TOWER_LEVEL_STATS`. Enemy values come from `ENEMY_TYPES`, while map routes and build slots are loaded from `maps.js`. Wave content is defined in `LEVEL_WAVE_CONFIGS`. This made balancing easier, because we could adjust **damage**, **range**, **health**, **speed** and **spawn timing** without rewriting the whole gameplay loop.

The final version supports the complete tower defence flow: the player can select a level, place towers on valid slots, upgrade them, fight waves, earn gold, lose health, and reach victory or defeat. The three most important implementation challenges were special tower targeting, boss behaviour, and data-driven balancing.

## Challenge 1: Different defence towers

### Ice Tower targeting

The Ice Tower was not implemented as a normal tower with a slow effect simply added to it. If it always attacked the nearest enemy, it could keep slowing the same target while other enemies passed through unaffected. To avoid this, we added `findBestIceTarget()` in `tower.js`.

This method separates enemies in range into two groups: **unslowed enemies** and **slowed enemies**. If any unslowed enemy is available, the tower chooses the nearest one from that group. Only when all available targets are already slowed does it fall back to slowed enemies. The helper method `isEnemySlowed()` checks status values such as `slowTimer`, so the tower can make a better decision during a wave.

This made the Ice Tower feel more like a support tower. It spreads the slow effect across the enemy wave instead of wasting attacks on targets that are already slowed.

<p align="center">
  <img src="docs/assets/implementation_ice_tower_targeting.png" alt="Ice tower targeting logic" width="900" />
</p>

<p align="center">
  <strong>Figure 9: Ice Tower logic that prioritises enemies who have not yet been slowed.</strong>
</p>

### Cannon Tower splash targeting

The Cannon Tower also needed its own targeting rule. Since it deals area damage, attacking the nearest enemy was not always the best choice. In `tower.js`, we implemented `findBestSplashTarget()` so that the cannon could search for the densest group of enemies.

The method first collects enemies inside tower range. Then it checks each candidate enemy and counts how many other enemies would be hit within the splash radius. The enemy with the highest count becomes the target. If two candidates have the same score, the closer one is chosen.

This gave the Cannon Tower a clearer gameplay role. It behaves differently from single-target towers and becomes especially useful when enemies are grouped together.

<p align="center">
  <img src="docs/assets/implementation_cannon_tower_targeting.png" alt="Cannon tower splash targeting" width="900" />
</p>

<p align="center">
  <strong>Figure 10: Cannon Tower logic that selects the densest enemy cluster within range.</strong>
</p>

## Challenge 2: Boss design

### Boss split and revive

The King Slime boss was the most complex enemy in the game. A normal enemy only needs movement, health and damage handling, but the boss also has a split-and-revive mechanic. When the boss reaches 0 HP, it does not always die immediately.

This logic is mainly handled in `enemy.js`. In `takeDamage()`, the code checks whether the boss still has revives left. If `reviveCount` is below `maxRevives`, the boss enters `startBossFragmenting()` instead of being marked as dead. This stores the death position, changes `bossPhase` to `"fragmenting"`, and creates fragment objects through `initBossFragments()`.

The difficult part was that this was not just a visual effect. The game had to pause the normal boss state, update fragments for a short time, and then bring the boss back without breaking the path, wave or health logic.

<p align="center">
  <img src="docs/assets/implementation_boss_split_revive.png" alt="Boss split and revive mechanic" width="900" />
</p>

<p align="center">
  <strong>Figure 11: Boss split-and-revive flow implemented through the fragmenting phase.</strong>
</p>

### Boss targeting the most valuable tower

The boss also has an active tower attack. Instead of choosing randomly, it searches for the most valuable tower in range. This makes the boss more threatening because it can punish the player’s strongest investment.

Each tower records `totalSpent`, which includes its build cost and upgrade cost. The method `findHighestValueTowerInRange()` loops through the `towers` array, checks which towers are inside the boss attack range, compares their value, and selects the highest-value target. If two towers have the same value, distance is used as a tie-breaker.

This feature connected boss behaviour with the economy system. It also changed player strategy, because upgrading one tower heavily could make it a more likely boss target.

<p align="center">
  <img src="docs/assets/implementation_boss_targeted_attack.png" alt="Boss attack on the most expensive tower" width="900" />
</p>

<p align="center">
  <strong>Figure 12: Boss logic that selects the highest-value tower in range as its target.</strong>
</p>

## Challenge 3: Data-driven balancing and wave configuration

The third challenge was keeping the game adjustable as more enemies, towers and levels were added. Instead of putting all values directly inside the main game loop, we stored most balance values in configuration objects. Tower prices and upgrade statistics are handled through `TOWER_COST`, `TOWER_UPGRADE_COSTS` and `TOWER_LEVEL_STATS`, while enemy health, speed, resistance and rewards are stored in `ENEMY_TYPES`. Wave patterns are defined separately in `LEVEL_WAVE_CONFIGS`.

This structure made repeated balancing much easier. If one wave felt too difficult, we could adjust enemy health, tower damage, gold rewards or spawn timing without changing the logic of `draw()`, `Tower.update()` or `spawnCurrentWave()`. It also made the code easier for different team members to understand, because the gameplay numbers were separated from the behaviour that uses them.

This was especially useful near the end of development, when playtesting showed that some enemies were too strong and some waves created sudden difficulty spikes. By changing the configuration data, we could smooth the difficulty curve while keeping the same core systems.

Overall, the implementation met the main requirements and produced a complete playable tower defence game. The special tower targeting and boss mechanics were the main technical challenges because they required more than simple movement or damage values. They also made the final game feel more strategic and distinctive.


# Evaluation

## Qualitative evaluation

### Think Aloud Evaluation
| Moment | Player Comment | Issue Identified |
|------|------|------|
| Game Start | “How do I place towers?” | Players aren’t aware of where to click to deploy towers |
| After selecting a unit | “What’s the difference between these towers?” | Tower types aren’t clearly explained |
| During gameplay | “How much health and gold do I have?” | The interface isn’t clear enough |

During the “think-aloud” evaluation, we identified several usability issues with the game. Participants initially struggled to understand how to deploy towers, likely due to the missing “Start Game” option and the lack of an introductory tutorial. The tower-building mechanics were also ambiguous, leaving players unsure whether they could interact with the towers. Furthermore, since the interface did not clearly explain the functions of each tower type and there was no tutorial, players struggled to understand the differences between them. Finally, players expressed confusion regarding the gold system because the display of gold held was unclear. Some players did not notice the health and gold counts displayed in the top-left corner until the game was nearly over.


## Heuristic Evaluation
| Interface | Issue | Heuristic | Frequency | Impact | Persistence | Severity |
|---|---|---|---|---|---|---|
| Game Start / Main Screen |The game starts immediately when the page loads, giving players no preparation time or option to start the game manually.| User Control and Freedom | 3 | 3 | 2 | 2.7 |
| Unit Representation |Four shapes are used to represent different unit types, but the introduction is unclear and the differences are not intuitive.| Recognition Rather Than Recall | 3 | 3 | 2 | 2.7 |
| Unit Information Display |Players cannot see the exact health or attack values of units, making it difficult to evaluate combat strength.| Visibility of System Status | 3 | 2 | 2 | 2.3 |
| Resource Display |The gold counter is displayed in the bottom-left corner and is not visually prominent.| Visibility of System Status | 2 | 2 | 1 | 1.7 |
| Combat Feedback |Units fighting each other have no visual effects, making battles less noticeable.| Visibility of System Status | 2 | 2 | 2 | 2.0 |

The results of the heuristic evaluation highlighted several usability issues, and we have prioritized design improvements. The most critical issues are those with the highest severity score (2.7), specifically the lack of a tutorial at the start of the game, which prevents users from getting off to a smooth start. We plan to address these issues first, as they directly impact the user’s initial experience and their ability to understand the core game mechanics. Medium-priority issues include a lack of clear unit information and insufficient combat feedback, which hinder players’ ability to make informed decisions and receive feedback during combat. Lower-priority issues, such as resource visibility being unclear, have a lesser impact on overall usability but still require improvements to enhance the overall experience.

## Quantitative Evaluation

### NASA TLX

| User | Difficulty 1 | Difficulty 2 |
|------|-------------|-------------|
| 1 | 35 | 72 |
| 2 | 58 | 65 |
| 3 | 41 | 78 |
| 4 | 63 | 70 | 
| 5 | 47 | 82 |
| 6 | 52 | 60 | 
| 7 | 29 | 67 |
| 8 | 61 | 75 | 
| 9 | 45 | 73 |
| 10 | 54 | 68 |


The NASA TLX test results presented in the table show the perceived workload of ten users across two difficulty levels of the game. Overall, the data indicates a clear trend of increased workload at difficulty level 2 compared to difficulty level 1. Most participants required greater mental effort when playing at difficulty level 2, and they also reported increased anxiety and frustration.

### SUS

| User | Difficulty 1 | Difficulty 2 |
|------|-------------|-------------|
| 1 | 52 | 40 |
| 2 | 55 | 45 |
| 3 | 50 | 38 |
| 4 | 53 | 42 |
| 5 | 48 | 35 |
| 6 | 58 | 47 |
| 7 | 54 | 50 |
| 8 | 49 | 37 |
| 9 | 51 | 41 |
| 10 | 53 | 44 |


The SUS results shown in the table indicate that the usability score has been consistently low at both difficulty levels, suggesting significant usability issues with the system. For difficulty level 1, most scores are between 48 and 58, mainly due to the unclear UI interface displaying health and coins, which creates a bad experience for players. For difficulty level 2, the score further decreases, with many values dropping between 35 and 45, reflecting that the increase in difficulty exacerbates existing usability issues.

## How code was tested

### White box

The white-box testing in this project focused on the internal game logic rather than the visual interface. We created a separate `whitebox_tests.html` page with `whitebox_tests.js`, so that key systems could be tested in a controlled environment. Before each test, the script resets important variables, including `enemies`, `towers`, `playerGold`, `playerLife`, wave indexes, spawn queues and frame count. This gave every test a clean starting point instead of relying on whatever happened during normal gameplay.

<p align="center">
  <img src="docs/assets/evaluation_whitebox_testing.gif" alt="White-box testing flow" width="850" />
</p>

<p align="center">
  <strong>Figure 13: White-box testing flow using controlled game objects and direct method calls.</strong>
</p>

The tests then create controlled objects, such as test paths, towers and enemies, and directly call the same methods used in the game. For example, we tested whether towers upgrade correctly on different maps, whether Cannon Towers ignore flying enemies, whether Ice Towers prioritise unslowed ground enemies, and whether physical and magic resistance affect damage correctly. We also tested the wave system by calling `startWave()` and `spawnCurrentWave()` to check whether enemies were added at the correct time.

<p align="center">
  <img src="docs/assets/evaluation_whitebox_code_examples.png" alt="White-box code examples" width="900" />
</p>

<p align="center">
  <strong>Figure 14: Examples of white-box tests for tower targeting and wave logic.</strong>
</p>

This made it possible to find logic errors in the core systems before testing the full game through normal player interaction.

### Black box

Black-box testing was done throughout development by playing the game from the player’s point of view. Instead of checking the code directly, testers interacted with the game normally: choosing levels, placing towers, upgrading them, pausing the game and trying to complete each map. This helped us find problems that were difficult to notice from the code alone.

<p align="center">
  <img src="docs/assets/evaluation_blackbox_playtesting.gif" alt="Black-box playtesting loop" width="850" />
</p>

<p align="center">
  <strong>Figure 15: Black-box playtesting loop for finding playability and balance issues.</strong>
</p>

One issue was that the background road did not always match the actual walkable path. In some maps, enemies appeared to pass through terrain that did not look suitable for walking, so we adjusted the route data and visual alignment. Another issue was UI response. Sometimes testers clicked the build or upgrade buttons, but nothing happened. After fixing the click handling, the tower menu became more reliable.

Balance was another important part of black-box testing. Early versions had enemies with very high health, which made some waves feel unfair even when players placed towers correctly. Based on playtesting feedback, we adjusted enemy health, tower damage, gold rewards and wave timing. The aim was not to remove challenge, but to make the difficulty curve smoother and less frustrating.

<p align="center">
  <img src="docs/assets/evaluation_blackbox_findings.png" alt="Black-box findings and fixes" width="900" />
</p>

<p align="center">
  <strong>Figure 16: Main black-box findings and fixes from playtesting.</strong>
</p>

After each fix, we replayed the relevant parts of the game to check whether the issue had really been solved and whether new problems had been introduced. This helped us improve the basic playability of the game and made the final version more stable.


# Process

## Collaboration

At the start of the project, we did not choose the final game idea immediately. Instead, we spent the first stage comparing different possibilities. Some members collected references from videos, playable examples and existing games, while others tried to build a very small prototype to see what could actually work in p5.js. This helped us avoid choosing an idea only because it sounded interesting.

Yi Lin, Chuhang Li and Yuxuan Cheng mainly worked on collecting and comparing game ideas at the beginning. They looked at several possible directions, including rhythm games, multiplayer strategy games and tower defence games. The ideas were written into a shared Feishu document, together with reference links and short notes about possible gameplay features.

At the same time, Wen Liang and Zishen Xu worked on an early prototype. It was not visually complete. Simple shapes were used to represent towers, enemies and the village. However, it was useful because it showed whether the basic tower defence loop could run in the browser. In this way, our early work covered both **design exploration** and **technical feasibility**.

<p align="center">
  <img src="docs/assets/process_idea_notes.png" alt="Early idea notes and genre exploration" width="900" />
</p>

<p align="center">
  <strong>Figure 17: Early Feishu notes used to collect and compare game ideas.</strong>
</p>

As the project continued, we changed the team roles. This was an important decision for us. We did not want only one or two people to understand the code while the others only wrote the report. After the role exchange, Yi Lin, Chuhang Li and Yuxuan Cheng took more responsibility for game development and helped write the code-related parts of the report. Wen Liang and Zishen Xu focused more on workshop tasks, report writing and checking whether the report matched the final game, but they still gave feedback on gameplay and helped with code when needed.

This role exchange worked well overall. It allowed more members to understand how the game was built, and it also made the report easier to connect with the actual implementation. At the same time, it created a new problem: communication had to be clearer. When responsibilities changed, some members needed time to understand recent code changes, especially tower behaviour, wave balance and boss logic. We learned that even small updates should be explained clearly, otherwise people could easily work from outdated information.

## Tools

We used different tools for different kinds of work. WeChat was mainly used for quick communication. It was where we asked short questions, shared progress, arranged meetings and reminded each other about unfinished tasks. Because everyone checked it frequently, it was the fastest way to solve small problems.

For longer discussions, we used Zoom. This was especially useful when we needed to make decisions together, such as choosing the final game direction, changing the scope from multiplayer to single-player PvE, or discussing how to divide the report work.

Feishu was used as our main shared workspace. In the early stage, it helped us collect game ideas and references in one place. Later, we used it for meeting notes, task tracking and recording decisions. Compared with group chat, Feishu was better for information that needed to stay organised.

During development, we also used the group chat to share concrete game data. For example, when we were adjusting tower statistics, enemy values and wave tables, screenshots were posted in the group so that everyone could check the latest numbers. This was useful because game balance changed many times, and written records helped us avoid confusion.

<p align="center">
  <img src="docs/assets/process_team_discussion.png" alt="Team discussion of tower and wave data" width="700" />
</p>

<p align="center">
  <strong>Figure 18: Team discussion and data sharing during balancing and refinement.</strong>
</p>

We also used a simple Kanban-style task system in Feishu. Tasks were placed under stages such as **To Do**, **In Progress** and **Done**. This helped us see which parts of the project were still waiting, which were being worked on, and which had already been finished. It was not a perfect system, but it gave the team a clearer view of progress.

The main difficulty was scheduling. Since team members had different timetables, it was sometimes hard to find a time when everyone could attend a meeting. When that happened, we relied more on written updates, screenshots and short summaries after discussion. This was not as efficient as meeting together, but it helped us keep the project moving.

Overall, our process became more organised over time. At first, we mostly shared ideas and tested possibilities. Later, the work became more focused: implementing features, balancing the game, testing, and writing the report. The combination of WeChat, Zoom and Feishu helped us stay connected, while the role exchange gave more members a chance to understand both the game and the documentation.
# Sustainability, Ethics and Accessibility

## Environmental
The direct impact of this game on the environment is relatively low because it is a lightweight digital application that does not require specialized hardware. However, like all software systems, it still consumes computing resources during execution, including CPU usage, memory, and power. If a large number of participants frequently use it, this may lead to an increase in energy consumption and related carbon emissions. In addition, there is a potential rebound effect that increasing participation in games may lead to longer screen time and higher overall device usage. To mitigate these impacts, games can be optimized for performance efficiency, such as reducing unnecessary computations and limiting resource intensive processes, which is consistent with sustainable software design principles.

## Social
From a societal perspective, games have the potential to encourage interaction and participation among players, especially when played in group environments. However, the relatively high difficulty of the game may pose obstacles for inexperienced users, reducing inclusivity and overall engagement. Players who struggle to understand the mechanisms or cope with challenges may feel frustrated or discouraged, which can have a negative impact on their willingness to continue playing or interacting with others. Therefore, games may not equally support a variety of players, which can affect accessibility and user satisfaction. To enhance social sustainability, it is important to balance challenges and usability by providing clearer explanations, more supportive feedback, and potentially adjustable difficulty levels to ensure a more inclusive experience.

## Individual
Games have a significant impact on individuals, especially in terms of user experience, learning, and happiness. Although it can provide entertainment, the relatively high difficulty may lead to increased frustration and decreased satisfaction for some players. Users who strive for progress may feel discouraged, which can have a negative impact on motivation and overall enjoyment. This is consistent with the evaluation results, where as the difficulty increases, the workload increases, and the usability score decreases. In addition, prolonged exposure to a challenging and potentially frustrating system may lead to mental fatigue. To enhance individual sustainability, it is important to balance challenge and usability by providing clearer feedback, smoother learning curves, and potentially adjustable difficulty levels, ensuring that the game remains attractive without negatively impacting user interest.

# Report and Code Quality

We tried to make this repository understandable for someone outside the team. In the report, we used diagrams, tables, screenshots and short animations to explain the project visually, rather than relying only on text. The aim was to make the game idea, requirements, design, implementation and testing process clear to an interested reader who had not followed our weekly development.

We also kept the code organised by responsibility where possible. For example, `sketch.js` controls the main p5.js flow, `tower.js` handles tower behaviour, `enemy.js` handles enemies and boss logic, `game_systems.js` manages waves and level state, `maps.js` stores map routes and build slots, and `towereffect.js` contains projectiles and combat effects.

Important gameplay values are stored in configuration objects such as `TOWER_COST`, `TOWER_LEVEL_STATS`, `ENEMY_TYPES` and `LEVEL_WAVE_CONFIGS`. This makes the game easier to rebalance and extend without rewriting the main gameplay loop. We also added comments around more complex sections, including tower targeting, boss fragment behaviour, wave spawning and sound management.

One limitation is that `sketch.js` still became quite large by the end of the project. If another team continued the project, the next improvement would be to split more UI and scene-control code into separate modules. Even so, the current repository structure should make the main systems clear enough for future development.

# Conclusion
Developing our tower defence game challenged and improved our understanding of the full software development process. At the beginning of the project, we collected a range of possible game ideas and discussed their strengths, weaknesses, and feasibility. We then narrowed these ideas down into one clear tower defence concept, which allowed us to focus on a game that was both achievable within the deadline and enjoyable for players.

Using Agile-style planning also helped us organise the project more clearly. By writing epics, user stories, and acceptance criteria, we were able to break the game down into smaller features, such as placing towers, spawning enemies, upgrading towers, pausing the game, and completing levels. This made the development process easier to manage and gave us clearer goals for what each feature needed to achieve. Creating class diagrams and sequence diagrams also helped us understand how the main systems, such as towers, enemies, waves, projectiles, maps, and UI, should interact with each other.

Evaluation was another valuable part of the project. Qualitative Evaluation, including think-aloud testing and heuristic evaluation, helped us understand how real users experienced the game. These methods revealed issues such as unclear feedback, confusing controls, and areas where players needed more guidance. Quantitative Evaluation, including SUS and NASA-TLX, gave us measurable feedback about usability and workload, which helped support our design decisions with evidence rather than personal opinion.

We also learnt the value of both black-box and white-box testing. Black-box testing allowed us to check whether the game behaved correctly from the player’s perspective, while white-box testing helped us test the internal logic directly, such as tower upgrades, enemy damage, slowing effects, split enemies, and wave spawning. This made debugging more efficient and helped us find problems that were not always obvious during normal gameplay.

Looking forward, there are several improvements we would make to the current game. We would improve the save and continue system, polish the user interface, add clearer gameplay feedback, and continue balancing the difficulty of each level. If we had the opportunity to develop a sequel, we would add more tower types, enemies with special abilities, and more complex maps with branching paths or environmental effects.  Finally, considering sustainability encouraged us to think about performance, maintainability, accessibility, and how the project could continue to develop beyond the current version. Overall, this project gave us valuable experience in teamwork, planning, programming, testing, and reflecting on a complete software engineering project.


# Contribution Statement

| Contributor | Contribution |
|------------|-------------|
| Yi Lin | Game development, tower logic, implementation writing, and balance refinement. |
| Chuhang Li | Game development, enemy and wave logic, testing support, and gameplay balancing. |
| Yuxuan Cheng | Visual asset design, game design support, tower and enemy artwork, and implementation support. |
| Wen Liang | Report writing, process documentation, evaluation analysis, and coordination of written materials. |
| Zishen Xu | Early prototype support, report writing, testing documentation, and review of requirements and design sections. |


# AI Statement

This course allows the use of AI, so we would like to explain our use of AI honestly.

In this project, we used AI tools as learning and support tools, not as a replacement for our own design, coding or testing work. The main AI tool we used was ChatGPT, and we also used AI drawing tools to support part of the visual asset creation process.

For visual design, AI drawing tools were used to help us explore possible background images, visual styles and reference ideas. However, many in-game assets were still drawn or edited by our team members using a tablet, including slimes, defensive towers and some attack effects. AI helped us save time during early visual exploration, but the final selection, adjustment and integration of assets were completed by the team.

For coding, we used AI mainly when we met problems that were beyond our current programming knowledge. We used it to understand how certain functions, structures or algorithms could work, rather than asking it to produce a complete solution for us. For example, when implementing more advanced tower behaviour, we used AI to learn about filtering enemies into groups, comparing candidates, using distance calculations, and selecting the best target based on a scoring rule.

One example is the Ice Tower logic. In our code, the Ice Tower uses `findBestIceTarget()` to separate enemies into **unslowed** and **slowed** groups, then prioritises enemies that have not yet been slowed. AI helped us think through this kind of logic structure, especially how to avoid repeatedly attacking the same already-slowed enemy. The final implementation was adapted by us to fit our own `Enemy` and `Tower` classes, including checks such as `isEnemySlowed()` and status values like `slowTimer`.

Another example is the Cannon Tower targeting system. The function `findBestSplashTarget()` does not simply select the nearest enemy. Instead, it checks possible target enemies and counts how many other enemies would be inside the splash radius. This makes the Cannon Tower choose the densest group of enemies. AI helped us understand this candidate-scoring approach, but we adjusted the logic ourselves to work with our own `enemies` array, tower range, `splashRadius`, and flying-enemy restrictions.

We also used AI as a learning aid for boss behaviour. The King Slime boss uses more complicated state-based logic than normal enemies. For example, when the boss reaches 0 HP, `takeDamage()` can trigger `startBossFragmenting()` instead of immediately killing the boss. This changes `bossPhase` to `"fragmenting"`, saves the boss death position, creates boss fragments with `initBossFragments()`, and later allows the boss to reform. AI helped us understand how to structure this kind of state-based behaviour, but the final boss mechanics, timing, fragment handling and integration with the path system were written and tested by the team.

AI was also useful when we worked on boss tower targeting. In `findHighestValueTowerInRange()`, the boss searches through the `towers` array and chooses the tower with the highest `totalSpent` value within range. If two towers have the same value, distance is used as a tie-breaker. We used AI to discuss how to make this targeting rule clearer and more maintainable, but the idea was adapted to our own economy system, where tower value depends on build cost and upgrade cost.

In addition to learning new logic patterns, we used AI to improve the structure of some functions. As the codebase grew, we needed the project to stay readable for multiple team members. AI was sometimes used to suggest cleaner function organisation, clearer variable naming, and ways to separate responsibilities. For example, we improved the structure around data-driven configuration such as `TOWER_COST`, `TOWER_UPGRADE_COSTS`, `TOWER_LEVEL_STATS`, `ENEMY_TYPES`, and `LEVEL_WAVE_CONFIGS`. This made it easier to adjust tower damage, enemy health, wave timing and gold rewards without rewriting the whole gameplay loop.

We also used AI to better understand some JavaScript and p5.js concepts. These included array traversal, filtering candidate objects, distance calculations such as `dist()` and `Math.hypot()`, frame-based timing using `frameCount`, state flags such as `dead`, `reachedEnd` and `bossPhase`, and object-based configuration data.

For the report, AI was used mainly to help us think about structure and clarity. We asked questions such as: **what should this section show to the teacher and players?**, **how can we explain this design decision more clearly?**, and **which implementation details are worth highlighting?** AI helped us organise the report outline and improve the flow between requirements, design, implementation, testing and process. However, the project details, screenshots, reflections and final content choices were based on our own work and team discussion.

Finally, we used AI to check English grammar, vocabulary and sentence expression. Since the report is written in English, we sometimes asked for advice on clearer wording, more accurate academic expressions, and better sentence structures. The purpose was to communicate our own work more precisely, not to replace our understanding.

Overall, AI supported our learning, visual exploration, code organisation and report writing. It helped us understand unfamiliar concepts and express our work more clearly. However, all core gameplay ideas, design decisions, implementation choices, testing, evaluation and final project content were completed by the team.
