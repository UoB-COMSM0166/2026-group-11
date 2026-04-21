const ENEMY_TYPES = {
  green: {
    key: "green",
    file: "Green_Slime.gif",
    hp: 40,
    speed: 2.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 4,
    type: "基础",
    trait: "送钱",
    canFly: false,
    canSplit: false,
    size: 70
  },

  red: {
    key: "red",
    file: "Red_Slime.gif",
    hp: 50,
    speed: 3.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 6,
    type: "速度",
    trait: "快速",
    canFly: false,
    canSplit: false,
    size: 70
  },

  purple: {
    key: "purple",
    file: "Purple_Slime.gif",
    hp: 70,
    speed: 4.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 8,
    type: "高速",
    trait: "压节奏",
    canFly: false,
    canSplit: false,
    size: 70
  },

  black: {
    key: "black",
    file: "Black_Slime.gif",
    hp: 180,
    speed: 1.8,
    armor: 0.75,
    magicResist: 1.0,
    gold: 9,
    type: "抗性",
    trait: "低物抗",
    canFly: false,
    canSplit: false,
    size: 72
  },

  gold: {
    key: "gold",
    file: "gold_Slime.gif",
    hp: 260,
    speed: 2.5,
    armor: 0.75,
    magicResist: 1.0,
    gold: 12,
    type: "进阶",
    trait: "快+抗",
    canFly: false,
    canSplit: false,
    size: 74
  },

  glow: {
    key: "glow",
    file: "glow_Slime.gif",
    hp: 400,
    speed: 2.0,
    armor: 1.0,
    magicResist: 0.5,
    gold: 14,
    type: "抗性",
    trait: "中法抗",
    canFly: false,
    canSplit: false,
    size: 76
  },

  crystal: {
    key: "crystal",
    file: "Crystal_Slime.gif",
    hp: 400,
    speed: 2.0,
    armor: 1.0,
    magicResist: 0.25,
    gold: 16,
    type: "抗性",
    trait: "强法抗",
    canFly: false,
    canSplit: false,
    size: 76
  },

  ice_spike: {
    key: "ice_spike",
    file: "Spiked_Ice_Slime.gif",
    hp: 400,
    speed: 2.0,
    armor: 0.25,
    magicResist: 1.0,
    gold: 16,
    type: "抗性",
    trait: "强物抗",
    canFly: false,
    canSplit: false,
    size: 76
  },

  split_parent: {
    key: "split_parent",
    file: "Mother_Slime.gif",
    hp: 200,
    speed: 1.6,
    armor: 1.0,
    magicResist: 1.0,
    gold: 12,
    type: "机制",
    trait: "死亡分裂4个",
    canFly: false,
    canSplit: true,
    splitInto: "split_child",
    splitCount: 4,
    size: 84
  },

  split_child: {
    key: "split_child",
    file: "Baby_Slime.gif",
    hp: 35,
    speed: 3.5,
    armor: 1.0,
    magicResist: 1.0,
    gold: 0,
    type: "机制",
    trait: "高速爆发",
    canFly: false,
    canSplit: false,
    size: 48
  },

  dungeon: {
    key: "dungeon",
    file: "Dungeon_Slime.gif",
    hp: 600,
    speed: 1.8,
    armor: 0.75,
    magicResist: 1.0,
    gold: 40,
    type: "精英",
    trait: "高血",
    canFly: false,
    canSplit: false,
    size: 92
  },

  crimson: {
    key: "crimson",
    file: "Crimslime.gif",
    hp: 1000,
    speed: 1.8,
    armor: 0.75,
    magicResist: 1.0,
    gold: 50,
    type: "精英",
    trait: "高抗",
    canFly: false,
    canSplit: false,
    size: 94
  },

  rainbow: {
    key: "rainbow",
    file: "Rainbow_Slime.gif",
    hp: 2000,
    speed: 1.8,
    armor: 0.75,
    magicResist: 1.0,
    gold: 80,
    type: "终极",
    trait: "超高抗",
    canFly: false,
    canSplit: false,
    size: 98
  },

  fly: {
    key: "fly",
    file: "Gastropod.gif",
    hp: 80,
    speed: 3.5,
    armor: 1.0,
    magicResist: 1.0,
    gold: 7,
    type: "飞行",
    trait: "基础飞行",
    canFly: true,
    canSplit: false,
    size: 64
  },

  psychic_slug: {
    key: "psychic_slug",
    file: "Spectral_Gastropod.gif",
    hp: 150,
    speed: 2.8,
    armor: 1.0,
    magicResist: 1.0,
    gold: 10,
    type: "飞行",
    trait: "强化飞行",
    canFly: true,
    canSplit: false,
    size: 68
  }
};

