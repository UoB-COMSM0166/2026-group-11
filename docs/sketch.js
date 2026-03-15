let game = null;
let state = "menu";

const CANVAS_W = 900;
const CANVAS_H = 540;
const UI_HEIGHT = 86;
const MAP_H = CANVAS_H - UI_HEIGHT;

const TEAM = {
  PLAYER: "PLAYER",
  ENEMY: "ENEMY",
  NEUTRAL: "NEUTRAL"
};

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  textFont("monospace");
}

function draw() {
  background(25);

  if (state === "menu") {
    drawMenu();
  } else if (state === "intro") {
    drawIntro();
  } else if (state === "map") {
    drawWorldMap();
  } else if (state === "game") {
    const dt = constrain(deltaTime / 1000, 0, 0.05);
    game.update(dt);
    game.render();
  }
}

function mousePressed() {
  if (state === "menu") {
    menuMouse();
  } else if (state === "intro") {
    introMouse();
  } else if (state === "map") {
    mapMouse();
  } else if (state === "game") {
    game.mousePressed();
  }
}

function overRectCenter(x, y, w, h) {
  return (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  );
}

function drawButton(x, y, w, h, label) {
  push();
  rectMode(CENTER);

  const hover = overRectCenter(x, y, w, h);

  fill(hover ? 210 : 140);
  stroke(0);
  strokeWeight(2);
  rect(x, y, w, h, 12);

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(label, x, y);

  pop();
}

function drawMenu() {
  push();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(54);
  text("Tower Battle", width / 2, 130);

  textSize(18);
  fill(200);
  text("A simple lane strategy game", width / 2, 175);

  drawButton(width / 2, 270, 240, 64, "Start Game");
  drawButton(width / 2, 355, 240, 64, "Introduction");

  pop();
}

function menuMouse() {
  if (overRectCenter(width / 2, 270, 240, 64)) {
    state = "map";
    return;
  }

  if (overRectCenter(width / 2, 355, 240, 64)) {
    state = "intro";
  }
}

function drawIntro() {
  push();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(38);
  text("How to Play", width / 2, 85);

  textSize(18);
  fill(230);

  text(
    `1. Select a unit card at the bottom
2. Click your blue base to deploy troops
3. Capture neutral towers to control the lane
4. Destroy the enemy base to win`,
    width / 2,
    200
  );

  drawButton(width / 2, 450, 170, 52, "Back");

  pop();
}

function introMouse() {
  if (overRectCenter(width / 2, 450, 170, 52)) {
    state = "menu";
  }
}

function drawWorldMap() {
  push();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(42);
  text("World Map", width / 2, 70);

  stroke(200);
  strokeWeight(5);
  line(width / 2, 220, width / 2, 340);

  noStroke();
  drawLevelNode(width / 2, 220, "1-1");
  drawLevelNode(width / 2, 340, "1-2");

  drawButton(width / 2, 470, 170, 52, "Back");

  pop();
}

function drawLevelNode(x, y, label) {
  const hover = dist(mouseX, mouseY, x, y) < 32;

  push();
  fill(hover ? 255 : 190);
  stroke(0);
  strokeWeight(2);
  circle(x, y, 64);

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(label, x, y + 1);
  pop();
}

function mapMouse() {
  if (dist(mouseX, mouseY, width / 2, 220) < 32) {
    startLevel1();
    return;
  }

  if (dist(mouseX, mouseY, width / 2, 340) < 32) {
    startLevel2();
    return;
  }

  if (overRectCenter(width / 2, 470, 170, 52)) {
    state = "menu";
  }
}

function startLevel1() {
  game = new Game([
    createVector(220, MAP_H - 40),
    createVector(330, MAP_H - 80),
    createVector(560, MAP_H - 80),
    createVector(650, MAP_H - 180),
    createVector(650, 200),
    createVector(560, 120),
    createVector(330, 120),
    createVector(220, 60)
  ]);

  game.levelName = "1-1";
  game.enemyGold = 80;
  game.goldRate = 8;
  game.aiSpawnRate = 6;

  state = "game";
}

function startLevel2() {
  game = new Game([
    createVector(220, MAP_H - 45),
    createVector(360, MAP_H - 120),
    createVector(560, MAP_H - 55),
    createVector(690, MAP_H - 185),
    createVector(610, 230),
    createVector(450, 140),
    createVector(300, 110),
    createVector(220, 60)
  ]);

  game.levelName = "1-2";
  game.enemyGold = 150;
  game.goldRate = 10;
  game.aiSpawnRate = 3.2;

  state = "game";
}

class Game {
  constructor(path) {
    this.path = path;

    this.playerBase = new Base(this.path[0], TEAM.PLAYER);
    this.enemyBase = new Base(this.path[this.path.length - 1], TEAM.ENEMY);

    const towerPts = this.getTowerIndicesForPath(path.length);
    this.towers = towerPts.map((i, id) => new TowerNode(id, this.path[i].copy()));

    this.units = [];
    this.ui = new UI(this);

    this.playerGold = 80;
    this.enemyGold = 80;
    this.goldRate = 8;

    this.aiTimer = 0;
    this.aiSpawnRate = 6;

    this.victory = false;
    this.defeat = false;

    this.levelName = "";
  }

