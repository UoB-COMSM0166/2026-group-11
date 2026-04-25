let selectedTower = null;

const TOWER_COST = {
  tower1: 100,
  tower2: 70,
  tower3: 125,
  tower4: 70
};

const TOWER_UPGRADE_COSTS = {
  tower1: [160, 240],
  tower2: [110, 220],
  tower3: [220, 320],
  tower4: [110, 220]
};

const TOWER_LEVEL_STATS = {
  tower1: [
    { range: 400, fireRate: 45, damage: 25, splashRadius: 0, slowFactor: 1, slowDuration: 0 },
    { range: 450, fireRate: 40, damage: 40, splashRadius: 0, slowFactor: 1, slowDuration: 0 },
    { range: 500, fireRate: 35, damage: 60, splashRadius: 0, slowFactor: 1, slowDuration: 0 }
  ],

  tower2: [
    { range: 400, fireRate: 30, damage: 10, splashRadius: 0, slowFactor: 1, slowDuration: 0 },
    { range: 500, fireRate: 20, damage: 15, splashRadius: 0, slowFactor: 1, slowDuration: 0 },
    { range: 600, fireRate: 10, damage: 20, splashRadius: 0, slowFactor: 1, slowDuration: 0 }
  ],

  tower3: [
    { range: 400, fireRate: 65, damage: 35, splashRadius: 100, slowFactor: 1, slowDuration: 0 },
    { range: 440, fireRate: 60, damage: 55, splashRadius: 125, slowFactor: 1, slowDuration: 0 },
    { range: 480, fireRate: 55, damage: 80, splashRadius: 150, slowFactor: 1, slowDuration: 0 }
  ],

  tower4: [
    { range: 400, fireRate: 40, damage: 5, splashRadius: 0, slowFactor: 0.5, slowDuration: 70 },
    { range: 500, fireRate: 35, damage: 7, splashRadius: 0, slowFactor: 0.4, slowDuration: 90 },
    { range: 600, fireRate: 25, damage: 10, splashRadius: 0, slowFactor: 0.3, slowDuration: 120 }
  ]
};

function isTowerAttackableTarget(enemy) {
  // Skip invalid, finished, or inactive targets before range checks.
  if (!enemy || enemy.dead || enemy.reachedEnd) return false;
  if (enemy.isBoss && enemy.bossPhase === "fragmenting") return false;
  // Skip recalled fragments so towers never waste shots after the split phase ends.
  if (enemy.isBossFragment && (enemy.defeated || enemy.handled || enemy.recalled || enemy.attackable === false || enemy.hp <= 0)) return false;
  return Number.isFinite(enemy.x) && Number.isFinite(enemy.y);
}

function getBossFragmentTargets() {
  const fragments = [];
  if (typeof enemies === "undefined" || !Array.isArray(enemies)) return fragments;

  for (const enemy of enemies) {
    if (!enemy || !enemy.isBoss || enemy.bossPhase !== "fragmenting") continue;
    if (!Array.isArray(enemy.bossFragments)) continue;

    for (const frag of enemy.bossFragments) {
      if (isTowerAttackableTarget(frag)) {
        fragments.push(frag);
      }
    }
  }

  return fragments;
}

function getTowerTargetCandidates() {
  const candidates = [];
  if (typeof enemies !== "undefined" && Array.isArray(enemies)) {
    for (const enemy of enemies) {
      if (isTowerAttackableTarget(enemy)) {
        candidates.push(enemy);
      }
    }
  }

  return candidates.concat(getBossFragmentTargets());
}

class Tower {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;

    this.level = 1;
    this.maxLevel = currentMap === 1 ? 1 : currentMap === 2 ? 2 : 3;
    this.totalSpent = TOWER_COST[this.type] || 0;

    this.cooldown = 0;
    this.w = 255 * uiScale;
    this.h = 285 * uiScale;
    
    this.spawnAnim = 0;
    this.spawnAnimMax = 12;
    
    this.autoUpgradeFrame2 = -1;
    this.autoUpgradeFrame3 = -1;

    this.range = 300 * uiScale;
    this.fireRate = 30;
    this.damage = 20;
    this.splashRadius = 0;
    this.slowFactor = 1;
    this.slowDuration = 0;
    this.stunnedUntilFrame = 0;
    this.stunFlashTimer = 0;

