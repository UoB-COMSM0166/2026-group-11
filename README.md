
# 2026-group-11

## Sunnyvale Gate

Love the art style of Stardew Valley and enjoy playing Kingdom Rush? Then this game is tailor-made for you — through spring, summer, autumn, and winter, protect your village in every season!

<img width="823" height="392" alt="title" src="https://github.com/user-attachments/assets/2e51c86c-477f-465f-b64c-6416c9d0a930" />

[Click here to play the game](https://uob-comsm0166.github.io/2026-group-11/)

VIDEO. Include a demo video of your game here

# Table of Contents
1. [Team](#team)
2. [Introduction](#introduction)
3. [Requirements](#requirements)
4. [Design](#design)
5. [Implementation](#implementation)
6. [Evaluation](#evaluation)
7. [Process](#process)
8. [Sustainability, Ethics and Accessibility](#sustainability-ethics-and-accessibility)
9. [Conclusion](#conclusion)
10. [Contribution Statement](#contribution-statement)
11. [AI Statement](#ai-statement)

# Team

![image](https://github.com/user-attachments/assets/cf4abf93-01fc-4738-b1ac-b76788c01ac6)

| # | Name | Email | Role |
|:-:|------|-------|------|
| 1 | Yi Lin | adai08823@gmail.com | Developer & Game Designer |
| 2 | Chuhang Li | zgndylch@163.com | Developer & Game Designer |
| 3 | Yuxuan Cheng | chengyx0921@outlook.com | Developer & Graphic Artist |
| 4 | Wen Liang | fd21102@bristol.ac.uk | Report & Process Coordinator |
| 5 | Zishen Xu | chuichisum@163.com | Coder & Report |

# Introduction

**Sunnyvale Gate** is a browser-based tower defence game developed with p5.js. The concept was inspired by two games that several members of our group enjoyed: *Stardew Valley* and *Kingdom Rush*. We wanted to draw on the warm seasonal style of *Stardew Valley*, while combining it with the clearer goals and strategic gameplay of a tower defence game.

In the game, the player protects a village from waves of slime enemies across four seasonal maps: spring, summer, autumn and winter. The player earns gold by defeating enemies, then uses it to build or upgrade towers. Different enemies have different health, speed and resistance values, so the player needs to decide which towers to build and when to upgrade them.

Our main twist is that the game uses a cosy farming-game atmosphere while adding more specialised tower behaviours. For example, the Frost Tower slows enemies that have not already been slowed, while the Cannon Tower attacks areas where enemies are most concentrated. The final level also includes a boss with special behaviours, including splitting, reviving and attacking the player’s most valuable tower. These features became the main technical challenges during implementation.

## Defensive Towers
| Tower Type | Image | Description |
|------------|-------|-------------|
| Archery Tower Level 1 |<img width="457" height="657" alt="tower2" src="https://github.com/user-attachments/assets/af7b8802-013b-4be1-9a71-cbdbf7a21c98" /> | A low-cost tower that fires physical attacks at single enemies within range, which makes it useful for building an early defence quickly. |
| Archery Tower Level 2 |<img width="424" height="433" alt="tower2_lv2" src="https://github.com/user-attachments/assets/64488e59-daf5-40e7-a7b4-65a21d1a7706" /> | An upgraded archery tower that deals more damage than the basic version, which makes it more reliable against stronger early-game enemies. |
| Archery Tower Level 3 |<img width="424" height="433" alt="tower2_lv3" src="https://github.com/user-attachments/assets/3d6633f6-868a-432c-a6c1-6ab3a27cf6ce" />| A high-damage single-target tower that works best against enemies with low physical resistance, especially when the player needs consistent damage on one target. |
| Magic Tower Level 1 | <img width="414" height="427" alt="tower1" src="https://github.com/user-attachments/assets/8abc3787-0faa-4eed-9885-ba528511cecd" /> | A basic tower that deals magic damage, which gives the player a way to deal with enemies that have higher physical defence. |
| Magic Tower Level 2 | <img width="424" height="433" alt="tower1_lv2" src="https://github.com/user-attachments/assets/186a34c6-0836-46db-bd9e-13a3115ab420" /> |An upgraded magic tower that increases its damage output, which makes it more effective against armoured enemies. |
| Magic Tower Level 3 | <img width="424" height="433" alt="tower1_lv3" src="https://github.com/user-attachments/assets/f8a1befc-ccd3-4f31-bc4d-634bc669dcc7" /> | A strong magic-damage tower that is designed for enemies which are difficult to defeat with physical attacks. |
| Cannon Tower Level 1 | <img width="457" height="657" alt="tower3" src="https://github.com/user-attachments/assets/2e983e7e-37fd-4259-89b4-f363c50ea82b" />| A tower that deals area damage instead of focusing on one enemy, which makes it useful when several enemies move close together. |
| Cannon Tower Level 2 | <img width="424" height="433" alt="tower3_lv2" src="https://github.com/user-attachments/assets/3aba1165-7714-46e1-835f-98dd3ed498c1" /> | An upgraded cannon tower that deals stronger area damage, which helps the player control larger groups of ground enemies. |
| Cannon Tower Level 3 | <img width="424" height="433" alt="tower3_lv3" src="https://github.com/user-attachments/assets/91f1fef5-ac80-4c26-b505-00a5a1b5807b" /> | A powerful area-damage tower that can punish dense enemy waves, especially when enemies are grouped together on the path. |
| Ice Tower Level 1 | <img width="424" height="433" alt="tower4" src="https://github.com/user-attachments/assets/46b11b34-2670-4f40-bcfe-4bf9d5af13f3" /> | A support tower that slows enemies, which gives other towers more time to attack them. |
| Ice Tower Level 2 | <img width="424" height="433" alt="tower4_lv2" src="https://github.com/user-attachments/assets/6885c8f2-7272-435b-aec9-5467cc970043" /> | An upgraded ice tower that strengthens the slowing effect, which makes it especially useful against faster enemies. |
| Ice Tower Level 3 | <img width="424" height="433" alt="tower4_lv3" src="https://github.com/user-attachments/assets/b867bacc-1abd-4cdb-912a-d5a9857e8678" /> | A late-game support tower that provides stronger slowing control, which helps stabilise the defence during difficult waves. |

## Partial enemies

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

At the very beginning of the project, we held several online meetings to share our ideas for games. Tower defense and rhythm games were the directions we initially considered. Until the third week, our plan was to create a multiplayer online tower defense game where each player could build defense towers and deploy attacking soldiers. We used PowerPoint to create paper prototypes, and we tried sketching our ideas on paper, but the results didn't quite satisfy everyone.

This is our prototypes.

https://github.com/user-attachments/assets/f44697fe-5f10-425b-bfe4-ec8478d52890

During later discussions, we realized that developing a multiplayer online tower defense game would be too challenging for us, as we had no prior game development experience. After several review meetings, we finally decided to create a tower defense game in the style of Kingdom Rush.
Over the next few weeks, we used stakeholders, epics, user stories, and acceptance criteria to clarify what players wanted to experience in our game. We also created a use case diagram to define the game’s overall workflow to guide future development.

## 2.3 Stakeholders

<img width="2048" height="2048" alt="image" src="https://github.com/user-attachments/assets/4c87d074-d6a2-406d-9b49-bfbc2a5acc7a" />

## 2.4 Epics & User Stories & Acceptance Criteria

### Epic E1: Core PvE Tower Defense Loop

- **US1.1 – Players**: As the player, I want to defend my village against wave after wave of enemies, so that I can experience gameplay with gradually increasing difficulty.
  - **Acceptance Criteria**: Given that the map has been loaded and the player can place towers on valid tiles, when a wave begins and enemies spawn, then the towers will automatically attack the enemies.

- **US1.2 – Players**: As the player, I want to upgrade towers, so that I can eliminate enemies more quickly.
  - **Acceptance Criteria**: Given that a tower has been selected and the player has sufficient coins, when the player opens the upgrade menu and clicks “Upgrade,” then the coins are immediately deducted, and the tower’s attributes are updated immediately.

- **US1.3 – Players**: As a player, I want the game to clearly inform me when my village health reaches zero, so that I know I have failed the match and can restart.
  - **Acceptance Criteria**: Given the village has a current health value greater than zero, when an enemy reaches the village center, then the health decreases by the enemy’s damage value.


### Epic E2: Content & Balance
- **US2.1 – Developers**: As a developer, I want to be able to adjust game balance values (such as tower damage, attack speed, and enemy health), so that we can fine-tune the gameplay experience.
  - **Acceptance Criteria**: Given that a configuration file containing balance parameters exists, when the developer modifies values and starts the game, then the new values are applied.

- **US2.2 – Game Design**: As a game designer, I want to configure enemy wave parameters (number, type, spawn timing) for each map, so that I can create varied difficulty and pacing across matches.
  - **Acceptance Criteria**: Given that each map has its own wave definition file, when the game designer edits the number of enemies, enemy types, or spawn timing, then when the map is loaded, the new wave configuration takes effect immediately.


### Epic E3: Combat Feedback & Readability
- **US3.1 – Artists**: As an artist, I want clear visual effects  for attacks, hits, and tower destruction, so that players can easily understand combat outcomes.
  - **Acceptance Criteria**: Given that an enemy is within range of a tower, when the tower launches an attack, then a visible attack effect is displayed and a corresponding attack sound is played.
 

## 2.5 Use case diagram
<img width="932" height="494" alt="case diagram" src="https://github.com/user-attachments/assets/0705505a-1ad3-4f4a-9b64-c0436f596fa1" />

## 2.6 Reflection
Working on this PvE tower defense game taught us how structured requirements can shape a project from the start. By defining epics, we broke the game into meaningful core PvE loop, combat feedback, game balance, and other features. This helped us see the big picture while keeping focused on what matters most for a player defensive experience.

Writing user stories forced us to think from each stakeholder's perspective. For a PvE game, this was especially valuable: we had to balance the needs of players seeking challenge with those preferring a more relaxed experience, while also considering testers, designers, and content creators. 

Acceptance criteria turned vague ideas into concrete checks. Instead of saying "the game should feel fair," we defined what fair means for our context—synchronized enemy spawning, clear upgrade choices, configurable wave parameters. This gave us a shared understanding of "done" and reduced ambiguity between team members.


# Design

The system uses a browser-based single-page architecture built on p5.js. The central controller is sketch.js, which manages the p5 lifecycle methods including preload(), setup(), draw(), and mousePressed(). The game is controlled by a global scene state variable, gameState, which switches between the home screen, comic intro, level selection, and gameplay scene.
﻿
The gameplay system is data-driven. Map layouts are stored in maps.js, enemy statistics are stored in ENEMY_TYPES, tower costs and upgrades are stored in TOWER_COST, TOWER_UPGRADE_COSTS, and TOWER_LEVEL_STATS, while wave configurations are stored in LEVEL_WAVE_CONFIGS. During gameplay, the main dynamic entities are stored in three arrays: towers, enemies, and lasers. Each frame, the system updates enemy movement, tower targeting, projectile/effect behaviour, economy, health, and win/loss conditions.
﻿
The system is organised using a modular script-based architecture, with key responsibilities separated across different files. Core gameplay features such as enemy behaviour, tower behaviour, wave management, and UI control are handled by dedicated modules, while supporting systems such as audio, pause control, speed adjustment, tutorial guidance, and white-box testing are implemented separately. This structure improves readability and maintainability, and allows new features to be added without major changes to the central gameplay loop.

- ##  Behavioural diagrams
<img width="1448" height="1086" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/d7aa5286-a03b-4526-af83-febf6b36467e" />

The sequence diagram illustrates the main interaction flow of the tower defense game from the player’s perspective. It begins with the player starting the game from the home screen and entering the level selection interface. After a map is selected, the gameplay system loads the chosen map and begins the wave-based enemy spawning process. During gameplay, the player can place towers, and the gameplay system creates the corresponding tower objects. These towers then attack enemies as they move along the path, while the gameplay system continuously updates enemy states and checks whether the player has won or lost. The diagram also shows the pause function, where the player can open the pause menu and later resume the game. Finally, depending on the result of the level, the system displays either the victory or defeat screen to the player.

- ##  Class diagram
1


# Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game.

- 怎么完成整个游戏代码的

## Challenge 1： Different defense towers

### 1. The Ice Tower will prioritize attacking enemies who have not been slowed down
介绍代码，配图

### 2. The turret will select a position with the most enemies to deal damage to the range area
介绍代码，配图


## Challenge 2： Boss Design

### 1. When the boss dies, it splits into four pieces and reassembles itself after a short time to revive.
介绍代码，配图

### 2. The boss will search for the most expensive tower in the map for targeted attacks.
介绍代码，配图



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
The white-box testing in this project focuses on the internal game logic instead of the visual interface. The test page resets the main game variables before each test, including enemies, towers, player gold, player life, wave indexes, spawn queues, and frame count. It then creates controlled objects, such as test paths, towers, and enemies, and directly calls the same methods used during gameplay. For example, it tests whether towers upgrade correctly depending on the current map, whether cannon towers ignore flying enemies, whether ice towers prioritise unslowed ground enemies, whether physical and magic resistance affect damage correctly, and whether split enemies create child enemies after death. It also checks the wave system by testing startWave() and spawnCurrentWave() to make sure enemies are added to the game at the correct time. This makes it possible to find logic errors in the core systems before testing the full game through normal player interaction.

### Black box
Throughout the development process, we have been conducting black box testing, focusing on interacting with the game from the player's perspective to verify if the functionality is working as expected. This method helped us identify and solve several key problems.
Firstly, the background image does not match the actual walkable path. Testers found that the area shown in the background image as a road differed from the walkable path by a certain distance, causing enemies to directly pass through terrain that was not suitable for walking. We have readjusted the collision and visual layers of each map to ensure that the enemy's path perfectly matches the visual background.
Secondly, there have been cases where testers clicked on the UI to build defense towers but nothing happened. After fixing the UI logic, all buttons reliably triggered the build and upgrade operations.
Thirdly, the game is unbalanced - monsters are too difficult to deal with. Feedback indicates that early enemies had excessively high health values; Even with correctly placed towers, it is difficult for players to kill them, which greatly damages the experience. Based on the test data, we adjusted the enemy's health and the damage of the defense tower to make the difficulty curve smoother, challenging but not discouraging.
Through this black box test, we not only verified the basic playability of the game, but also collected valuable player feedback. After each fix, we will rerun the relevant test cases to ensure that the issue is truly resolved and no new errors are introduced. This lays a solid foundation for providing stable and enjoyable tower defense games.


# Process 

## Collaboration
In the early stage of the project, Yi Lin, Chuhang Li, and Yuxuan Cheng collected many interesting game ideas, and shared game links and video references in a shared document for the whole team. They also analysed different game genres and listed several promising directions to explore. Meanwhile, Wen Liang and Zishen Xu implemented an initial playable prototype, using simple shapes to represent towers, enemies, and the village.
﻿
To give every team member an opportunity to work on code, we swapped roles in the middle of the project. From that point on, Yi Lin, Chuhang Li, and Yuxuan Cheng took primary responsibility for game development and helped document the code‑related parts of the report. Wen Liang and Zishen Xu focused on weekly workshop tasks and report writing, while also providing feedback, suggesting ideas, and assisting with game code when needed.
﻿
This role exchange worked well for us: it allowed everyone to understand both development and documentation, though we also learned that communication became more critical when responsibilities shifted.

## Tools
In the first week after forming the group, we exchanged contact details and created a WeChat group to facilitate communication. During the second week, when discussing initial game ideas, we held an online meeting via Zoom and used Feishu’s document-sharing function to collaboratively develop and refine our concepts in real time.

<img width="770" height="558" alt="ideas1" src="https://github.com/user-attachments/assets/47519de9-25ee-40bd-b81f-5081f3c6dbe6" />     <img width="217" height="392" alt="number" src="https://github.com/user-attachments/assets/bd65a7f6-e36a-4560-98f4-594caaa0eb66" />

Throughout the project, we maintained frequent communication, with daily updates shared in the group chat to report progress and discuss ongoing changes. In addition to the weekly face-to-face meetings after Tuesday sessions, we organised online meetings for every two weeks to ensure that all team members remained aligned and were progressing in the right direction. After each meeting, one member was responsible for documenting key discussion points and recording areas for improvement in Feishu, allowing all members to stay informed and track development decisions.

We implemented a Kanban-style task management system within Feishu to organise and track our development progress. Tasks were categorised into stages such as “To Do”, “In Progress”, and “Done”, which helped improve visibility and coordination within the team.

This structured communication approach helped improve coordination and transparency within the team. By combining meetings and group chat and shared documents, we were able to respond quickly to issues and maintain consistent progress. However, there were occasional challenges in scheduling meetings due to conflicting timetables, which required flexibility and adjustment from all team members.


# Sustainability, ethics and accessibility

## Environmental
The direct impact of this game on the environment is relatively low because it is a lightweight digital application that does not require specialized hardware. However, like all software systems, it still consumes computing resources during execution, including CPU usage, memory, and power. If a large number of participants frequently use it, this may lead to an increase in energy consumption and related carbon emissions. In addition, there is a potential rebound effect that increasing participation in games may lead to longer screen time and higher overall device usage. To mitigate these impacts, games can be optimized for performance efficiency, such as reducing unnecessary computations and limiting resource intensive processes, which is consistent with sustainable software design principles.

## Social
From a societal perspective, games have the potential to encourage interaction and participation among players, especially when played in group environments. However, the relatively high difficulty of the game may pose obstacles for inexperienced users, reducing inclusivity and overall engagement. Players who struggle to understand the mechanisms or cope with challenges may feel frustrated or discouraged, which can have a negative impact on their willingness to continue playing or interacting with others. Therefore, games may not equally support a variety of players, which can affect accessibility and user satisfaction. To enhance social sustainability, it is important to balance challenges and usability by providing clearer explanations, more supportive feedback, and potentially adjustable difficulty levels to ensure a more inclusive experience.

## Individual 
Games have a significant impact on individuals, especially in terms of user experience, learning, and happiness. Although it can provide entertainment, the relatively high difficulty may lead to increased frustration and decreased satisfaction for some players. Users who strive for progress may feel discouraged, which can have a negative impact on motivation and overall enjoyment. This is consistent with the evaluation results, where as the difficulty increases, the workload increases, and the usability score decreases. In addition, prolonged exposure to a challenging and potentially frustrating system may lead to mental fatigue. To enhance individual sustainability, it is important to balance challenge and usability by providing clearer feedback, smoother learning curves, and potentially adjustable difficulty levels, ensuring that the game remains attractive without negatively impacting user interest.

# Conclusion
Developing our tower defence game challenged and improved our understanding of the full software development process. At the beginning of the project, we collected a range of possible game ideas and discussed their strengths, weaknesses, and feasibility. We then narrowed these ideas down into one clear tower defence concept, which allowed us to focus on a game that was both achievable within the deadline and enjoyable for players.

Using Agile-style planning also helped us organise the project more clearly. By writing epics, user stories, and acceptance criteria, we were able to break the game down into smaller features, such as placing towers, spawning enemies, upgrading towers, pausing the game, and completing levels. This made the development process easier to manage and gave us clearer goals for what each feature needed to achieve. Creating class diagrams and sequence diagrams also helped us understand how the main systems, such as towers, enemies, waves, projectiles, maps, and UI, should interact with each other.

Evaluation was another valuable part of the project. Qualitative Evaluation, including think-aloud testing and heuristic evaluation, helped us understand how real users experienced the game. These methods revealed issues such as unclear feedback, confusing controls, and areas where players needed more guidance. Quantitative Evaluation, including SUS and NASA-TLX, gave us measurable feedback about usability and workload, which helped support our design decisions with evidence rather than personal opinion.

We also learnt the value of both black-box and white-box testing. Black-box testing allowed us to check whether the game behaved correctly from the player’s perspective, while white-box testing helped us test the internal logic directly, such as tower upgrades, enemy damage, slowing effects, split enemies, and wave spawning. This made debugging more efficient and helped us find problems that were not always obvious during normal gameplay.

Looking forward, there are several improvements we would make to the current game. We would improve the save and continue system, polish the user interface, add clearer gameplay feedback, and continue balancing the difficulty of each level. If we had the opportunity to develop a sequel, we would add more tower types, enemies with special abilities, and more complex maps with branching paths or environmental effects.  Finally, considering sustainability encouraged us to think about performance, maintainability, accessibility, and how the project could continue to develop beyond the current version. Overall, this project gave us valuable experience in teamwork, planning, programming, testing, and reflecting on a complete software engineering project.


# Contribution statement

| Contributor | Contribution |
|------------|-------------|
| Yi Lin | 1 |
| Chuhang Li | 1 |
| Yuxuan Cheng | 1 |
| Wen Liang | 1 |
| Zishen Xu | 1 |



# Ai statement

During the development process of this project, artificial intelligence tools were used for limited and supportive roles. The background image we use is generated using artificial intelligence tools to enhance the overall beauty of the game and save time. In addition, when addressing technical challenges in code, artificial intelligence is occasionally consulted as a learning aid tool. We did not directly copy the generated code, but used artificial intelligence to understand methods and solutions, and then implemented our own versions based on this understanding. All core design decisions, implementation, and evaluation are independently conducted by the team.


### Additional Marks
You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:
- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?