  getTowerIndicesForPath(pathLength) {
    if (pathLength >= 8) return [1, 3, 5, 6];
    if (pathLength >= 6) return [1, 3, 4];
    return [1, 2, 3];
  }

  update(dt) {
    if (this.victory || this.defeat) return;

    this.playerGold += this.goldRate * dt;
    this.enemyGold += this.goldRate * dt;

    for (const t of this.towers) t.update(dt, this);
    for (const u of this.units) u.update(dt, this);

    this.units = this.units.filter((u) => !u.dead);

    this.aiTimer += dt;
    if (this.aiTimer > this.aiSpawnRate) {
      this.trySpawnEnemy();
      this.aiTimer = 0;
    }

    if (this.enemyBase.hp <= 0) this.victory = true;
    if (this.playerBase.hp <= 0) this.defeat = true;
  }

  render() {
    this.drawLane();
    this.drawTopBar();

    this.playerBase.draw();
    this.enemyBase.draw();

    for (const t of this.towers) t.draw();
    for (const u of this.units) u.draw();

    this.ui.draw();

    if (this.victory) {
      this.drawEndOverlay("Victory!");
    }

    if (this.defeat) {
      this.drawEndOverlay("Defeat");
    }
  }

  drawTopBar() {
    push();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(18);
    text(`Level ${this.levelName}`, 18, 14);
    pop();
  }

  drawLane() {
    push();
    stroke(105);
    strokeWeight(36);
    noFill();

    beginShape();
    for (const p of this.path) {
      vertex(p.x, p.y);
    }
    endShape();

    strokeWeight(1);
    pop();
  }

  drawEndOverlay(message) {
    push();

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(46);
    text(message, width / 2, MAP_H / 2 - 10);

    drawButton(width / 2, MAP_H / 2 + 60, 220, 52, "Return to Map");

    pop();
  }

  mousePressed() {
    if (this.victory || this.defeat) {
      if (overRectCenter(width / 2, MAP_H / 2 + 60, 220, 52)) {
        state = "map";
      }
      return;
    }

    if (dist(mouseX, mouseY, this.playerBase.pos.x, this.playerBase.pos.y) < 50) {
      this.trySpawnPlayer();
      return;
    }

    this.ui.mouse(mouseX, mouseY);
  }

  trySpawnPlayer() {
    const cost = Unit.costs[this.ui.selected];
    if (this.playerGold >= cost) {
      this.playerGold -= cost;
      this.units.push(
        new Unit(
          this,
          TEAM.PLAYER,
          this.ui.selected,
          this.playerBase.pos.copy(),
          0
        )
      );
    }
  }

  trySpawnEnemy() {
    const type = floor(random(4));
    const cost = Unit.costs[type];

    if (this.enemyGold >= cost) {
      this.enemyGold -= cost;
      this.units.push(
        new Unit(
          this,
          TEAM.ENEMY,
          type,
          this.enemyBase.pos.copy(),
          this.path.length - 1
        )
      );
    }
  }
}

class Base {
  constructor(pos, team) {
    this.pos = pos.copy();
    this.team = team;
    this.hp = 1500;
    this.maxhp = this.hp;
  }

  draw() {
    push();
    rectMode(CENTER);
    fill(this.team === TEAM.PLAYER ? "#4da6ff" : "#ff5c5c");
    rect(this.pos.x, this.pos.y, 70, 70, 10);
    pop();

    push();
    rectMode(CORNER);

    const w = 70;
    const ratio = constrain(this.hp / this.maxhp, 0, 1);

    fill(255, 0, 0);
    rect(this.pos.x - w / 2, this.pos.y - 50, w, 6);

    fill(0, 255, 0);
    rect(this.pos.x - w / 2, this.pos.y - 50, w * ratio, 6);
    pop();
  }
}

class TowerNode {
  constructor(id, pos) {
    this.id = id;
    this.pos = pos;
    this.owner = TEAM.NEUTRAL;
    this.capture = 0;
  }

  update(dt, game) {
    for (const u of game.units) {
      if (dist(u.pos.x, u.pos.y, this.pos.x, this.pos.y) < 45) {
        this.capture += (u.team === TEAM.PLAYER ? 1 : -1) * dt * 20;
      }
    }

    this.capture = constrain(this.capture, -100, 100);

    if (this.capture > 70) this.owner = TEAM.PLAYER;
    if (this.capture < -70) this.owner = TEAM.ENEMY;
  }

