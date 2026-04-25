// Shared attack colors keep tower effects readable across all maps.
const TOWER_ATTACK_COLORS = {
  tower1: {
    main: [155, 75, 255],
    glow: [215, 155, 255],
    hit: [245, 215, 255],
    dark: [80, 35, 150]
  },
  tower2: {
    main: [245, 180, 35],
    glow: [255, 225, 95],
    hit: [255, 245, 180],
    dark: [135, 78, 20]
  },
  tower3: {
    main: [235, 80, 25],
    glow: [255, 150, 55],
    hit: [255, 230, 150],
    dark: [105, 35, 18]
  },
  tower4: {
    main: [30, 145, 255],
    glow: [120, 225, 255],
    hit: [220, 250, 255],
    dark: [20, 95, 195]
  }
};

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
    this.spin = random(TWO_PI);
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

    // Cannon damage resolves on explosion so the splash radius matches the visible burst.
    const targets = typeof getTowerTargetCandidates === "function" ? getTowerTargetCandidates() : enemies;
    for (let enemy of targets) {
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
    const c = TOWER_ATTACK_COLORS.tower3;

    const angle = atan2(this.targetY - this.startY, this.targetX - this.startX);
    const heat = 1 - constrain(this.t, 0, 1);

    push();
    noStroke();

    fill(30, 20, 16, 65);
    ellipse(this.x - 8 * uiScale, this.y + 13 * uiScale, 42 * uiScale, 16 * uiScale);

    for (let i = 0; i < 3; i++) {
      const smokeT = (i + 1) / 3;
      const sx = this.x - cos(angle) * (26 + i * 13) * uiScale;
      const sy = this.y - sin(angle) * (26 + i * 13) * uiScale + 4 * uiScale;
      fill(90, 80, 70, 42 * heat * (1 - i * 0.18));
      ellipse(sx, sy, (24 - i * 3) * uiScale, (14 - i * 2) * uiScale);
      fill(c.glow[0], c.glow[1], c.glow[2], 34 * heat * (1 - smokeT * 0.35));
      ellipse(sx + 5 * uiScale, sy - 2 * uiScale, (14 - i * 2) * uiScale, (8 - i) * uiScale);
    }

    push();
    translate(this.x, this.y);
    rotate(angle + sin(this.spin + this.t * TWO_PI * 2) * 0.25);

    fill(55, 52, 50, 245);
    ellipse(0, 0, 50 * uiScale, 34 * uiScale);
    fill(c.dark[0], c.dark[1], c.dark[2], 210);
    ellipse(-9 * uiScale, 6 * uiScale, 34 * uiScale, 17 * uiScale);
    fill(c.main[0], c.main[1], c.main[2], 180);
    ellipse(10 * uiScale, -5 * uiScale, 24 * uiScale, 13 * uiScale);
    fill(c.hit[0], c.hit[1], c.hit[2], 155);
    ellipse(18 * uiScale, -8 * uiScale, 10 * uiScale, 6 * uiScale);
    pop();

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

    this.ringMax = Math.max(90 * uiScale, splashRadius * 1.35);
    this.flashMax = 92 * uiScale;

    this.particles = [];
    this.smokes = [];

    for (let i = 0; i < 24; i++) {
      let angle = random(TWO_PI);
      let speed = random(3.2, 9.2) * uiScale;

      this.particles.push({
        x: x,
        y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.5, 1.8) * uiScale,
        size: random(5, 13) * uiScale,
        alpha: 235
      });
    }

    for (let i = 0; i < 14; i++) {
      this.smokes.push({
        x: x + random(-10, 10) * uiScale,
        y: y + random(-8, 8) * uiScale,
        vx: random(-1.3, 1.3) * uiScale,
        vy: random(-2.2, -0.5) * uiScale,
        size: random(28, 52) * uiScale,
        alpha: 170
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

    fill(255, 245, 210, 245 * fade);
    ellipse(
      this.x,
      this.y,
      lerp(this.flashMax, 14 * uiScale, t),
      lerp(this.flashMax * 0.8, 10 * uiScale, t)
    );

    fill(255, 145, 45, 205 * fade);
    ellipse(
      this.x,
      this.y,
      lerp(this.flashMax * 1.55, 20 * uiScale, t),
      lerp(this.flashMax * 1.12, 14 * uiScale, t)
    );

    noFill();
    stroke(255, 225, 145, 210 * fade);
    strokeWeight((6 * fade + 1.2) * uiScale);
    ellipse(this.x, this.y, lerp(18 * uiScale, this.ringMax, t));

    stroke(255, 115, 35, 150 * fade);
    strokeWeight((10 * fade) * uiScale);
    ellipse(this.x, this.y, lerp(12 * uiScale, this.ringMax * 0.72, t * 0.85));

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

window.IceBurstEffect = class IceBurstEffect {
  constructor(x, y, splashRadius) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 26;
    this.dead = false;
    this.ringMax = Math.max(70 * uiScale, splashRadius * 1.05);
    this.shards = [];

    for (let i = 0; i < 16; i++) {
      const angle = random(TWO_PI);
      const speed = random(2.0, 6.0) * uiScale;
      this.shards.push({
        x,
        y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(5, 11) * uiScale,
        alpha: 220,
        rot: random(TWO_PI),
        rotSpeed: random(-0.22, 0.22)
      });
    }
  }

  update() {
    // Short-lived hit effects prevent visual clutter during heavy waves.
    this.life++;
    for (const shard of this.shards) {
      shard.x += shard.vx;
      shard.y += shard.vy;
      shard.vx *= 0.94;
      shard.vy *= 0.94;
      shard.alpha -= 11;
      shard.rot += shard.rotSpeed;
    }
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    const t = this.life / this.maxLife;
    const fade = 1 - t;
    const c = TOWER_ATTACK_COLORS.tower3;

    push();
    blendMode(ADD);
    noFill();
    stroke(c.main[0], c.main[1], c.main[2], 230 * fade);
    strokeWeight((5.5 * fade + 1.5) * uiScale);
    ellipse(this.x, this.y, lerp(20 * uiScale, this.ringMax * 1.25, t));

    stroke(c.hit[0], c.hit[1], c.hit[2], 205 * fade);
    strokeWeight(2.8 * uiScale);
    ellipse(this.x, this.y, lerp(10 * uiScale, this.ringMax * 0.78, t));

    noStroke();
    fill(c.glow[0], c.glow[1], c.glow[2], 170 * fade);
    ellipse(this.x, this.y, lerp(56 * uiScale, 16 * uiScale, t));

    for (const shard of this.shards) {
      push();
      translate(shard.x, shard.y);
      rotate(shard.rot);
      fill(c.hit[0], c.hit[1], c.hit[2], Math.max(0, shard.alpha));
      triangle(
        0, -shard.size,
        shard.size * 0.45, shard.size * 0.7,
        -shard.size * 0.45, shard.size * 0.7
      );
      pop();
    }
    blendMode(BLEND);
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
    this.speed = 0.22; 
    this.dead = false;
    this.life = 999;

    this.hitX = target ? target.x : startX;
    this.hitY = target ? target.y - 6 * uiScale : startY;

    this.angle = atan2(this.hitY - this.startY, this.hitX - this.startX);
    this.trail = [];
  }

  update() {
    if (this.dead) return;

    // Archer projectile travel controls its own impact timing and damage resolution.
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
    const c = TOWER_ATTACK_COLORS.tower2;
    const shaftLen = 52 * uiScale;
    const shaftWeight = 4 * uiScale;

    push();

    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      const ratio = (i + 1) / this.trail.length;
      stroke(c.glow[0], c.glow[1], c.glow[2], p.a * 0.42 * ratio);
      strokeWeight(Math.max(1, 3 * ratio) * uiScale);
      point(p.x, p.y);
    }

    translate(this.x, this.y);
    rotate(this.angle);

    strokeCap(ROUND);
    stroke(c.dark[0], c.dark[1], c.dark[2], 240);
    strokeWeight(shaftWeight);
    line(-shaftLen * 0.55, 0, shaftLen * 0.45, 0);

    stroke(c.glow[0], c.glow[1], c.glow[2], 210);
    strokeWeight(1.7 * uiScale);
    line(-shaftLen * 0.48, -2 * uiScale, shaftLen * 0.36, -2 * uiScale);

    noStroke();
    fill(c.hit[0], c.hit[1], c.hit[2], 245);
    triangle(
      shaftLen * 0.58, 0,
      shaftLen * 0.28, -10 * uiScale,
      shaftLen * 0.28, 10 * uiScale
    );
    fill(c.main[0], c.main[1], c.main[2], 220);
    triangle(-shaftLen * 0.55, 0, -shaftLen * 0.82, -9 * uiScale, -shaftLen * 0.70, 0);
    triangle(-shaftLen * 0.55, 0, -shaftLen * 0.82, 9 * uiScale, -shaftLen * 0.70, 0);

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
    this.life = 12;
    this.dead = false;
    this.maxLife = 12;
    this.sparks = [];
    for (let i = 0; i < 6; i++) {
      const angle = random(TWO_PI);
      this.sparks.push({
        x,
        y,
        vx: cos(angle) * random(1.5, 3.8) * uiScale,
        vy: sin(angle) * random(1.5, 3.8) * uiScale,
        alpha: 210
      });
    }
  }

  update() {
    this.life--;
    for (const spark of this.sparks) {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.78;
      spark.vy *= 0.78;
      spark.alpha -= 28;
    }
    if (this.life <= 0) {
      this.dead = true;
    }
  }

  display() {
    let t = 1 - this.life / this.maxLife;
    let fade = this.life / this.maxLife;
    const c = TOWER_ATTACK_COLORS.tower2;

    push();
    translate(this.x, this.y);

    noFill();
    stroke(c.hit[0], c.hit[1], c.hit[2], 210 * fade);
    strokeWeight(3 * uiScale);
    line(-18 * uiScale, -5 * uiScale, 20 * uiScale, 4 * uiScale);

    stroke(c.main[0], c.main[1], c.main[2], 220 * fade);
    strokeWeight(1.8 * uiScale);
    line(-10 * uiScale, 7 * uiScale, 12 * uiScale, -7 * uiScale);

    noStroke();
    for (const spark of this.sparks) {
      fill(c.glow[0], c.glow[1], c.glow[2], Math.max(0, spark.alpha) * fade);
      ellipse(spark.x - this.x, spark.y - this.y, 4 * uiScale, 4 * uiScale);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.CannonHitEffect = class CannonHitEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 20;
    this.dead = false;
    this.sparks = [];

    for (let i = 0; i < 10; i++) {
      const angle = random(TWO_PI);
      const speed = random(1.8, 4.8) * uiScale;
      this.sparks.push({
        x,
        y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(4, 9) * uiScale,
        alpha: 235
      });
    }
  }

  update() {
    this.life++;
    for (const spark of this.sparks) {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.92;
      spark.vy *= 0.92;
      spark.alpha -= 16;
    }
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    const t = this.life / this.maxLife;
    const fade = 1 - t;
    const c = TOWER_ATTACK_COLORS.tower3;

    push();
    noFill();
    stroke(c.glow[0], c.glow[1], c.glow[2], 230 * fade);
    strokeWeight(4.2 * uiScale);
    ellipse(this.x, this.y, lerp(10 * uiScale, 56 * uiScale, t));
    stroke(c.hit[0], c.hit[1], c.hit[2], 205 * fade);
    strokeWeight(2.2 * uiScale);
    ellipse(this.x, this.y, lerp(6 * uiScale, 34 * uiScale, t));

    noStroke();
    fill(c.main[0], c.main[1], c.main[2], 165 * fade);
    ellipse(this.x, this.y, lerp(36 * uiScale, 10 * uiScale, t));
    for (const spark of this.sparks) {
      fill(c.glow[0], c.glow[1], c.glow[2], Math.max(0, spark.alpha));
      ellipse(spark.x, spark.y, spark.size);
    }
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
    this.startX = x;
    this.startY = y;
    this.target = target;
    this.towerType = towerType;
    this.life = 26;
    this.maxLife = 26;
    this.seed = random(1000);

    this.hitX = target ? target.x : x;
    this.hitY = target ? target.y : y;
  }

  update() {
    // Laser lifetime is visual-only; tower damage timing is handled in Tower.update().
    if (this.target && !this.target.dead && !this.target.reachedEnd) {
      this.hitX = this.target.x;
      this.hitY = this.target.y;
    }

    this.life--;
  }

  display() {
    if (typeof this.hitX === "undefined" || typeof this.hitY === "undefined") return;

    // The visual projectile travels after the tower hit, so gameplay timing stays unchanged.
    const t = constrain((this.maxLife - this.life) / this.maxLife, 0, 1);
    const eased = t * t * (3 - 2 * t);
    const px = lerp(this.startX, this.hitX, eased);
    const py = lerp(this.startY, this.hitY, eased) - sin(t * PI) * (this.towerType === "tower4" ? 16 : 6) * uiScale;

    this.drawAttackTrace(t);

    if (this.towerType === "tower1") {
      this.drawMagicOrb(px, py, t);
    } else if (this.towerType === "tower4") {
      this.drawIceOrb(px, py, t);
    } else {
      this.drawArrowShot(px, py, t);
    }
  }

  getTraceStyle() {
    // Each tower type keeps a distinct color identity while sharing the same trace code.
    if (this.towerType === "tower2") {
      const c = TOWER_ATTACK_COLORS.tower2;
      return { outer: c.main, inner: c.glow, glow: 16, core: 7 };
    }
    if (this.towerType === "tower3") {
      const c = TOWER_ATTACK_COLORS.tower3;
      return { outer: c.main, inner: c.glow, glow: 14, core: 5.5 };
    }
    if (this.towerType === "tower4") {
      const c = TOWER_ATTACK_COLORS.tower4;
      return { outer: c.main, inner: c.glow, glow: 17, core: 7 };
    }
    const c = TOWER_ATTACK_COLORS.tower1;
    return { outer: c.main, inner: c.glow, glow: 10, core: 4 };
  }

  drawAttackTrace(t) {
    // The trace shows the firing line without changing whether the attack has already hit.
    const traceFade = 1 - constrain((t - 0.58) / 0.30, 0, 1);
    if (traceFade <= 0) return;

    const style = this.getTraceStyle();
    const dx = this.hitX - this.startX;
    const dy = this.hitY - this.startY;
    const len = Math.max(0.001, Math.hypot(dx, dy));
    const ux = dx / len;
    const uy = dy / len;
    const flow = (frameCount * 0.16 + this.seed) % 1;

    push();
    blendMode(ADD);
    strokeCap(ROUND);
    stroke(style.outer[0], style.outer[1], style.outer[2], 70 * traceFade);
    strokeWeight(style.glow * uiScale);
    line(this.startX, this.startY, this.hitX, this.hitY);

    stroke(style.inner[0], style.inner[1], style.inner[2], 225 * traceFade);
    strokeWeight(style.core * uiScale);
    line(this.startX, this.startY, this.hitX, this.hitY);

    for (let i = 0; i < 3; i++) {
      const p = (flow + i * 0.31) % 1;
      const cx = this.startX + dx * p;
      const cy = this.startY + dy * p;
      stroke(style.inner[0], style.inner[1], style.inner[2], 215 * traceFade * (1 - i * 0.18));
      strokeWeight(Math.max(2, style.core * 0.75) * uiScale);
      line(
        cx - ux * 14 * uiScale,
        cy - uy * 14 * uiScale,
        cx + ux * 18 * uiScale,
        cy + uy * 18 * uiScale
      );
    }

    noStroke();
    fill(style.inner[0], style.inner[1], style.inner[2], 205 * traceFade);
    ellipse(this.hitX, this.hitY, (this.towerType === "tower1" ? 14 : 22) * uiScale);
    blendMode(BLEND);
    pop();
  }

  drawArrowShot(px, py, t) {
    const angle = atan2(this.hitY - this.startY, this.hitX - this.startX);
    const hitFade = constrain((t - 0.72) / 0.28, 0, 1);
    const c = TOWER_ATTACK_COLORS.tower2;

    push();
    noStroke();
    for (let i = 0; i < 4; i++) {
      const ratio = i / 4;
      const trailT = Math.max(0, t - ratio * 0.06);
      const trailX = lerp(this.startX, this.hitX, trailT);
      const trailY = lerp(this.startY, this.hitY, trailT);
      fill(c.glow[0], c.glow[1], c.glow[2], 135 * (1 - ratio) * (1 - hitFade));
      ellipse(trailX, trailY, (13 - i) * uiScale, (6.5 - i * 0.4) * uiScale);
    }

    translate(px, py);
    rotate(angle);
    stroke(c.dark[0], c.dark[1], c.dark[2], 220 * (1 - hitFade));
    strokeWeight(5 * uiScale);
    line(-30 * uiScale, 0, 24 * uiScale, 0);
    noStroke();
    fill(c.hit[0], c.hit[1], c.hit[2], 230 * (1 - hitFade));
    triangle(31 * uiScale, 0, 9 * uiScale, -12 * uiScale, 9 * uiScale, 12 * uiScale);
    fill(c.main[0], c.main[1], c.main[2], 185 * (1 - hitFade));
    triangle(-30 * uiScale, 0, -45 * uiScale, -10 * uiScale, -45 * uiScale, 10 * uiScale);
    pop();

    if (hitFade > 0) {
      push();
      noFill();
      stroke(c.hit[0], c.hit[1], c.hit[2], 215 * (1 - hitFade));
      strokeWeight(3.5 * uiScale);
      ellipse(this.hitX, this.hitY, lerp(14 * uiScale, 48 * uiScale, hitFade));
      pop();
    }
  }

  drawMagicOrb(px, py, t) {
    const hitFade = constrain((t - 0.70) / 0.30, 0, 1);
    const pulse = 1 + 0.12 * sin(frameCount * 0.45 + this.seed);
    const c = TOWER_ATTACK_COLORS.tower1;

    push();
    blendMode(ADD);
    noStroke();
    for (let i = 0; i < 5; i++) {
      const ratio = i / 5;
      const trailT = Math.max(0, t - ratio * 0.055);
      const trailX = lerp(this.startX, this.hitX, trailT);
      const trailY = lerp(this.startY, this.hitY, trailT);
      fill(c.main[0], c.main[1], c.main[2], 115 * (1 - ratio) * (1 - hitFade));
      ellipse(trailX, trailY, (41 - i * 4) * uiScale, (41 - i * 4) * uiScale);
    }

    fill(c.main[0], c.main[1], c.main[2], 215 * (1 - hitFade));
    ellipse(px, py, 62 * uiScale * pulse, 62 * uiScale * pulse);
    fill(c.glow[0], c.glow[1], c.glow[2], 245 * (1 - hitFade));
    ellipse(px, py, 30 * uiScale, 30 * uiScale);

    if (hitFade > 0) {
      noFill();
      stroke(c.hit[0], c.hit[1], c.hit[2], 230 * (1 - hitFade));
      strokeWeight(4.5 * uiScale);
      ellipse(this.hitX, this.hitY, lerp(24 * uiScale, 88 * uiScale, hitFade));
      stroke(c.glow[0], c.glow[1], c.glow[2], 175 * (1 - hitFade));
      strokeWeight(2.2 * uiScale);
      ellipse(this.hitX, this.hitY, lerp(12 * uiScale, 52 * uiScale, hitFade));
    }
    blendMode(BLEND);
    pop();
  }

  drawIceOrb(px, py, t) {
    const hitFade = constrain((t - 0.68) / 0.32, 0, 1);
    const pulse = 1 + 0.08 * sin(frameCount * 0.36 + this.seed);
    const c = TOWER_ATTACK_COLORS.tower4;

    push();
    blendMode(ADD);
    noStroke();
    for (let i = 0; i < 5; i++) {
      const ratio = i / 5;
      const trailT = Math.max(0, t - ratio * 0.05);
      const trailX = lerp(this.startX, this.hitX, trailT);
      const trailY = lerp(this.startY, this.hitY, trailT);
      fill(c.main[0], c.main[1], c.main[2], 100 * (1 - ratio) * (1 - hitFade));
      ellipse(trailX, trailY, (34 - i * 4) * uiScale, (20 - i * 2) * uiScale);
    }

    fill(c.main[0], c.main[1], c.main[2], 190 * (1 - hitFade));
    ellipse(px, py, 46 * uiScale * pulse, 46 * uiScale * pulse);
    fill(c.hit[0], c.hit[1], c.hit[2], 235 * (1 - hitFade));
    ellipse(px, py, 18 * uiScale, 18 * uiScale);

    stroke(c.hit[0], c.hit[1], c.hit[2], 210 * (1 - hitFade));
    strokeWeight(2.2 * uiScale);
    for (let i = 0; i < 4; i++) {
      const a = i * HALF_PI + frameCount * 0.04;
      line(
        px - cos(a) * 22 * uiScale,
        py - sin(a) * 22 * uiScale,
        px + cos(a) * 22 * uiScale,
        py + sin(a) * 22 * uiScale
      );
    }

    if (hitFade > 0) {
      noFill();
      stroke(c.glow[0], c.glow[1], c.glow[2], 230 * (1 - hitFade));
      strokeWeight(4 * uiScale);
      ellipse(this.hitX, this.hitY, lerp(22 * uiScale, 92 * uiScale, hitFade));
    }
    blendMode(BLEND);
    pop();
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
    // Magic particles fade quickly so repeated attacks remain readable.
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

window.TowerBuildBoomEffect = class TowerBuildBoomEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.life = 0;
    this.maxLife = 22;
    this.dead = false;

    this.flashSize = 150 * uiScale;
    this.ringMax = 180 * uiScale;

    this.particles = [];
    this.smokes = [];

    for (let i = 0; i < 16; i++) {
      let angle = random(TWO_PI);
      let speed = random(3, 8) * uiScale;

      this.particles.push({
        x: x,
        y: y - 40 * uiScale,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.8, 2.2) * uiScale,
        size: random(8, 18) * uiScale,
        alpha: 220
      });
    }

    for (let i = 0; i < 10; i++) {
      this.smokes.push({
        x: x + random(-18, 18) * uiScale,
        y: y - 35 * uiScale + random(-8, 8) * uiScale,
        vx: random(-1.2, 1.2) * uiScale,
        vy: random(-2.2, -0.5) * uiScale,
        size: random(28, 46) * uiScale,
        alpha: 140
      });
    }
  }

  update() {
    this.life++;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12 * uiScale;
      p.alpha -= 12;
      p.size *= 0.95;
    }

    for (let s of this.smokes) {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 4.5;
      s.size *= 1.02;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    let t = this.life / this.maxLife;
    let fade = 1 - t;

    let boomY = this.y - 55 * uiScale;

    push();

    noStroke();
    fill(0, 0, 0, 55 * fade);
    ellipse(
      this.x,
      this.y + 10 * uiScale,
      lerp(40 * uiScale, 95 * uiScale, min(t * 1.4, 1)),
      lerp(16 * uiScale, 34 * uiScale, min(t * 1.4, 1))
    );

    fill(255, 245, 210, 210 * fade);
    ellipse(
      this.x,
      boomY,
      lerp(this.flashSize, 28 * uiScale, t),
      lerp(this.flashSize * 0.75, 20 * uiScale, t)
    );

    fill(255, 170, 70, 150 * fade);
    ellipse(
      this.x,
      boomY,
      lerp(this.flashSize * 1.35, 42 * uiScale, t),
      lerp(this.flashSize, 30 * uiScale, t)
    );

    noFill();
    stroke(255, 230, 170, 170 * fade);
    strokeWeight((5 * fade + 1.2) * uiScale);
    ellipse(this.x, boomY, lerp(25 * uiScale, this.ringMax, t));

    stroke(255, 150, 60, 110 * fade);
    strokeWeight((9 * fade) * uiScale);
    ellipse(this.x, boomY, lerp(12 * uiScale, this.ringMax * 0.62, min(t * 1.15, 1)));

    noStroke();
    for (let p of this.particles) {
      fill(255, 180, 80, max(0, p.alpha));
      ellipse(p.x, p.y, p.size);
    }

    for (let s of this.smokes) {
      fill(90, 90, 90, max(0, s.alpha));
      ellipse(s.x, s.y, s.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.TowerUpgradeEffect = class TowerUpgradeEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.life = 0;
    this.maxLife = 24;
    this.dead = false;

    this.rings = [];
    this.sparkles = [];
    this.beams = [];

    for (let i = 0; i < 3; i++) {
      this.rings.push({
        start: i * 3,
        maxR: random(95, 145) * uiScale
      });
    }

    for (let i = 0; i < 18; i++) {
      let angle = random(TWO_PI);
      let speed = random(2.2, 6.2) * uiScale;

      this.sparkles.push({
        x: x,
        y: y - 40 * uiScale,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(1.0, 2.8) * uiScale,
        size: random(7, 14) * uiScale,
        alpha: 230,
        rot: random(TWO_PI),
        rotSpeed: random(-0.18, 0.18)
      });
    }

    for (let i = 0; i < 5; i++) {
      this.beams.push({
        angle: -PI / 2 + random(-0.35, 0.35),
        len: random(70, 120) * uiScale,
        w: random(12, 24) * uiScale,
        alpha: random(70, 120)
      });
    }
  }

  update() {
    this.life++;

    for (let s of this.sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08 * uiScale;
      s.alpha -= 10;
      s.size *= 0.965;
      s.rot += s.rotSpeed;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  drawStar(x, y, r1, r2, points = 4) {
    beginShape();
    for (let i = 0; i < points * 2; i++) {
      let a = i * PI / points;
      let r = i % 2 === 0 ? r2 : r1;
      vertex(x + cos(a) * r, y + sin(a) * r);
    }
    endShape(CLOSE);
  }

  display() {
    let t = this.life / this.maxLife;
    let fade = 1 - t;
    let cy = this.y - 44 * uiScale;

    push();

    noStroke();
    fill(255, 210, 70, 35 * fade);
    ellipse(
      this.x,
      this.y + 10 * uiScale,
      lerp(36 * uiScale, 96 * uiScale, min(t * 1.25, 1)),
      lerp(14 * uiScale, 34 * uiScale, min(t * 1.25, 1))
    );

    for (let b of this.beams) {
      push();
      translate(this.x, cy);
      rotate(b.angle);
      noStroke();
      fill(255, 220, 120, b.alpha * fade);
      ellipse(0, -b.len * 0.4, b.w, b.len);
      pop();
    }

    noStroke();
    fill(255, 245, 190, 180 * fade);
    ellipse(this.x, cy, lerp(72 * uiScale, 26 * uiScale, t));

    fill(255, 185, 60, 95 * fade);
    ellipse(this.x, cy, lerp(110 * uiScale, 40 * uiScale, t));

    noFill();
    for (let r of this.rings) {
      let localT = constrain((this.life - r.start) / (this.maxLife - r.start), 0, 1);
      if (localT <= 0) continue;

      stroke(255, 225, 120, 180 * (1 - localT));
      strokeWeight((4.5 * (1 - localT) + 1.2) * uiScale);
      ellipse(this.x, cy, lerp(20 * uiScale, r.maxR, localT));
    }

    noStroke();
    for (let s of this.sparkles) {
      push();
      translate(s.x, s.y);
      rotate(s.rot);

      fill(255, 220, 100, max(0, s.alpha));
      this.drawStar(0, 0, s.size * 0.35, s.size, 4);

      fill(255, 250, 220, max(0, s.alpha * 0.65));
      this.drawStar(0, 0, s.size * 0.16, s.size * 0.5, 4);
      pop();
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.TowerStunEffect = class TowerStunEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 34;
    this.dead = false;
  }

  update() {
    this.life++;
    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    const scale = typeof uiScale === "number" && isFinite(uiScale) ? uiScale : 1;
    const t = this.life / this.maxLife;
    const fade = 1 - t;
    const cy = this.y - 52 * scale;

    push();
    noFill();
    stroke(145, 110, 255, 185 * fade);
    strokeWeight((4 - 2 * t) * scale);
    ellipse(this.x, cy, lerp(34 * scale, 116 * scale, t));

    stroke(255, 230, 120, 155 * fade);
    strokeWeight(2 * scale);
    const orbit = 34 * scale;
    for (let i = 0; i < 3; i++) {
      const a = t * TWO_PI * 1.5 + i * TWO_PI / 3;
      const sx = this.x + cos(a) * orbit;
      const sy = cy + sin(a) * orbit * 0.45;
      line(sx - 6 * scale, sy, sx + 6 * scale, sy);
      line(sx, sy - 6 * scale, sx, sy + 6 * scale);
    }

    noStroke();
    fill(120, 180, 255, 75 * fade);
    ellipse(this.x, cy, 42 * scale, 20 * scale);
    pop();
  }

  isDead() {
    return this.dead;
  }
};

window.TowerSellEffect = class TowerSellEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.life = 0;
    this.maxLife = 22;
    this.dead = false;

    this.coins = [];
    this.shards = [];
    this.smokes = [];

    for (let i = 0; i < 9; i++) {
      let angle = random(-PI + 0.25, -0.25);
      let speed = random(2.6, 6.4) * uiScale;

      this.coins.push({
        x: x,
        y: y - 38 * uiScale,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(1.2, 2.8) * uiScale,
        r: random(7, 11) * uiScale,
        alpha: 230,
        rot: random(TWO_PI),
        rotSpeed: random(-0.22, 0.22)
      });
    }

    for (let i = 0; i < 12; i++) {
      let angle = random(TWO_PI);
      let speed = random(2.2, 5.5) * uiScale;

      this.shards.push({
        x: x,
        y: y - 42 * uiScale,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(0.8, 2.0) * uiScale,
        w: random(6, 12) * uiScale,
        h: random(10, 18) * uiScale,
        alpha: 170,
        rot: random(TWO_PI),
        rotSpeed: random(-0.28, 0.28)
      });
    }

    for (let i = 0; i < 7; i++) {
      this.smokes.push({
        x: x + random(-12, 12) * uiScale,
        y: y - 28 * uiScale + random(-8, 8) * uiScale,
        vx: random(-1.1, 1.1) * uiScale,
        vy: random(-2.0, -0.5) * uiScale,
        size: random(20, 34) * uiScale,
        alpha: 120
      });
    }
  }

  update() {
    this.life++;

    for (let c of this.coins) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.16 * uiScale;
      c.alpha -= 9;
      c.rot += c.rotSpeed;
    }

    for (let s of this.shards) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.14 * uiScale;
      s.alpha -= 10;
      s.rot += s.rotSpeed;
    }

    for (let sm of this.smokes) {
      sm.x += sm.vx;
      sm.y += sm.vy;
      sm.alpha -= 4.6;
      sm.size *= 1.02;
    }

    if (this.life >= this.maxLife) {
      this.dead = true;
    }
  }

  display() {
    let t = this.life / this.maxLife;
    let fade = 1 - t;
    let cy = this.y - 42 * uiScale;

    push();

    noStroke();
    fill(255, 205, 80, 45 * fade);
    ellipse(
      this.x,
      this.y + 10 * uiScale,
      lerp(34 * uiScale, 90 * uiScale, min(t * 1.2, 1)),
      lerp(12 * uiScale, 30 * uiScale, min(t * 1.2, 1))
    );

    noFill();
    stroke(255, 225, 120, 150 * fade);
    strokeWeight((4 * fade + 1) * uiScale);
    ellipse(this.x, cy, lerp(18 * uiScale, 92 * uiScale, t));

    for (let c of this.coins) {
      push();
      translate(c.x, c.y);
      rotate(c.rot);

      noStroke();
      fill(245, 195, 55, max(0, c.alpha));
      ellipse(0, 0, c.r * 2.05, c.r * 2.05);

      fill(255, 235, 150, max(0, c.alpha * 0.8));
      ellipse(-c.r * 0.18, -c.r * 0.18, c.r * 1.05, c.r * 1.05);

      pop();
    }

    for (let s of this.shards) {
      push();
      translate(s.x, s.y);
      rotate(s.rot);

      noStroke();
      fill(170, 140, 95, max(0, s.alpha));
      rectMode(CENTER);
      rect(0, 0, s.w, s.h, 2 * uiScale);

      pop();
    }

    noStroke();
    for (let sm of this.smokes) {
      fill(90, 90, 90, max(0, sm.alpha));
      ellipse(sm.x, sm.y, sm.size);
    }

    pop();
  }

  isDead() {
    return this.dead;
  }
};