# 2026-group-11
2026 COMSM0166 group 11

# COMSM0166 Project Template
A project template for the Software Engineering Discipline and Practice module (COMSM0166).

## Info

This is the template for your group project repo/report. We'll be setting up your repo and assigning you to it after the group forming activity. You can delete this info section, but please keep the rest of the repo structure intact.

You will be developing your game using [P5.js](https://p5js.org) a javascript library that provides you will all the tools you need to make your game. However, we won't be teaching you javascript, this is a chance for you and your team to learn a (friendly) new language and framework quickly, something you will almost certainly have to do with your summer project and in future. There is a lot of documentation online, you can start with:

- [P5.js tutorials](https://p5js.org/tutorials/) 
- [Coding Train P5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js) course - go here for enthusiastic video tutorials from Dan Shiffman (recommended!)

## Your Game (change to title of your game)

STRAPLINE. Add an exciting one sentence description of your game here.

IMAGE. Add an image of your game here, keep this updated with a snapshot of your latest development.

LINK. Add a link here to your deployed game, you can also make the image above link to your game if you wish. Your game lives in the [/docs](/docs) folder, and is published using Github pages. 

VIDEO. Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

![image](https://github.com/user-attachments/assets/cf4abf93-01fc-4738-b1ac-b76788c01ac6)

- Group member 1, Yi Lin, adai08823@gmail.com, role
- Group member 2, Chuhang Li, zgndylch@163.com, role
- Group member 3, Yuxuan Cheng, chengyx0921@outlook.com, role
- Group member 4, Wen Liang, fd21102@bristol.ac.uk, role
- Group member 5, Zishen Xu, chuichisum@163.com, role


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
