
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
| 5 | Zishen Xu | chuichisum@163.com | Supporter & Process Coordinator |

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
| Baby Slime | <img width="32" height="24" alt="Baby_Slime" src="https://github.com/user-attachments/assets/5e5273b9-84b6-490c-946e-d1f48050d2ce" />| The lowest-level slime, with low health and low armor, can be easily defeated. |
| Ice spike Slime | <img width="40" height="30" alt="Spiked_Ice_Slime" src="https://github.com/user-attachments/assets/3b85462f-9e24-47ce-b468-fca87135e476" />| High health and physical defense; attacking with a magic tower is very effective. |
| Crystal Slime | <img width="38" height="30" alt="Crystal_Slime" src="https://github.com/user-attachments/assets/6a7c99ad-c3f9-4661-9dad-fcf0a0131cce" />| With high health and magic defense, attacking with cannons is very effective. |
| Rainbow Slime | <img width="70" height="46" alt="Rainbow_Slime" src="https://github.com/user-attachments/assets/e15dca6f-0e12-4c28-adba-d2df80db7878" />| Very slow, but with extremely high HP and both physical and magical defense—do everything you can to stop it.|

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

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams.

- ####  Sequence diagram
<img width="3072" height="2048" alt="image" src="https://github.com/user-attachments/assets/db218de8-2eb2-43dc-a30d-330880f0c604" />

- ####  Class diagram
<img width="5124" height="5150" alt="image" src="https://github.com/user-attachments/assets/64876e13-3bcd-4e72-9c55-d65a63aded2d" />

# Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

# Evaluation

- 15% ~750 words

- One qualitative evaluation (of your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

#### Think Aloud Evaluation
| Moment | Player Comment | Issue Identified |
|------|------|------|
| Start of game | "How do I place the unit?" | Player did not realise they must click the base to deploy units |
| After selecting unit | "What are the differences between these shapes?" | Unit types were not clearly explained |
| Neutral tower | "Am I taking over this tower?" | Tower capture mechanic was unclear |
| During gameplay | "How many gold coins do I have?" | Gold generation system was not obvious |

Our game was found to have several usability issues during the think-aloud evaluation process. Participants initially struggled to understand unit deployment methods, likely due to the absence of a “Start Game” option and insufficiently intuitive game introductions. The tower capture mechanism was similarly ambiguous, leaving players uncertain whether they could interact with towers. Additionally, differences between unit types were poorly understood, as the interface failed to clearly explain their functions. Finally, players expressed confusion about the gold-based resource system, with unclear display of held gold. Some players only discovered the gold cloth count displayed in the bottom-left corner near the end of their game.

#### Heuristic Evaluation
| Interface | Issue | Heuristic | Frequency | Impact | Persistence | Severity |
|---|---|---|---|---|---|---|
| Game Start / Main Screen |The game starts immediately when the page loads, giving players no preparation time or option to start the game manually.| User Control and Freedom | 3 | 3 | 2 | 2.7 |
| Unit Representation |Four shapes are used to represent different unit types, but the introduction is unclear and the differences are not intuitive.| Recognition Rather Than Recall | 3 | 3 | 2 | 2.7 |
| Unit Information Display |Players cannot see the exact health or attack values of units, making it difficult to evaluate combat strength.| Visibility of System Status | 3 | 2 | 2 | 2.3 |
| Neutral Tower Capture |There is no progress indicator when capturing neutral defense towers, so players cannot tell how close they are to capturing them.| Visibility of System Status | 2 | 2 | 2 | 2.0 |
| Resource Display |The gold counter is displayed in the bottom-left corner and is not visually prominent.| Visibility of System Status | 2 | 2 | 1 | 1.7 |
| Combat Feedback |Units fighting each other have no visual effects, making battles less noticeable.| Visibility of System Status | 2 | 2 | 2 | 2.0 |



# Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.


# Sustainability, ethics and accessibility



# Conclusion

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.

# Contribution statement

- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

# Ai statement


### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?