    this.applyLevelStats();
  }

  applyLevelStats() {
    // Level stats are the single source of truth for range, damage, cooldown, and slow values.
    const statsList = TOWER_LEVEL_STATS[this.type] || TOWER_LEVEL_STATS.tower1;
    const stats = statsList[this.level - 1];

    this.range = stats.range * uiScale;
    this.fireRate = stats.fireRate;
    this.damage = stats.damage;
    this.splashRadius = (stats.splashRadius || 0) * uiScale;
    this.slowFactor = stats.slowFactor == null ? 1 : stats.slowFactor;
    this.slowDuration = stats.slowDuration || 0;
  }

  canUpgrade() {
    return this.level < this.maxLevel;
  }

  getUpgradeCost() {
    if (!this.canUpgrade()) return 0;
    const costList = TOWER_UPGRADE_COSTS[this.type] || [80, 140];
    return costList[this.level - 1] || 0;
  }

  upgrade() {
    if (!this.canUpgrade()) return false;
    // Upgrades only change the tower's level-based stats; placement and targeting stay intact.
    this.level++;
    this.applyLevelStats();
    return true;
  }

  getLogicFrame() {
    if (typeof getGameFrameCount === "function") return getGameFrameCount();
    if (typeof frameCount !== "undefined") return frameCount;
    return 0;
  }

  applyStun(durationFrames) {
    const now = this.getLogicFrame();
    const duration = Math.max(0, durationFrames || 0);
    this.stunnedUntilFrame = Math.max(this.stunnedUntilFrame || 0, now + duration);
    this.stunFlashTimer = 16;
  }

  isStunned() {
    return this.getLogicFrame() < (this.stunnedUntilFrame || 0);
  }

  update() {
    if (this.stunFlashTimer > 0) {
      this.stunFlashTimer--;
    }

    if (this.isStunned()) {
      return;
    }

    if (this.autoUpgradeFrame2 > -1 && frameCount >= this.autoUpgradeFrame2 && this.level === 1) {
      this.upgrade();
      lasers.push(new TowerUpgradeEffect(this.x, this.y));
      if (typeof playTowerUpgradeSfx === "function") {
        playTowerUpgradeSfx();
      }
      this.autoUpgradeFrame2 = -1;
    }

    if (this.autoUpgradeFrame3 > -1 && frameCount >= this.autoUpgradeFrame3 && this.level === 2) {
      this.upgrade();
      lasers.push(new TowerUpgradeEffect(this.x, this.y));
      if (typeof playTowerUpgradeSfx === "function") {
        playTowerUpgradeSfx();
      }
      this.autoUpgradeFrame3 = -1;
    }

    if (this.spawnAnim < this.spawnAnimMax) {
      this.spawnAnim++;
    }
    if (this.cooldown > 0) {
      this.cooldown--;
    }

    if (this.cooldown > 0) return;

    let target = null;

    // Each tower type chooses targets differently, but all use the same firing pipeline.
    if (this.type === "tower3") {
      target = this.findBestSplashTarget();
    } else if (this.type === "tower4") {
      target = this.findBestIceTarget();
    } else {
      target = this.findTarget();
    }

    if (!target) return;

    let fireX = this.x;
    let fireY = this.y - 95 * uiScale;

    // Laser towers resolve damage immediately; arrow and cannon projectiles resolve on impact.
    if (this.type === "tower3") {
      lasers.push(
        new CannonBomb(
          fireX,
          fireY,
          target,
          this.damage,
          this.splashRadius
        )
      );
    } else if (this.type === "tower2") {
      lasers.push(
        new ArrowProjectile(
          fireX,
          fireY,
          target,
          this.damage
        )
      );
    } else {
      lasers.push(new Laser(fireX, fireY, target, this.type));

      if (!target.dead) {
        if (this.type === "tower1") {
          target.takeDamage(this.damage, "magic");
        } else {
          target.takeDamage(this.damage, "physical");
        }

        if (this.type === "tower4") {
          target.applySlow(this.slowFactor, this.slowDuration);
        }
      }
    }

    playTowerAttackSfx(this.type);
    this.cooldown = this.fireRate;
  }

  findTarget() {
    let nearest = null;
    let nearestDist = Infinity;

    // Basic targeting prefers the closest active enemy already inside tower range.
    for (let enemy of getTowerTargetCandidates()) {
      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d <= this.range && d < nearestDist) {
        nearest = enemy;
        nearestDist = d;
      }
    }

    return nearest;
  }

  findBestSplashTarget() {
    let candidates = [];

    // Splash towers aim at the densest ground cluster instead of just the nearest enemy.
    for (let enemy of getTowerTargetCandidates()) {
      if (enemy.canFly) continue;

      let dToTower = dist(this.x, this.y, enemy.x, enemy.y);
      if (dToTower <= this.range) {
        candidates.push(enemy);
      }
    }

    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    let bestTarget = null;
    let bestScore = -1;
    let bestDistToTower = Infinity;

    for (let centerEnemy of candidates) {
      let count = 0;

      for (let otherEnemy of candidates) {
        let d = dist(centerEnemy.x, centerEnemy.y, otherEnemy.x, otherEnemy.y);
        if (d <= this.splashRadius) {
          count++;
        }
      }

      let dToTower = dist(this.x, this.y, centerEnemy.x, centerEnemy.y);

      if (
        count > bestScore ||
        (count === bestScore && dToTower < bestDistToTower)
      ) {
        bestScore = count;
        bestTarget = centerEnemy;
        bestDistToTower = dToTower;
      }
    }

    return bestTarget;
}

  findBestIceTarget() {
    let unslowed = [];
    let slowed = [];

    // Ice towers prefer unslowed enemies so slow coverage spreads across the wave.
    for (let enemy of getTowerTargetCandidates()) {
      if (enemy.canFly) continue;

      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d > this.range) continue;

      if (this.isEnemySlowed(enemy)) {
        slowed.push(enemy);
      } else {
        unslowed.push(enemy);
      }
    }

    if (unslowed.length > 0) {
      return this.findNearestFromList(unslowed);
    }

    if (slowed.length > 0) {
      return this.findNearestFromList(slowed);
    }

    return null;
  }

  findNearestFromList(list) {
    let nearest = null;
    let nearestDist = Infinity;

    for (let enemy of list) {
      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d < nearestDist) {
        nearest = enemy;
        nearestDist = d;
      }
    }

    return nearest;
  }

  isEnemySlowed(enemy) {
    if (typeof enemy.slowTimer !== "undefined") return enemy.slowTimer > 0;
    if (typeof enemy.freezeTimer !== "undefined") return enemy.freezeTimer > 0;
    if (typeof enemy.isSlowed !== "undefined") return !!enemy.isSlowed;
    if (typeof enemy.slowed !== "undefined") return !!enemy.slowed;
    if (typeof enemy.speedMultiplier !== "undefined") return enemy.speedMultiplier < 1;
    if (typeof enemy.moveSpeedScale !== "undefined") return enemy.moveSpeedScale < 1;

    if (
      typeof enemy.currentSpeed !== "undefined" &&
      typeof enemy.baseSpeed !== "undefined"
    ) {
      return enemy.currentSpeed < enemy.baseSpeed;
    }

    return false;
  }

  containsPoint(px, py) {
    const hitX = this.x;
    const hitY = this.y - 28 * uiScale;
    const hitR = 62 * uiScale;
    return dist(px, py, hitX, hitY) <= hitR;
  }

  displayRange() {
    push();

    let d = this.range * 2;
    let edgeCol;
    let fillCol;

    if (this.type === "tower1") {
      edgeCol = color(180, 100, 255, 170);
      fillCol = color(180, 100, 255, 12);
    } else if (this.type === "tower2") {
      edgeCol = color(255, 220, 90, 170);
      fillCol = color(255, 220, 90, 12);
    } else if (this.type === "tower3") {
      edgeCol = color(70, 70, 80, 180);
      fillCol = color(70, 70, 80, 14);
    } else if (this.type === "tower4") {
      edgeCol = color(60, 150, 255, 190);
      fillCol = color(60, 150, 255, 16);
    } else {
      edgeCol = color(120, 255, 100, 170);
      fillCol = color(120, 255, 100, 12);
    }

    noStroke();

    for (let i = 12; i >= 1; i--) {
      let t = i / 12;
      let size = d * t;
      let a = map(i, 1, 12, 6, 22);
      fill(red(fillCol), green(fillCol), blue(fillCol), a);
      ellipse(this.x, this.y, size, size);
    }

    noFill();
    stroke(red(edgeCol), green(edgeCol), blue(edgeCol), alpha(edgeCol));
    strokeWeight(3 * uiScale);
    ellipse(this.x, this.y, d, d);

    stroke(red(edgeCol), green(edgeCol), blue(edgeCol), 80);
    strokeWeight(1.5 * uiScale);
    ellipse(this.x, this.y, d - 8 * uiScale, d - 8 * uiScale);

    pop();
  }

  displayLevelBadge() {
    // Put the badge inside the hollow center of the upgrade ring,
    // so it stays below the UI layer but is still visible.
    const badgeX = this.x;
    const badgeY = this.y + 28 * uiScale;
    const badgeW = 86 * uiScale;
    const badgeH = 38 * uiScale;

    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0, 185);
    rect(badgeX, badgeY, badgeW, badgeH, 10 * uiScale);

    stroke(255, 225, 120, 180);
    strokeWeight(2 * uiScale);
    noFill();
    rect(badgeX, badgeY, badgeW, badgeH, 10 * uiScale);

    noStroke();
    fill(255, 245, 190);
    textAlign(CENTER, CENTER);
    textSize(20 * uiScale);
    textFont("Futura");
    text("Lv." + this.level, badgeX, badgeY + 1 * uiScale);
    pop();
  }

  display() {
  let img = tower1Lv1Img;

  if (this.type === "tower1") {
    if (this.level === 1) {
      img = tower1Lv1Img;
    } else if (this.level === 2) {
      img = tower1Lv2Img;
    } else {
      img = tower1Lv3Img;
    }
  } else if (this.type === "tower2") {
    if (this.level === 1) {
      img = tower2Lv1Img;
    } else if (this.level === 2) {
      img = tower2Lv2Img;
    } else {
      img = tower2Lv3Img;
    }
  } else if (this.type === "tower3") {
    if (this.level === 1) {
      img = tower3Lv1Img;
    } else if (this.level === 2) {
      img = tower3Lv2Img;
    } else {
      img = tower3Lv3Img;
    }
  } else if (this.type === "tower4") {
    if (this.level === 1) {
      img = tower4Lv1Img;
    } else if (this.level === 2) {
      img = tower4Lv2Img;
    } else {
      img = tower4Lv3Img;
    }
  }

  if (selectedTower === this) {
    this.displayRange();
  }

  let spawnT = 1;
  if (typeof this.spawnAnim !== "undefined" && typeof this.spawnAnimMax !== "undefined" && this.spawnAnimMax > 0) {
    spawnT = constrain(this.spawnAnim / this.spawnAnimMax, 0, 1);
  }

  let spawnScale;
  if (spawnT < 0.55) {
    spawnScale = lerp(0.55, 1.12, spawnT / 0.55);
  } else {
    spawnScale = lerp(1.12, 1.0, (spawnT - 0.55) / 0.45);
  }

  let popOffsetY = 0;
  if (spawnT < 1) {
    popOffsetY = sin(spawnT * PI) * 18 * uiScale;
  }

  push();
  imageMode(CENTER);
  translate(this.x, this.y - 40 * uiScale - popOffsetY);
  scale(spawnScale);
  image(img, 0, 0, this.w, this.h);
  if (this.isStunned()) {
    const pulseT = (typeof frameCount !== "undefined" ? frameCount : 0) * 0.2;
    const ringPulse = 1 + sin(pulseT) * 0.08;

    // Disable tint overlay
    noStroke();
    fill(120, 70, 170, 95);
    ellipse(0, 12 * uiScale, 145 * uiScale, 145 * uiScale);

    // Outer lock ring
    noFill();
    stroke(210, 120, 255, 220);
    strokeWeight(3.5 * uiScale);
    ellipse(0, 12 * uiScale, 152 * uiScale * ringPulse, 152 * uiScale * ringPulse);

    // Inner pulse ring
    stroke(255, 90, 150, 180);
    strokeWeight(2.2 * uiScale);
    ellipse(0, 12 * uiScale, 122 * uiScale * (1.04 - sin(pulseT) * 0.04), 122 * uiScale * (1.04 - sin(pulseT) * 0.04));

    // Four electric sparks
    stroke(255, 210, 255, 210);
    strokeWeight(2 * uiScale);
    for (let i = 0; i < 4; i++) {
      const a = pulseT * 0.55 + i * HALF_PI;
      const r1 = 56 * uiScale;
      const r2 = 75 * uiScale;
      const x1 = cos(a) * r1;
      const y1 = sin(a) * r1 + 12 * uiScale;
      const x2 = cos(a + 0.18) * r2;
      const y2 = sin(a + 0.18) * r2 + 12 * uiScale;
      const x3 = cos(a - 0.08) * (r2 + 8 * uiScale);
      const y3 = sin(a - 0.08) * (r2 + 8 * uiScale) + 12 * uiScale;
      line(x1, y1, x2, y2);
      line(x2, y2, x3, y3);
    }
  }
  pop();

  imageMode(CORNER);
}
}

function handleTowerSelection(gx, gy) {
  // Selection is separate from placement so tower action UI can reuse the same hit test.
  for (let i = towers.length - 1; i >= 0; i--) {
    if (towers[i].containsPoint(gx, gy)) {
      if (selectedTower === towers[i]) {
        selectedTower = null;
      } else {
        selectedTower = towers[i];
      }
      return true;
    }
  }

  selectedTower = null;
  return false;
}