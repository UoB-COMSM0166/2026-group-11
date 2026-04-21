window.CannonBomb = class CannonBomb {
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
    this.y = lerp(this.startY, this.targetY, this.t) - sin(this.t * PI) * this.arcHeight;
  }

  explode() {
    if (this.exploded) return;
    this.exploded = true;

    for (let enemy of enemies) {
    if (enemy.dead || enemy.reachedEnd) continue;
    if (enemy.canFly) continue;

    let d = dist(this.x, this.y, enemy.x, enemy.y);

    if (d <= this.splashRadius) {
      let rate = 0.25;

      if (d < this.splashRadius * 0.4) {
        rate = 1.0;
      } else if (d < this.splashRadius * 0.75) {
        rate = 0.6;
      } else {
        rate = 0.25;
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

    fill(35, 35, 35);
    ellipse(this.x, this.y, 18 * uiScale, 18 * uiScale);

    fill(90, 90, 90);
    ellipse(this.x - 3 * uiScale, this.y - 3 * uiScale, 5 * uiScale, 5 * uiScale);

    fill(0, 0, 0, 60);
    ellipse(this.x, this.y + 6 * uiScale, 12 * uiScale, 5 * uiScale);

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.ExplosionEffect = class ExplosionEffect {
  constructor(x, y, splashRadius) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 24;
    this.dead = false;
    this.splashRadius = splashRadius;

    this.ringMax = Math.max(70 * uiScale, splashRadius * 1.2);
    this.flashMax = 70 * uiScale;

    this.particles = [];
    this.smokes = [];

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

    noStroke();
    fill(30, 20, 20, 80 * fade);
    ellipse(
      this.x,
      this.y + 8 * uiScale,
      lerp(35 * uiScale, 60 * uiScale, Math.min(t * 1.5, 1)),
      lerp(18 * uiScale, 28 * uiScale, Math.min(t * 1.5, 1))
    );

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

    noFill();
    stroke(255, 220, 140, 180 * fade);
    strokeWeight((4 * fade + 1) * uiScale);
    ellipse(this.x, this.y, lerp(18 * uiScale, this.ringMax, t));

    stroke(255, 150, 40, 130 * fade);
    strokeWeight((8 * fade) * uiScale);
    ellipse(this.x, this.y, lerp(12 * uiScale, this.ringMax * 0.6, t * 0.8));

    noStroke();
    for (let p of this.particles) {
      fill(120, 75, 35, Math.max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }

    for (let s of this.smokes) {
      fill(90, 90, 90, Math.max(0, s.alpha));
      ellipse(s.x, s.y, s.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.ArrowProjectile = class ArrowProjectile {
  constructor(startX, startY, target, damage) {
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;

    this.target = target;
    this.damage = damage;

    this.t = 0;
    this.speed = 0.22; // 保持你现在的速度
    this.dead = false;
    this.life = 999;

    this.hitX = target ? target.x : startX;
    this.hitY = target ? target.y - 6 * uiScale : startY;

    this.angle = atan2(this.hitY - this.startY, this.hitX - this.startX);
    this.trail = [];
  }

  update() {
    if (this.dead) return;

    this.t += this.speed;

    if (this.target && !this.target.dead && !this.target.reachedEnd) {
      this.hitX = this.target.x;
      this.hitY = this.target.y - 6 * uiScale;
    }

    this.trail.push({ x: this.x, y: this.y, a: 140 });
    if (this.trail.length > 7) this.trail.shift();

    for (let p of this.trail) {
      p.a *= 0.8;
    }

    let tt = Math.min(this.t, 1);

    this.x = lerp(this.startX, this.hitX, tt);
    this.y = lerp(this.startY, this.hitY, tt) - sin(tt * PI) * (10 * uiScale);

    this.angle = atan2(this.hitY - this.startY, this.hitX - this.startX);
    this.life--;

    if (this.t >= 1) {
      if (this.target && !this.target.dead && !this.target.reachedEnd) {
        this.target.takeDamage(this.damage, "physical");
      }

      lasers.push(new ArrowHitEffect(this.x, this.y));

      this.dead = true;
      this.life = 0;
    }
  }

  display() {
    if (this.dead) return;

    push();

    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      fill(255, 210, 120, p.a);
      ellipse(p.x, p.y, (7 + i * 1.4) * uiScale);
    }

    translate(this.x, this.y);
    rotate(this.angle);

    // 箭尾外层
    fill(220, 70, 70, 230);
    triangle(
      -24 * uiScale, 0,
      -38 * uiScale, -11 * uiScale,
      -38 * uiScale, 11 * uiScale
    );

    // 箭尾内层高光
    fill(255, 220, 220, 180);
    triangle(
      -20 * uiScale, 0,
      -31 * uiScale, -7 * uiScale,
      -31 * uiScale, 7 * uiScale
    );

    // 箭杆阴影
    stroke(90, 55, 25);
    strokeWeight(6 * uiScale);
    line(-22 * uiScale, 0, 16 * uiScale, 0);

    // 箭杆高光
    stroke(145, 100, 55);
    strokeWeight(3.5 * uiScale);
    line(-20 * uiScale, 0, 16 * uiScale, 0);

    // 箭头主体
    noStroke();
    fill(210, 220, 235);
    triangle(
      18 * uiScale, 0,
      4 * uiScale, -9 * uiScale,
      4 * uiScale, 9 * uiScale
    );

    // 箭头高光
    fill(255, 255, 255, 140);
    triangle(
      13 * uiScale, 0,
      4 * uiScale, -4 * uiScale,
      4 * uiScale, 4 * uiScale
    );

    // 箭身发光
    fill(255, 230, 160, 70);
    ellipse(-2 * uiScale, 0, 24 * uiScale, 10 * uiScale);

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.ArrowHitEffect = class ArrowHitEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 10;
    this.dead = false;
    this.maxLife = 10;
  }

  update() {
    this.life--;
    if (this.life <= 0) {
      this.dead = true;
    }
  }

  display() {
    let t = 1 - this.life / this.maxLife;
    let fade = this.life / this.maxLife;

    push();
    translate(this.x, this.y);

    noFill();
    stroke(255, 230, 180, 180 * fade);
    strokeWeight(2.5 * uiScale);
    ellipse(0, 0, lerp(8 * uiScale, 24 * uiScale, t));

    stroke(210, 210, 210, 220 * fade);
    line(-8 * uiScale, -8 * uiScale, 8 * uiScale, 8 * uiScale);
    line(-8 * uiScale, 8 * uiScale, 8 * uiScale, -8 * uiScale);

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.Laser = class Laser {
  constructor(x, y, target, towerType = "tower1") {
    this.x = x;
    this.y = y;
    this.target = target;
    this.towerType = towerType;
    this.life = 7;
    this.seed = random(1000);

    // 记录最后一次有效命中点
    this.hitX = target ? target.x : x;
    this.hitY = target ? target.y : y;
  }

  update() {
    if (this.target && !this.target.dead && !this.target.reachedEnd) {
      this.hitX = this.target.x;
      this.hitY = this.target.y;
    }

    this.life--;
  }

  display() {
    if (typeof this.hitX === "undefined" || typeof this.hitY === "undefined") return;

    if (this.towerType === "tower1") {
      this.drawMagicBeam(this.hitX, this.hitY);
    } else if (this.towerType === "tower2") {
      this.drawCannonLine(this.hitX, this.hitY);
    } else if (this.towerType === "tower4") {
      this.drawIceBeam(this.hitX, this.hitY);
    } else {
      this.drawMagicBeam(this.hitX, this.hitY);
    }
  }

  drawMagicBeam(tx, ty) {
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

    noStroke();
    fill(120, 60, 255, 90);
    ellipse(this.x, this.y, 40 * uiScale);

    fill(255, 240, 255, 160);
    ellipse(this.x, this.y, 16 * uiScale);

    stroke(90, 40, 220, 120);
    strokeWeight(22 * uiScale);
    line(this.x, this.y, tx, ty);

    stroke(160, 90, 255, 200);
    strokeWeight(12 * uiScale);
    line(this.x, this.y, tx, ty);

    stroke(255, 240, 255, 240);
    strokeWeight(4 * uiScale);
    line(this.x, this.y, tx, ty);

    stroke(200, 150, 255, 100);
    strokeWeight(2 * uiScale);
    line(
      this.x + nx * offset,
      this.y + ny * offset,
      tx - nx * offset,
      ty - ny * offset
    );

    noStroke();
    fill(200, 120, 255, 120);
    ellipse(tx, ty, 26 * uiScale);

    fill(255, 255, 255, 220);
    ellipse(tx, ty, 10 * uiScale);

    pop();
  }

  drawCannonLine(tx, ty) {
    stroke(255, 180, 80, 190);
    strokeWeight(12 * uiScale);
    line(this.x, this.y, tx, ty);

    stroke(255, 240, 180, 220);
    strokeWeight(4 * uiScale);
    line(this.x, this.y, tx, ty);

    noStroke();
    fill(255, 190, 120, 180);
    ellipse(tx, ty, 16 * uiScale);
  }

  drawIceBeam(tx, ty) {
    stroke(100, 220, 255, 210);
    strokeWeight(18 * uiScale);
    line(this.x, this.y, tx, ty);

    stroke(220, 250, 255, 240);
    strokeWeight(7 * uiScale);
    line(this.x, this.y, tx, ty);

    noStroke();
    fill(180, 240, 255, 170);
    ellipse(tx, ty, 18 * uiScale);
  }

  isDead() {
    return this.life <= 0;
  }
};

window.MagicHitEffect = class MagicHitEffect {
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
        size: random(3, 6),
        alpha: 180
      });
    }
  }

  update() {
    this.life++;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 12;
      p.size *= 0.94;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    let t = this.life / this.maxLife;
    let alpha = 1 - t;

    push();
    noFill();
    stroke(180, 90, 255, 180 * alpha);
    strokeWeight(3);
    ellipse(this.x, this.y, lerp(10, 42, t));

    noStroke();
    fill(220, 160, 255, 120 * alpha);
    ellipse(this.x, this.y, lerp(12, 28, t));

    for (let p of this.particles) {
      fill(220, 160, 255, Math.max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }
    pop();
  }

  isDead() {
    return this.dead;
  }
};