class Enemy {
  constructor(path, typeKey = "green") {
    this.path = path;
    this.typeKey = typeKey;
    this.data = ENEMY_TYPES[typeKey] || ENEMY_TYPES.green;

    this.slowFactor = 1;
    this.slowTimer = 0;

    this.x = path[0].x;
    this.y = path[0].y;
    this.speed = this.data.speed * uiScale;
    this.targetIndex = 1;
    this.reachedEnd = false;

    this.w = this.data.size * uiScale;
    this.h = this.data.size * uiScale;

    this.maxHp = this.data.hp;
    this.hp = this.data.hp;
    this.dead = false;
    this.deathHandled = false;

    this.armor = this.data.armor;
    this.magicResist = this.data.magicResist;
    this.rewardGold = this.data.gold;
    this.canFly = this.data.canFly;
    this.canSplit = this.data.canSplit;
    this.splitInto = this.data.splitInto || null;
    this.splitCount = this.data.splitCount || 0;
  }

  takeDamage(baseDamage, damageType = "physical") {
    baseDamage = max(0, baseDamage);

    let multiplier = 1.0;

    if (damageType === "magic") {
      multiplier = this.magicResist == null ? 1.0 : this.magicResist;
    } else {
      multiplier = this.armor == null ? 1.0 : this.armor;
    }

    const finalDamage = max(1, baseDamage * multiplier);

    this.hp -= finalDamage;
    this.hp = constrain(this.hp, 0, this.maxHp);

    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }

    return finalDamage;
  }

  update() {
    if (this.slowTimer > 0) {
      this.slowTimer--;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowFactor = 1;
      }
    }

    if (this.reachedEnd || this.dead) return;

    if (this.targetIndex >= this.path.length) {
      this.reachedEnd = true;
      return;
    }

    let target = this.path[this.targetIndex];
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    let d = dist(this.x, this.y, target.x, target.y);

    let currentSpeed = this.speed * this.slowFactor;

    if (d <= currentSpeed) {
      this.x = target.x;
      this.y = target.y;
      this.targetIndex++;

      if (this.targetIndex >= this.path.length) {
        this.reachedEnd = true;
      }
    } else if (d > 0) {
      this.x += (dx / d) * currentSpeed;
      this.y += (dy / d) * currentSpeed;
    }
  }

  applySlow(factor, duration) {
    this.slowFactor = factor;
    this.slowTimer = duration;
  }

  displayBody() {
    if (this.dead) return;

    const enemyImg = enemyImages[this.typeKey] || enemyImages.green || enemyGif;

    push();

    if (this.slowFactor < 1) {
      tint(70, 145, 255);
    } else {
      noTint();
    }

    imageMode(CENTER);
    image(enemyImg, this.x, this.y, this.w, this.h);
    imageMode(CORNER);

    noTint();
    pop();

    if (this.slowFactor < 1) {
      push();
      translate(this.x, this.y);

      let t = frameCount * 0.06;

      noFill();
      stroke(90, 180, 255, 210);
      strokeWeight(3 * uiScale);
      ellipse(0, 0, this.w * 0.98, this.h * 0.98);

      stroke(190, 235, 255, 140);
      strokeWeight(2 * uiScale);
      ellipse(0, 0, this.w * 1.13, this.h * 1.13);

      for (let i = 0; i < 4; i++) {
        let angle = t + i * TWO_PI / 4;
        let r = this.w * 0.62;

        let px = cos(angle) * r;
        let py = sin(angle) * r;

        noStroke();
        fill(230, 245, 255, 230);
        ellipse(px, py, 7 * uiScale, 7 * uiScale);

        stroke(230, 245, 255, 230);
        strokeWeight(1.6 * uiScale);
        line(px - 4 * uiScale, py, px + 4 * uiScale, py);
        line(px, py - 4 * uiScale, px, py + 4 * uiScale);
        line(
          px - 2.8 * uiScale,
          py - 2.8 * uiScale,
          px + 2.8 * uiScale,
          py + 2.8 * uiScale
        );
        line(
          px - 2.8 * uiScale,
          py + 2.8 * uiScale,
          px + 2.8 * uiScale,
          py - 2.8 * uiScale
        );
      }

      pop();
    }
  }

  displayHealthBar() {
    if (this.dead) return;

    let safeHp = constrain(this.hp, 0, this.maxHp);
    let hpBarW = (safeHp / this.maxHp) * 50 * uiScale;

    noStroke();
    fill(255, 0, 0);
    rect(this.x - 25 * uiScale, this.y - 46 * uiScale, 50 * uiScale, 6 * uiScale);

    fill(0, 255, 0);
    rect(
      this.x - 25 * uiScale,
      this.y - 46 * uiScale,
      hpBarW,
      6 * uiScale
    );
  }

  display() {
    this.displayBody();
    this.displayHealthBar();
  }
}
