class CannonBomb {
  constructor(x, y, target, damage, splashRadius) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    this.target = target;
    this.damage = damage;
    this.splashRadius = splashRadius;

    this.t = 0;
    this.speed = 0.055;
    this.arcHeight = 90 * uiScale;

    this.dead = false;
    this.exploded = false;

    this.targetX = target ? target.x : x;
    this.targetY = target ? target.y : y;
  }

  update() {
    if (this.dead) return;

    this.t += this.speed;

    // 跟踪目标当前位置，让炮弹更容易打到敌人脚下
    if (this.target && !this.target.dead) {
      this.targetX = this.target.x;
      this.targetY = this.target.y + 10 * uiScale;
    }

    if (this.t >= 1) {
      this.t = 1;
      this.x = this.targetX;
      this.y = this.targetY;
      this.explode();
      return;
    }

    this.x = lerp(this.startX, this.targetX, this.t);
    this.y =
      lerp(this.startY, this.targetY, this.t) -
      sin(this.t * PI) * this.arcHeight;
  }

  explode() {
    if (this.exploded) return;
    this.exploded = true;

    for (let enemy of enemies) {
      if (enemy.dead || enemy.reachedEnd) continue;

      let d = dist(this.x, this.y, enemy.x, enemy.y);

      if (d <= this.splashRadius) {
        let rate = 0.25;

        // 分段AOE伤害
        if (d < this.splashRadius * 0.4) {
          rate = 1.0;     // 内圈满伤：25
        } else if (d < this.splashRadius * 0.75) {
          rate = 0.6;     // 中圈：15
        } else {
          rate = 0.25;    // 外圈：6.25
        }

        enemy.takeDamage(this.damage * rate, "physical");
      }
    }

    lasers.push(new ExplosionEffect(this.x, this.y, this.splashRadius));
    this.dead = true;
  }

  display() {
    if (this.dead) return;

    push();

    noStroke();

    // 炮弹主体
    fill(35, 35, 35);
    ellipse(this.x, this.y, 18 * uiScale, 18 * uiScale);

    // 炮弹高光
    fill(90, 90, 90);
    ellipse(this.x - 3 * uiScale, this.y - 3 * uiScale, 5 * uiScale, 5 * uiScale);

    // 阴影
    fill(0, 0, 0, 60);
    ellipse(this.x, this.y + 6 * uiScale, 12 * uiScale, 5 * uiScale);

    pop();
  }

  isDead() {
    return this.dead;
  }
}

class ExplosionEffect {
  constructor(x, y, splashRadius) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 24;
    this.dead = false;
    this.splashRadius = splashRadius;

    this.ringMax = max(70 * uiScale, splashRadius * 1.2);
    this.flashMax = 70 * uiScale;

    this.particles = [];
    this.smokes = [];

