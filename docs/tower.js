const TOWER_COST = {
  tower1: 80,   // 魔法塔
  tower2: 60,   // 弓箭塔
  tower3: 120,  // 炮塔
  tower4: 100   // 冰塔
};

class Tower {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;

    this.cooldown = 0;
    this.w = 255 * uiScale;
    this.h = 285 * uiScale;

    // 默认值
    this.range = 300 * uiScale;
    this.fireRate = 30;
    this.damage = 20;
    this.splashRadius = 0;

    if (this.type === "tower1") {
      // 魔法塔：高射程，单体
      this.range = 400 * uiScale;
      this.fireRate = 50;
      this.damage = 20;

    } else if (this.type === "tower2") {
      // 弓箭/炮塔2：高射程高速单体
      this.range = 400 * uiScale;
      this.fireRate = 25;
      this.damage = 6;

    } else if (this.type === "tower3") {
      // 一级炮塔（AOE）
      this.range = 350 * uiScale;

      // 攻速：80帧 @60fps
      this.fireRate = 80;

      // 基础伤害
      this.damage = 25;

      // AOE 半径：120
      this.splashRadius = 120 * uiScale;

    } else if (this.type === "tower4") {
      // 冰塔：中等单体
      this.range = 350 * uiScale;
      this.fireRate = 40;
      this.damage = 4;
    }
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }

    let target = this.findTarget();
    if (!target || this.cooldown > 0) return;

    let fireX = this.x;
    let fireY = this.y - 95 * uiScale;

    if (this.type === "tower3") {
      // tower3 发射炮弹，命中后范围伤害
      lasers.push(
        new CannonBomb(
          fireX,
          fireY,
          target,
          this.damage,
          this.splashRadius
        )
      );
    } else {
      // 其他塔保持即时命中
      lasers.push(new Laser(fireX, fireY, target, this.type));

      if (!target.dead) {
        if (this.type === "tower1") {
          target.takeDamage(this.damage, "magic");
        } else {
          target.takeDamage(this.damage, "physical");
        }
        if (this.type === "tower4") {
            target.applySlow(0.5, 60); // 50%速度，1秒
        }
      }
    }

    this.cooldown = this.fireRate;
  }

  findTarget() {
    let nearest = null;
    let nearestDist = Infinity;

    for (let enemy of enemies) {
      if (enemy.dead || enemy.reachedEnd) continue;

      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d <= this.range && d < nearestDist) {
        nearest = enemy;
        nearestDist = d;
      }
    }

    return nearest;
  }

  display() {
    let img = tower1Img;

    if (this.type === "tower1") {
      img = tower1Img;
    } else if (this.type === "tower2") {
      img = tower2Img;
    } else if (this.type === "tower3") {
      img = tower3Img;
    } else if (this.type === "tower4") {
      img = tower4Img;
    }

    imageMode(CENTER);
    image(img, this.x, this.y - 40 * uiScale, this.w, this.h);
    imageMode(CORNER);

    // 调试攻击范围时可打开
    // noFill();
    // stroke(255, 180, 80, 120);
    // strokeWeight(2);
    // ellipse(this.x, this.y, this.range * 2, this.range * 2);
  }
}

