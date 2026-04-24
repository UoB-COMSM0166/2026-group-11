
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
| 5 | Zishen Xu | chuichisum@163.com | Report & Supporter |

# Introduction

When we first brainstormed game ideas, we all coincidentally thought of two very famous and classic games: Stardew Valley and Kingdom Rush. After several discussions, we finally decided to combine the warm, pastoral art style of Stardew Valley with the strategic tower defense gameplay of Kingdom Rush. We want to mix these two feels together to bring players a unique experience.

Players will build different types of defense towers to protect their village from attacks by various slime enemies across four maps, each representing a distinct season. By defeating enemies and earning gold, players can upgrade their basic defense towers; selecting the right towers to upgrade will be key to turning the tide of battle. Beyond what *Kingdom Rush* offers, we’ve designed a variety of unique towers. For example, the Frost Tower slows down enemies, and the Cannon Tower focuses attacks on the densest clusters of enemies. Additionally, the final boss in the last level has several unique skills.

## Defensive Towers
| Tower Type | Image | Description |
|------------|-------|-------------|
| Archery Tower |<img width="457" height="657" alt="tower2" src="https://github.com/user-attachments/assets/af7b8802-013b-4be1-9a71-cbdbf7a21c98" /> | The cheapest tower deals a small amount of physical damage within its attack range.|
| Magic Tower | <img width="414" height="427" alt="tower1" src="https://github.com/user-attachments/assets/8abc3787-0faa-4eed-9885-ba528511cecd" /> | Ignores armor, deals magic damage within the attack range.|
| Cannon Tower | <img width="457" height="657" alt="tower3" src="https://github.com/user-attachments/assets/2e983e7e-37fd-4259-89b4-f363c50ea82b" />| Deals area-of-effect physical damage within the attack range, focusing primarily on areas with a high concentration of monsters. |
| Ice Tower | <img width="424" height="433" alt="tower4" src="https://github.com/user-attachments/assets/46b11b34-2670-4f40-bcfe-4bf9d5af13f3" /> | Slows the enemy's movement speed and deals a small amount of magic damage.. |

## Partial enemies

| Monster Type | Image | Description |
|--------------|-------|-------------|
| Baby Slime | <img width="32" height="24" alt="Black_Slime" src="https://github.com/user-attachments/assets/f9e1a700-4710-4b88-8d80-211f838544bd" /> | The lowest-level slime, with low health and low armor, can be easily defeated. |
| Ice spike Slime | <img width="40" height="30" alt="Spiked_Ice_Slime" src="https://github.com/user-attachments/assets/c911a855-47e7-421f-afac-18237fcf0617" /> | High health and physical defense; attacking with a magic tower is very effective. |
| Crystal Slime | <img width="38" height="30" alt="Crystal_Slime" src="https://github.com/user-attachments/assets/a8ff7869-9d90-400b-971b-471aa9da5b10" /> | With high health and magic defense, attacking with cannons is very effective. |
| Rainbow Slime | <img width="70" height="46" alt="Rainbow_Slime" src="https://github.com/user-attachments/assets/1ed15559-f92e-4bd5-86a1-a73f57ea2008" /> | Very slow, but with extremely high HP and both physical and magical defense—do everything you can to stop it.|

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

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.
- 

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
