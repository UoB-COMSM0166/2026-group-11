
# 2026-group-11
2026 COMSM0166 group 11

[Click here to play the game](https://uob-comsm0166.github.io/2026-group-11/)


## Sunnyvale Gate

Love the art style of Stardew Valley and enjoy playing Kingdom Rush? Then this game is tailor-made for you — through spring, summer, autumn, and winter, protect your village in every season!

<img width="823" height="392" alt="title" src="https://github.com/user-attachments/assets/2e51c86c-477f-465f-b64c-6416c9d0a930" />

[Click here to play the game](https://uob-comsm0166.github.io/2026-group-11/)

VIDEO. Include a demo video of your game here

## Team

![image](https://github.com/user-attachments/assets/cf4abf93-01fc-4738-b1ac-b76788c01ac6)

| # | Name | Email | Role |
|:-:|------|-------|------|
| 1 | Yi Lin | adai08823@gmail.com | Developer & Game Designer |
| 2 | Chuhang Li | zgndylch@163.com | Developer & Game Designer |
| 3 | Yuxuan Cheng | chengyx0921@outlook.com | Developer & Graphic Artist |
| 4 | Wen Liang | fd21102@bristol.ac.uk | Report & Process Coordinator |
| 5 | Zishen Xu | chuichisum@163.com | Supporter & Process Coordinator |


## Project Report

### 1. Introduction

#### Design Concept
This project aims to move beyond the traditional tower defense structure centered on passive defense and instead construct a strategy-based competitive system that integrates both offense and defense. By combining defensive construction with proactive troop deployment, the game requires players to continuously balance attacking and defending decisions, thereby enhancing strategic depth and real-time tension during combat.

#### Gameplay Integration and Inspiration
The game draws inspiration from two major gameplay paradigms. On one hand, it adopts the structural defense logic of traditional tower defense games. On the other hand, it is influenced by real-time strategy games such as Clash Royale, particularly in terms of time-based resource generation, real-time troop deployment, and unit counter relationships.
By integrating resource growth mechanics, immediate deployment decisions, and a bidirectional advancement system into the tower defense framework, the gameplay shifts from passive defense to dynamic offensive–defensive competition, increasing both interactivity and strategic variability.

#### Strategic Structure and Progression System
The game constructs multi-layered strategic depth through an economic system, unit counter mechanisms, and a progression-based upgrade system. Players must manage resources and adjust unit compositions within individual battles while also developing long-term growth strategies through unit upgrades, castle enhancements, and economic improvements.
The combination of short-term tactical decisions and long-term progression planning enhances replayability and strategic extensibility.

#### Intelligent AI and Difficulty Design
The game features an intelligent AI system with multiple difficulty levels. The AI can dynamically adjust troop deployment timing and unit composition according to battlefield conditions. At higher difficulty levels, the AI demonstrates stronger resource management capabilities and more effective counter-strategies.
This tiered difficulty structure ensures accessibility for beginners while providing meaningful challenges for experienced players.

#### System Architecture
The overall system adopts a loop-driven combat structure: resource generation, unit creation, battle calculation, and victory condition evaluation form a continuous operational cycle. Meanwhile, the upgrade system functions as an outer progression layer that interacts with the core combat loop, resulting in a clear and well-structured system architecture.


### 2. Requirements 

- 15% ~750 words
- Early stages design. Ideation process. How did you decide as a team what to develop? Use case diagrams, user stories. 

#### 2.1 Early ideas

At the early stage of the project, we did not immediately decide on a final game type. Instead, we explored several possible directions, including tower defense games, controllable character games (such as shooting games), rhythm games, and strategy war games. Tower defense offered a clear structural framework and was suitable for building a stable combat loop and upgrade system. Shooting games emphasized direct player control and immediate feedback. Rhythm games provided interesting technical challenges, particularly in timing and judgement systems. Strategy war games, on the other hand, focused on resource allocation, frontline advancement, and offensive–defensive pacing, offering stronger strategic depth.

After comparing these options, we found that a single genre could not fully balance interaction and long-term strategic development. Therefore, we decided to integrate elements of tower defense and strategy war games to create an offensive–defensive strategy experience. Tower defense provides the structural foundation and defensive system, while strategy war mechanics introduce frontline pressure and resource management, transforming the gameplay from passive defense into dynamic two-sided competition.

Based on this integration, the purpose of the game is to build a strategic system centered on the balance between offense and defense, where players gain advantages through economic management, unit counter strategies, and progression systems rather than relying solely on fast reactions or fixed tactics. In addition, the implementation of intelligent AI and multiple difficulty levels ensures that players of different skill levels can experience appropriate challenges and maintain long-term engagement.

#### 2.2 Prototypes
This is our prototypes.


https://github.com/user-attachments/assets/f44697fe-5f10-425b-bfe4-ec8478d52890


#### 2.3 Stakeholders

<img width="2048" height="2048" alt="image" src="https://github.com/user-attachments/assets/4c87d074-d6a2-406d-9b49-bfbc2a5acc7a" />

#### 2.4 Epics & User Stories & Acceptance Criteria

##### Epic E1: Core PvP Tower Defense Loop
- **US1.1 – Players**: As a player, I want to participate in a real-time PvP match where I can place towers and defend my base, so that I can compete against another player.
  - **Acceptance Criteria**: Players can join a match, place towers on valid tiles, and both sides experience synchronized gameplay without noticeable delay.

- **US1.2 – Players**: As a player, I want to choose between multiple upgrade paths for each tower type, so that I can adapt my strategy based on the opponent's moves.
  - **Acceptance Criteria**: Upgrade menu shows at least two distinct options with clear stat previews; selection deducts gold and updates tower stats immediately.


##### Epic E2: Content & Balance
- **US2.1 – Developers**: As a developer, I want to be able to adjust game balance values (such as tower damage, attack speed, and enemy health), so that we can fine-tune the gameplay experience.
  - **Acceptance Criteria**: Balance values can be modified through a configuration file; changes are applied when the game starts; invalid values do not crash the game.

- **US2.2 – Game Design**: As a game designer, I want to configure enemy wave parameters (number, type, spawn timing) for each map, so that I can create varied difficulty and pacing across matches.
  - **Acceptance Criteria**: Wave definitions are editable per map; spawn timing and enemy composition can be customized; changes take effect when the map is loaded.


##### Epic E3: Combat Feedback & Readability
- **US3.1 – Artists**: As an artist, I want clear visual effects (VFX) for attacks, hits, and tower destruction, so that players can easily understand combat outcomes.
  - **Acceptance Criteria**: Attack impacts show a visible hit effect (spark or damage number) ; destruction triggers a unique animation and particle effect.


##### Epic E4: Quality
- **US4.1 – Playtesters**:As a playtester, I want to quickly restart a match after it ends, so that I can test multiple scenarios in a short time.
  - **Acceptance Criteria**: Restart option appears immediately on the end screen; clicking it begins a new match with the same settings within 3 seconds.


##### Epic E5: Community & Sharing Features
- **US5.1 – Community & Content Creators**: As a content creator, I want to save match replays and share them, so that I can create highlight videos and engage the community.
  - **Acceptance Criteria**: Replay files are saved locally after a match; replays can be played back in-game with correct timing; optional export to video is available.
#### 2.5 Use case diagram
<img width="2048" height="3072" alt="image" src="https://github.com/user-attachments/assets/771deb29-99c3-4320-850e-6c7a51587126" />

#### 2.6 Reflection
Working on this PvP tower defense game taught us how structured requirements can shape a project from the start. By defining epics, we broke the game into meaningful core PvP loop, combat feedback, game balance, demo readiness, and community features. This helped us see the big picture while keeping focused on what matters most for a competitive multiplayer experience.

Writing user stories forced us to think from each stakeholder's perspective. For a PvP game, this was especially valuable: we had to balance the needs of competitive players with casual players, while also considering testers, designers, and content creators. This exposed early trade-offs, like how flashy effects might distract from readability in fast-paced matches.

Acceptance criteria turned vague ideas into concrete checks. Instead of saying "the game should feel fair," we defined what fair means for our context—synchronized gameplay, clear upgrade choices, configurable wave parameters. This gave us a shared understanding of "done" and reduced ambiguity between team members.

Through this process, we learned that good requirements are not just documentation—they are a communication tool. Epics helped us align on priorities, user stories kept us focused on real people using our game, and acceptance criteria prevented misunderstandings before coding started. We also learned that involving different perspectives early saves time later: what seems obvious to a developer might confuse a player, and what looks cool to an artist might hurt gameplay clarity. Moving forward, we will continue thinking in terms of who we are building for and what success actually looks like.

#### 2.7 Sequence diagram
<img width="3072" height="2048" alt="image" src="https://github.com/user-attachments/assets/db218de8-2eb2-43dc-a30d-330880f0c604" />

#### 2.8 Class diagram
<img width="5124" height="5150" alt="image" src="https://github.com/user-attachments/assets/64876e13-3bcd-4e72-9c55-d65a63aded2d" />

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

### Evaluation

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



### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.

### Conclusion

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.

### Contribution Statement

- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?