    // 泥土/碎片粒子
    for (let i = 0; i < 18; i++) {
      let angle = random(TWO_PI);
      let speed = random(2.5, 7.5) * uiScale;

      this.particles.push({
        x: x,
        y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.5, 1.8) * uiScale,
        size: random(5, 10) * uiScale,
        alpha: 220
      });
    }

    // 烟雾粒子
    for (let i = 0; i < 10; i++) {
      this.smokes.push({
        x: x + random(-10, 10) * uiScale,
        y: y + random(-8, 8) * uiScale,
        vx: random(-0.8, 0.8) * uiScale,
        vy: random(-1.8, -0.4) * uiScale,
        size: random(24, 38) * uiScale,
        alpha: 150
      });
    }
  }

  update() {
    this.life++;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14 * uiScale;
      p.alpha -= 13;
      p.size *= 0.96;
    }

    for (let s of this.smokes) {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 5;
      s.size *= 1.02;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    let t = this.life / this.maxLife;
    let fade = 1 - t;

    push();

    // 地面焦痕
    noStroke();
    fill(30, 20, 20, 80 * fade);
    ellipse(
      this.x,
      this.y + 8 * uiScale,
      lerp(35 * uiScale, 60 * uiScale, min(t * 1.5, 1)),
      lerp(18 * uiScale, 28 * uiScale, min(t * 1.5, 1))
    );

    // 爆心亮光
    fill(255, 245, 210, 220 * fade);
    ellipse(
      this.x,
      this.y,
      lerp(this.flashMax, 14 * uiScale, t),
      lerp(this.flashMax * 0.8, 10 * uiScale, t)
    );

    fill(255, 165, 60, 170 * fade);
    ellipse(
      this.x,
      this.y,
      lerp(this.flashMax * 1.35, 20 * uiScale, t),
      lerp(this.flashMax, 14 * uiScale, t)
    );

    // 冲击波
    noFill();
    stroke(255, 220, 140, 180 * fade);
    strokeWeight((4 * fade + 1) * uiScale);
    ellipse(this.x, this.y, lerp(18 * uiScale, this.ringMax, t));

    // 内圈火焰
    stroke(255, 150, 40, 130 * fade);
    strokeWeight((8 * fade) * uiScale);
    ellipse(this.x, this.y, lerp(12 * uiScale, this.ringMax * 0.6, t * 0.8));

    // 碎片
    noStroke();
    for (let p of this.particles) {
      fill(120, 75, 35, max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }

    // 烟雾
    for (let s of this.smokes) {
      fill(90, 90, 90, max(0, s.alpha));
      ellipse(s.x, s.y, s.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
}

class Laser {
  constructor(x, y, target, towerType = "tower1") {
    this.x = x;
    this.y = y;
    this.target = target;
    this.towerType = towerType;
    this.life = 7;

    // 给 tower1 一点随机扰动，让激光不那么死
    this.seed = random(1000);
  }

  update() {
    this.life--;
  }

  display() {
    if (!this.target || this.target.dead) return;

    if (this.towerType === "tower1") {
      this.drawMagicBeam();
    } else if (this.towerType === "tower2") {
      this.drawCannonLine();
    } else if (this.towerType === "tower4") {
      this.drawIceBeam();
    } else {
      this.drawMagicBeam();
    }
  }

  drawMagicBeam() {
    let tx = this.target.x;
    let ty = this.target.y;

    let dx = tx - this.x;
    let dy = ty - this.y;
    let len = dist(this.x, this.y, tx, ty);

    let nx = 0;
    let ny = 0;
    if (len > 0.001) {
      nx = -dy / len;
      ny = dx / len;
    }

    let pulse = sin(frameCount * 0.6 + this.seed);
    let offset = pulse * 3 * uiScale;

    push();

    // ===== 起点能量 =====
    noStroke();
    fill(120, 60, 255, 90);
    ellipse(this.x, this.y, 40 * uiScale);

    fill(255, 240, 255, 160);
    ellipse(this.x, this.y, 16 * uiScale);

    // ===== 外层光 =====
    stroke(90, 40, 220, 120);
    strokeWeight(22 * uiScale);
    line(this.x, this.y, tx, ty);

    // ===== 中层 =====
    stroke(160, 90, 255, 200);
    strokeWeight(12 * uiScale);
    line(this.x, this.y, tx, ty);

    // ===== 内核 =====
    stroke(255, 240, 255, 240);
    strokeWeight(4 * uiScale);
    line(this.x, this.y, tx, ty);

    // ===== 魔法扰动线 =====
    stroke(200, 150, 255, 100);
    strokeWeight(2 * uiScale);
    line(
      this.x + nx * offset,
      this.y + ny * offset,
      tx - nx * offset,
      ty - ny * offset
    );

    // ===== 命中光点 =====
    noStroke();
    fill(200, 120, 255, 120);
    ellipse(tx, ty, 26 * uiScale);

    fill(255, 255, 255, 220);
    ellipse(tx, ty, 10 * uiScale);

    pop();
  }

  drawCannonLine() {
    stroke(255, 180, 80, 190);
    strokeWeight(12 * uiScale);
    line(this.x, this.y, this.target.x, this.target.y);

    stroke(255, 240, 180, 220);
    strokeWeight(4 * uiScale);
    line(this.x, this.y, this.target.x, this.target.y);

    noStroke();
    fill(255, 190, 120, 180);
    ellipse(this.target.x, this.target.y, 16 * uiScale);
  }

  drawIceBeam() {
    stroke(100, 220, 255, 210);
    strokeWeight(18 * uiScale);
    line(this.x, this.y, this.target.x, this.target.y);

    stroke(220, 250, 255, 240);
    strokeWeight(7 * uiScale);
    line(this.x, this.y, this.target.x, this.target.y);

    noStroke();
    fill(180, 240, 255, 170);
    ellipse(this.target.x, this.target.y, 18 * uiScale);
  }

  isDead() {
    return this.life <= 0;
  }
}

class MagicHitEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 16;
    this.dead = false;

    this.particles = [];

    for (let i = 0; i < 10; i++) {
      let angle = random(TWO_PI);
      let speed = random(1.5, 4);

      this.particles.push({
        x: x,
        y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(4, 8),
        alpha: 200
      });
    }
  }

  update() {
    this.life++;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.alpha -= 12;
      p.size *= 0.95;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    push();

    noStroke();

    for (let p of this.particles) {
      fill(180, 120, 255, max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
}

class ArrowHitEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 10;
    this.dead = false;

    this.particles = [];

    for (let i = 0; i < 6; i++) {
      let angle = random(TWO_PI);
      let speed = random(1.5, 4);

      this.particles.push({
        x: x,
        y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(3, 6),
        alpha: 220
      });
    }
  }

  update() {
    this.life++;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.alpha -= 25;
      p.size *= 0.9;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    push();
    noStroke();

    fill(255, 220, 150, 150);
    ellipse(this.x, this.y, 12 * uiScale);

    for (let p of this.particles) {
      fill(200, 140, 80, max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
}