  draw() {
    push();
    fill(
      this.owner === TEAM.PLAYER
        ? "#55aaff"
        : this.owner === TEAM.ENEMY
        ? "#ff6666"
        : "#888"
    );
    circle(this.pos.x, this.pos.y, 42);
    pop();
  }
}

class Unit {
  static costs = [20, 35, 18, 40];

  constructor(game, team, type, startPos, startIndex) {
    this.game = game;
    this.team = team;
    this.type = type;
    this.pos = startPos.copy();
    this.dead = false;

    const stats = [
      { hp: 120, speed: 1.2, dmg: 0.6, range: 18 },
      { hp: 220, speed: 0.7, dmg: 0.5, range: 18 },
      { hp: 80, speed: 1.9, dmg: 0.45, range: 18 },
      { hp: 70, speed: 0.9, dmg: 1.2, range: 80 }
    ];

    this.hp = stats[type].hp;
    this.maxhp = this.hp;
    this.speed = stats[type].speed * 60;
    this.dmg = stats[type].dmg;
    this.range = stats[type].range;
    this.pathIndex = startIndex;
  }

  update(dt, game) {
    for (const u of game.units) {
      if (u === this || u.team === this.team) continue;

      if (dist(this.pos.x, this.pos.y, u.pos.x, u.pos.y) < this.range) {
        u.hp -= this.dmg;
        if (u.hp <= 0) u.dead = true;
        return;
      }
    }

    const base = this.team === TEAM.PLAYER ? game.enemyBase : game.playerBase;

    if (dist(this.pos.x, this.pos.y, base.pos.x, base.pos.y) < this.range) {
      base.hp -= this.dmg;
      return;
    }

    const next = this.team === TEAM.PLAYER
      ? this.pathIndex + 1
      : this.pathIndex - 1;

    if (next < 0 || next >= game.path.length) return;

    const target = game.path[next];
    const dir = p5.Vector.sub(target, this.pos);

    if (dir.mag() < this.speed * dt) {
      this.pathIndex = next;
    } else {
      dir.normalize().mult(this.speed * dt);
      this.pos.add(dir);
    }
  }

  draw() {
    push();
    fill(this.team === TEAM.PLAYER ? "#66b3ff" : "#ff7777");
    translate(this.pos.x, this.pos.y);

    if (this.type === 0) {
      ellipse(0, 0, 14);
    }

    if (this.type === 1) {
      rectMode(CENTER);
      rect(0, 0, 16, 16);
    }

    if (this.type === 2) {
      triangle(-8, 8, 8, 8, 0, -8);
    }

    if (this.type === 3) {
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 12, 12);
    }

    pop();

    push();
    rectMode(CORNER);

    const w = 18;
    const ratio = constrain(this.hp / this.maxhp, 0, 1);

    fill(255, 0, 0);
    rect(this.pos.x - w / 2, this.pos.y - 18, w, 3);

    fill(0, 255, 0);
    rect(this.pos.x - w / 2, this.pos.y - 18, w * ratio, 3);

    pop();
  }
}

class UI {
  constructor(game) {
    this.game = game;
    this.selected = 0;
    this.names = ["Infantry", "Tank", "Scout", "Sniper"];
  }

  mouse(mx, my) {
    if (my < MAP_H) return;

    const slotW = width / 4;

    for (let i = 0; i < 4; i++) {
      const x = i * slotW;
      if (mx > x && mx < x + slotW) {
        this.selected = i;
      }
    }
  }

  draw() {
    push();
    rectMode(CORNER);

    fill(28);
    rect(0, MAP_H, width, UI_HEIGHT);

    // Gold 放左上角
    fill(255);
    textAlign(LEFT, TOP);
    textSize(18);
    text("Gold: " + floor(this.game.playerGold), 14, MAP_H + 8);

    const slotW = width / 4;
    const cardMarginX = 10;
    const cardY = MAP_H + 28;
    const cardW = slotW - cardMarginX * 2;
    const cardH = 48;

    for (let i = 0; i < 4; i++) {
      const slotX = i * slotW;
      const cardX = slotX + cardMarginX;

      fill(i === this.selected ? 220 : 125);
      stroke(0);
      strokeWeight(2);
      rect(cardX, cardY, cardW, cardH, 10);

      noStroke();
      fill(0);

      const cx = cardX + cardW / 2;

      
      push();
      translate(cx, cardY + 13);

      if (i === 0) {
        ellipse(0, 0, 12);
      }
      if (i === 1) {
        rectMode(CENTER);
        rect(0, 0, 12, 12);
      }
      if (i === 2) {
        triangle(-6, 6, 6, 6, 0, -6);
      }
      if (i === 3) {
        rotate(PI / 4);
        rectMode(CENTER);
        rect(0, 0, 10, 10);
      }

      pop();

      fill(0);
      textAlign(CENTER, CENTER);

      textSize(12);
      text(this.names[i], cx, cardY + 28);

      textSize(11);
      text("£" + Unit.costs[i], cx, cardY + 40);
    }

    pop();
  }
}
