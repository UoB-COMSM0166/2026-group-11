// Keep debug output off during normal gameplay unless enabled from the console.
const DEBUG_BOSS_PATH = typeof window !== "undefined"
  ? (typeof window.DEBUG_BOSS_PATH === "boolean" ? window.DEBUG_BOSS_PATH : false)
  : false;
// Boss split fragment count.
const BOSS_FRAGMENT_COUNT = 10;
// Boss split duration in real time.
const BOSS_FRAGMENT_DURATION_MS = 8000;
// Mini Boss attack cooldown.
const BOSS_FRAGMENT_STUN_COOLDOWN = 220;
// Mini Boss projectile cap.
const BOSS_FRAGMENT_PROJECTILE_CAP = 16;
// Minimum route spacing for fragment targets.
const BOSS_FRAGMENT_MIN_DISTANCE = 150;
// Small offset keeps route targets visually separated.
const BOSS_FRAGMENT_PATH_OFFSET = 28;
// Fallback attempts for safe target placement.
const BOSS_FRAGMENT_FALLBACK_ATTEMPTS = 50;
// Safe map margin for fallback targets.
const BOSS_FRAGMENT_BOUNDS_MARGIN = 150;

function getBossRealTimeMs() {
  // Real-time timer fallback for tests outside p5.
  if (typeof millis === "function") {
    return millis();
  }
  return Date.now();
}

function configureKingBossLoopPath(enemy) {
  if (!enemy || enemy.typeKey !== "king_boss") return;
  if (typeof currentMap === "undefined" || currentMap !== 4) return;
  if (enemy.bossLoopPathConfigured) return;

  // Map 4 Boss uses one long showcase path so it never teleports between loops.
  enemy.bossShowcasePath = [
    { x: 2517, y: 244 },
    { x: 2517, y: 272 },
    { x: 2177, y: 272 },
    { x: 2177, y: 1184 },
    { x: 641,  y: 1184 },
    { x: 641,  y: 712 },

    { x: 568,  y: 749 },
    { x: 568,  y: 1286 },
    { x: 2158, y: 1286 },
    { x: 2158, y: 1572 },
    { x: 2098, y: 1572 },
    { x: 2098, y: 293 },
    { x: 643,  y: 293 },
    { x: 643,  y: 626 },
    { x: 591,  y: 673 },
    { x: 641,  y: 712 },

    { x: 568,  y: 749 },
    { x: 568,  y: 1286 },
    { x: 2158, y: 1286 },
    { x: 2158, y: 1572 },
    { x: 2098, y: 1572 },
    { x: 2098, y: 293 },
    { x: 643,  y: 293 },
    { x: 643,  y: 626 },
    { x: 591,  y: 673 },
    { x: 641,  y: 712 },

    { x: 568,  y: 749 },
    { x: 568,  y: 1286 },
    { x: 2158, y: 1286 },
    { x: 2158, y: 1572 },
    { x: 2098, y: 1572 },
    { x: 2098, y: 293 },
    { x: 643,  y: 293 },
    { x: 643,  y: 626 },
    { x: 591,  y: 673 },
    { x: 34,   y: 673 }
  ];

  enemy.path = enemy.bossShowcasePath;
  enemy.bossLoopPath = enemy.bossShowcasePath;
  enemy.bossExitPath = [];
  enemy.bossUsingExitPath = false;
  enemy.x = enemy.bossShowcasePath[0].x;
  enemy.y = enemy.bossShowcasePath[0].y;
  enemy.targetIndex = 1;
  enemy.bossLoopPathConfigured = true;
}

const ENEMY_TYPES = {
  green: {
    key: "green",
    file: "Green_Slime.gif",
    hp: 40,
    speed: 2.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 4,
    type: "Basic",
    trait: "Easy gold",
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
    type: "Speed",
    trait: "Fast",
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
    type: "High speed",
    trait: "Tempo pressure",
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
    type: "Resist",
    trait: "Low physical resist",
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
    type: "Advanced",
    trait: "Fast and tough",
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
    type: "Resist",
    trait: "Medium magic resist",
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
    type: "Resist",
    trait: "High magic resist",
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
    type: "Resist",
    trait: "High physical resist",
    canFly: false,
    canSplit: false,
    size: 76
  },

  split_parent: {
    key: "split_parent",
    file: "Mother_Slime.gif",
    hp: 220,
    speed: 2.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 12,
    type: "Mechanic",
    trait: "Splits into 4 on death",
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
    speed: 4.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 0,
    type: "Mechanic",
    trait: "Fast burst",
    canFly: false,
    canSplit: false,
    size: 48
  },

  king_boss: {
    key: "king_boss",
    file: "King_Slime.gif",
    hp: 6000,
    speed: 1.8,
    armor: 0.60,
    magicResist: 1.2,
    gold: 150,
    type: "Boss",
    trait: "Death split + attacks highest-value tower",
    canFly: false,
    canSplit: false,
    size: 220
  },

  boss_fragment_child: {
    key: "boss_fragment_child",
    file: "Baby_Slime.gif",
    hp: 560,
    speed: 0,
    armor: 0.85,
    magicResist: 1.0,
    gold: 0,
    type: "Boss Mechanic",
    trait: "Must be defeated before the Boss revives",
    canFly: false,
    canSplit: false,
    size: 92
  },

  dungeon: {
    key: "dungeon",
    file: "Dungeon_Slime.gif",
    hp: 600,
    speed: 1.8,
    armor: 0.75,
    magicResist: 1.0,
    gold: 40,
    type: "Elite",
    trait: "High HP",
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
    type: "Elite",
    trait: "High resist",
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
    type: "Ultimate",
    trait: "Very high resist",
    canFly: false,
    canSplit: false,
    size: 98
  },

  fly: {
    key: "fly",
    file: "Gastropod.gif",
    hp: 110,
    speed: 3.5,
    armor: 1.0,
    magicResist: 1.0,
    gold: 7,
    type: "Flying",
    trait: "Basic flyer",
    canFly: true,
    canSplit: false,
    size: 64
  },

  psychic_slug: {
    key: "psychic_slug",
    file: "Spectral_Gastropod.gif",
    hp: 180,
    speed: 3.0,
    armor: 1.0,
    magicResist: 1.0,
    gold: 10,
    type: "Flying",
    trait: "Enhanced flyer",
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

    this.isBoss = this.typeKey === "king_boss";
    // Boss-only timers live on Enemy so the wave system can still treat the Boss as one enemy.
    this.bossAttackRange = 320 * this.getSafeUiScale();
    this.bossStunCooldown = 400;
    this.bossDestroyCooldown = 900;
    this.bossDestroyUnlockDelay = 600;
    this.bossLastStunFrame = -999999;
    this.bossLastDestroyFrame = -999999;
    this.fragmentStunCooldown = BOSS_FRAGMENT_STUN_COOLDOWN;
    this.fragmentStunDuration = 100;
    this.fragmentLastStunFrame = -999999;
    this.fragmentingStartedFrame = 0;
    this.fragmentingStartMs = 0;
    this.fragmentFlightDuration = 96;
    this.fragmentReturnDuration = 150;
    this.stunDurationFrames = 150;
    this.bossAttackFlashTimer = 0;
    this.bossAttackEffectType = "stun";
    this.lastBossTargetX = 0;
    this.lastBossTargetY = 0;
    this.hitFlashTimer = 0;
    this.requiredLaps = this.isBoss ? 2 : 1;
    this.completedLaps = 0;
    this.lapTransitionTimer = 0;
    this.bossPhase = this.isBoss ? "alive" : "alive";
    this.reviveUsed = false;
    this.reviveHpRatio = 0.8;
    this.reviveCount = 0;
    this.maxRevives = 3;
    this.maxHpDecayRate = 0.9;
    this.requiredLaps = this.isBoss ? 3 : 1;
    this.bossFragments = [];
    this.bossDeathCenterX = 0;
    this.bossDeathCenterY = 0;
    this.cachedTargetIndex = 1;
    this.cachedCompletedLaps = 0;
    this.cachedPathMode = "default";
    this.reviveFlashTimer = 0;
    this.bossSpawnFrame = this.getBossLogicFrame();
    this.debugBossPathLogged = false;

    configureKingBossLoopPath(this);
  }

  takeDamage(baseDamage, damageType = "physical") {
    if (this.dead) return 0;
    if (this.isBoss && this.bossPhase === "fragmenting") return 0;

    // Armor and magic resist are multipliers, so tests guard these values carefully.
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
      if (this.isBoss && this.reviveCount < this.maxRevives) {
        // Lethal Boss damage enters split/revive flow instead of granting a reward immediately.
        this.startBossFragmenting();
        return finalDamage;
      } else {
        // Final Boss death only happens after all revives have already been used.
        this.dead = true;
      }
    }
    if (this.isBoss && finalDamage > 0) {
      this.hitFlashTimer = 8;
    }

    return finalDamage;
  }

  update() {
    this.logBossPathDebugOnce();

    if (this.hitFlashTimer > 0) this.hitFlashTimer--;
    if (this.lapTransitionTimer > 0) this.lapTransitionTimer--;
    if (this.reviveFlashTimer > 0) this.reviveFlashTimer--;

    if (this.isBoss && this.bossPhase === "fragmenting") {
      this.updateBossFragmenting();
      return;
    }

    if (this.slowTimer > 0) {
      this.slowTimer--;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowFactor = 1;
      }
    }

    if (this.reachedEnd || this.dead) return;

    if (this.targetIndex >= this.path.length) {
      if (this.tryHandleBossPathAtPathEnd()) {
        // boss-specific loop/exit path handling
        if (this.reachedEnd) return;
      } else if (this.isBoss && Array.isArray(this.bossShowcasePath) && this.path === this.bossShowcasePath) {
        this.reachedEnd = true;
        return;
      } else {
        this.reachedEnd = true;
        return;
      }
    }

    let target = this.path[this.targetIndex];
    if (!target) {
      this.reachedEnd = true;
      return;
    }
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    let d = dist(this.x, this.y, target.x, target.y);

    let currentSpeed = this.speed * this.slowFactor;

    if (d <= currentSpeed) {
      this.x = target.x;
      this.y = target.y;
      this.targetIndex++;

      if (this.targetIndex >= this.path.length) {
        if (this.tryHandleBossPathAtPathEnd()) {
          // boss-specific loop/exit path handling
        } else if (this.isBoss && Array.isArray(this.bossShowcasePath) && this.path === this.bossShowcasePath) {
          this.reachedEnd = true;
        } else {
          this.reachedEnd = true;
        }
      }
    } else if (d > 0) {
      this.x += (dx / d) * currentSpeed;
      this.y += (dy / d) * currentSpeed;
    }

    if (this.isBoss && !this.dead && !this.reachedEnd) {
      this.updateBossAbility();
    }
  }

  tryHandleBossPathAtPathEnd() {
    if (!this.isBoss || this.bossPhase === "fragmenting") return false;
    if (Array.isArray(this.bossShowcasePath) && this.path === this.bossShowcasePath) {
      this.reachedEnd = true;
      return true;
    }
    return false;
  }

  startBossFragmenting() {
    if (this.bossPhase === "fragmenting") return;
    // Cache route progress so the Boss can revive at the death location and continue naturally.
    this.bossPhase = "fragmenting";
    this.dead = false;
    this.reachedEnd = false;
    this.bossDeathCenterX = this.x;
    this.bossDeathCenterY = this.y;
    this.cachedTargetIndex = this.targetIndex;
    this.cachedCompletedLaps = this.completedLaps;
    this.cachedPathMode = (Array.isArray(this.bossShowcasePath) && this.path === this.bossShowcasePath)
      ? "showcase"
      : "default";
    this.fragmentingStartedFrame = this.getBossLogicFrame();
    this.fragmentingStartMs = getBossRealTimeMs();
    if (this.maxHp > 1) {
      this.maxHp = Math.max(1, Math.round(this.maxHp * this.maxHpDecayRate));
    }
    this.bossFragments = [];
    this.initBossFragments();
    if (typeof spawnBossVfx === "function") {
      spawnBossVfx("split_burst", this.bossDeathCenterX, this.bossDeathCenterY, { size: this.w * 3.6 });
    }
  }

  initBossFragments() {
    const scale = this.getSafeUiScale();
    const targets = this.generateBossFragmentTrackTargets(BOSS_FRAGMENT_COUNT, BOSS_FRAGMENT_MIN_DISTANCE * scale);
    const fragmentType = ENEMY_TYPES.boss_fragment_child;
    this.bossFragments = targets.map((target, index) => ({
      isBossFragment: true,
      ownerBoss: this,
      typeKey: "boss_fragment_child",
      data: fragmentType,
      startX: this.bossDeathCenterX,
      startY: this.bossDeathCenterY,
      targetX: target.x,
      targetY: target.y,
      pathProgress: target.pathProgress || 0,
      x: this.bossDeathCenterX,
      y: this.bossDeathCenterY,
      maxHp: fragmentType.hp,
      hp: fragmentType.hp,
      armor: fragmentType.armor,
      magicResist: fragmentType.magicResist,
      rewardGold: 0,
      canFly: false,
      canSplit: false,
      dead: false,
      defeated: false,
      attackable: true,
      canAttack: true,
      handled: false,
      recalled: false,
      reachedEnd: false,
      landed: false,
      phase: "outbound",
      flightDuration: this.fragmentFlightDuration,
      launchDelay: index * 8,
      attackCooldown: 0,
      nextAttackFrame: 0,
      trail: [],
      impactTimer: 0,
      hitFlashTimer: 0,
      roamStartX: this.bossDeathCenterX,
      roamStartY: this.bossDeathCenterY,
      roamTargetX: target.x,
      roamTargetY: target.y,
      roamStartedFrame: 0,
      roamDuration: 120,
      returnStartX: this.bossDeathCenterX,
      returnStartY: this.bossDeathCenterY,
      returnStartedFrame: 0,
      returnProgress: 0,
      angleOffset: target.angleOffset || index * HALF_PI,
      takeDamage(baseDamage, damageType = "physical") {
        if (this.dead || this.defeated || this.handled || this.recalled || this.attackable === false) return 0;

        const safeDamage = max(0, baseDamage);
        const multiplier = damageType === "magic"
          ? (this.magicResist == null ? 1.0 : this.magicResist)
          : (this.armor == null ? 1.0 : this.armor);
        const finalDamage = max(1, safeDamage * multiplier);

        this.hp -= finalDamage;
        this.hp = constrain(this.hp, 0, this.maxHp);
        this.hitFlashTimer = 8;

        if (this.hp <= 0) {
          this.hp = 0;
          this.defeated = true;
          this.attackable = false;
          this.canAttack = false;
          this.handled = true;
          this.recalled = false;
          this.reachedEnd = true;
          this.phase = "defeated";
          this.trail = [];
        }

        return finalDamage;
      },
      applySlow() {}
    }));
    for (let frag of this.bossFragments) {
      frag.size = this.w * 0.62;
      frag.pulse = random(0, TWO_PI);
    }
    this.fragmentLastStunFrame = this.getBossLogicFrame();
  }

  generateBossFragmentTrackTargets(count, minSpacing) {
    // Path-based fragment spawn covers the current map route.
    const pathData = this.buildBossFragmentPathSegments();
    if (!pathData || pathData.totalLength <= 0) {
      return this.generateBossFragmentFallbackTargets(count, minSpacing);
    }

    const targets = [];
    const total = pathData.totalLength;
    const segmentLength = total / Math.max(1, count);
    const offsetRange = BOSS_FRAGMENT_PATH_OFFSET * this.getSafeUiScale();

    for (let i = 0; i < count; i++) {
      let best = null;
      for (let attempt = 0; attempt < 24; attempt++) {
        const distance = Math.min(total, segmentLength * i + random(segmentLength * 0.18, segmentLength * 0.82));
        const point = this.sampleBossFragmentPathPoint(pathData.segments, distance, offsetRange);
        if (point && this.isValidBossFragmentPoint(point) && this.isBossFragmentPointClear(point, targets, minSpacing)) {
          best = point;
          break;
        }
        if (point && this.isValidBossFragmentPoint(point)) best = point;
      }

      if (!best) {
        const fallbackDistance = Math.min(total, segmentLength * (i + 0.5));
        best = this.sampleBossFragmentPathPoint(pathData.segments, fallbackDistance, 0);
      }
      if (!this.isValidBossFragmentPoint(best)) {
        best = this.generateBossFragmentFallbackTargets(1, minSpacing)[0];
      }

      targets.push(best);
    }

    return targets;
  }

  buildBossFragmentPathSegments() {
    const paths = this.getCurrentMapPathPointSets();
    const segments = [];
    let totalLength = 0;

    for (const path of paths) {
      if (!Array.isArray(path) || path.length < 2) continue;
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        if (!this.isValidPathPoint(a) || !this.isValidPathPoint(b)) continue;
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        if (!isFinite(length) || length <= 0) continue;
        segments.push({ a, b, length, start: totalLength });
        totalLength += length;
      }
    }

    return { segments, totalLength };
  }

  getCurrentMapPathPointSets() {
    const paths = [];
    if (Array.isArray(this.bossShowcasePath) && this.bossShowcasePath.length >= 2) {
      paths.push(this.bossShowcasePath);
    }
    if (typeof allPathPoints !== "undefined" && Array.isArray(allPathPoints)) {
      for (const path of allPathPoints) {
        if (Array.isArray(path) && path.length >= 2) paths.push(path);
      }
    }
    if (typeof currentMapData !== "undefined" && currentMapData) {
      if (Array.isArray(currentMapData.enemyPaths)) {
        for (const path of currentMapData.enemyPaths) {
          if (Array.isArray(path) && path.length >= 2) paths.push(path);
        }
      }
      if (Array.isArray(currentMapData.basePathPoints) && currentMapData.basePathPoints.length >= 2) {
        paths.push(currentMapData.basePathPoints);
      }
    }
    if (Array.isArray(this.path) && this.path.length >= 2) {
      paths.push(this.path);
    }

    return paths;
  }

  sampleBossFragmentPathPoint(segments, distance, offsetRange) {
    if (!Array.isArray(segments) || segments.length === 0) return null;
    const lastSegment = segments[segments.length - 1];
    let segment = lastSegment;
    for (const item of segments) {
      if (distance <= item.start + item.length) {
        segment = item;
        break;
      }
    }

    const localDistance = Math.max(0, Math.min(segment.length, distance - segment.start));
    const t = segment.length > 0 ? localDistance / segment.length : 0;
    const x = segment.a.x + (segment.b.x - segment.a.x) * t;
    const y = segment.a.y + (segment.b.y - segment.a.y) * t;
    const dx = segment.b.x - segment.a.x;
    const dy = segment.b.y - segment.a.y;
    const len = Math.hypot(dx, dy) || 1;
    const offset = offsetRange > 0 ? random(-offsetRange, offsetRange) : 0;
    const point = {
      x: x + (-dy / len) * offset,
      y: y + (dx / len) * offset,
      pathProgress: distance
    };
    return this.clampBossFragmentPoint(point, this.getBossFragmentBounds());
  }

  generateBossFragmentFallbackTargets(count, minSpacing) {
    // Safe fallback point generation when route data is unavailable.
    const bounds = this.getBossFragmentBounds();
    const targets = [];
    const attemptsPerFragment = BOSS_FRAGMENT_FALLBACK_ATTEMPTS;
    const zones = this.getBossFragmentTargetZones(bounds, count);

    for (let i = 0; i < count; i++) {
      const zone = zones[i % zones.length];
      let best = null;

      for (let attempt = 0; attempt < attemptsPerFragment; attempt++) {
        const candidate = this.clampBossFragmentPoint({
          x: random(zone.left, zone.right),
          y: random(zone.top, zone.bottom),
          angleOffset: TWO_PI * i / count
        }, bounds);

        if (this.isBossFragmentPointClear(candidate, targets, minSpacing)) {
          best = candidate;
          break;
        }

        if (!best) best = candidate;
      }

      targets.push(best || this.clampBossFragmentPoint({
        x: (zone.left + zone.right) * 0.5,
        y: (zone.top + zone.bottom) * 0.5,
        angleOffset: TWO_PI * i / count
      }, bounds));
    }

    return targets;
  }

  isValidPathPoint(point) {
    return !!point && Number.isFinite(point.x) && Number.isFinite(point.y);
  }

  isValidBossFragmentPoint(point) {
    return !!point && Number.isFinite(point.x) && Number.isFinite(point.y);
  }

  getBossFragmentTargetZones(bounds, count) {
    const midX = (bounds.left + bounds.right) * 0.5;
    const midY = (bounds.top + bounds.bottom) * 0.5;
    const inset = 35 * this.getSafeUiScale();
    const zones = [
      { left: bounds.left, top: bounds.top, right: midX - inset, bottom: midY - inset },
      { left: midX + inset, top: bounds.top, right: bounds.right, bottom: midY - inset },
      { left: bounds.left, top: midY + inset, right: midX - inset, bottom: bounds.bottom },
      { left: midX + inset, top: midY + inset, right: bounds.right, bottom: bounds.bottom },
      { left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom }
    ];
    return zones.slice(0, Math.max(1, Math.min(count, zones.length)));
  }

  getBossFragmentBounds() {
    const hasMapData = typeof currentMapData !== "undefined" && currentMapData;
    const mapW = typeof DESIGN_W === "number"
      ? DESIGN_W
      : (hasMapData && currentMapData.designW) || 2560;
    const mapH = typeof DESIGN_H === "number"
      ? DESIGN_H
      : (hasMapData && currentMapData.designH) || 1600;
    const margin = BOSS_FRAGMENT_BOUNDS_MARGIN * this.getSafeUiScale();
    return {
      left: margin,
      top: margin,
      right: mapW - margin,
      bottom: mapH - margin
    };
  }

  clampBossFragmentPoint(point, bounds) {
    // Clamp and sanitize fragment targets to avoid NaN coordinates.
    point = point || {};
    const fallbackX = (bounds.left + bounds.right) * 0.5;
    const fallbackY = (bounds.top + bounds.bottom) * 0.5;
    const x = Number.isFinite(point.x) ? point.x : fallbackX;
    const y = Number.isFinite(point.y) ? point.y : fallbackY;
    return {
      x: Math.max(bounds.left, Math.min(bounds.right, x)),
      y: Math.max(bounds.top, Math.min(bounds.bottom, y)),
      angleOffset: point.angleOffset || 0,
      pathProgress: point.pathProgress || 0
    };
  }

  isBossFragmentPointClear(point, existingTargets, minSpacing) {
    for (const other of existingTargets) {
      if (Math.hypot(point.x - other.x, point.y - other.y) < minSpacing) return false;
    }

    const slotAvoidDistance = 110 * this.getSafeUiScale();
    const hasMapData = typeof currentMapData !== "undefined" && currentMapData;
    const slots = typeof towerSlots !== "undefined" && Array.isArray(towerSlots) && towerSlots.length > 0
      ? towerSlots
      : (hasMapData && Array.isArray(currentMapData.baseTowerSlots) ? currentMapData.baseTowerSlots : []);
    for (const slot of slots) {
      if (!slot || typeof slot.x !== "number" || typeof slot.y !== "number") continue;
      if (Math.hypot(point.x - slot.x, point.y - slot.y) < slotAvoidDistance) return false;
    }

    return true;
  }

  updateBossFragmenting() {
    if (!this.isBoss || this.dead) return;

    const now = this.getBossLogicFrame();
    const elapsed = now - this.fragmentingStartedFrame;
    const elapsedMs = getBossRealTimeMs() - this.fragmentingStartMs;

    this.bossFragments = this.bossFragments.filter(frag => frag && !frag.dead);
    const durationReached = elapsedMs >= BOSS_FRAGMENT_DURATION_MS;
    if (durationReached) {
      // Prevent revive deadlock by recalling unresolved fragments on timeout.
      this.recallBossFragments();
      this.finishBossRevive();
      return;
    }

    for (let frag of this.bossFragments) {
      if (frag.hitFlashTimer > 0) frag.hitFlashTimer--;
      if (frag.defeated || frag.handled) continue;
      // Fragments remain attackable on the map until players destroy them.
      this.updateBossFragmentFlight(frag, elapsed);
      frag.pulse += 0.1;
    }

    this.updateFragmentStunAbility();

    // The split duration is real time based and is intentionally independent of game speed.
  }

  recallBossFragments() {
    if (!Array.isArray(this.bossFragments)) return;
    for (const frag of this.bossFragments) {
      if (!frag || frag.dead || frag.handled) continue;
      // Recalled fragments are visual-only and no longer targetable.
      frag.recalled = true;
      frag.handled = true;
      frag.attackable = false;
      frag.canAttack = false;
      frag.reachedEnd = true;
      frag.phase = "recalled";
      frag.trail = [];
      frag.hitFlashTimer = 0;
    }
  }

  updateBossFragmentFlight(frag, elapsed) {
    if (!frag) return;
    if (frag.impactTimer > 0) frag.impactTimer--;

    // Returning fragments stop roaming and fly back to the revive center.
    if (frag.phase === "returning") {
      this.updateBossFragmentReturn(frag, elapsed);
      return;
    }

    // Roaming keeps fragments near the boss route without adding real enemies.
    if (frag.phase === "roaming") {
      this.updateBossFragmentRoaming(frag, elapsed);
      return;
    }

    const localFrame = elapsed - (frag.launchDelay || 0);
    if (localFrame <= 0) {
      frag.x = frag.startX;
      frag.y = frag.startY;
      return;
    }

    const duration = Math.max(1, frag.flightDuration || this.fragmentFlightDuration || 80);
    // Outbound flight uses an arc so each lava fragment visibly leaves the Boss.
    const t = Math.max(0, Math.min(1, localFrame / duration));
    const eased = 1 - Math.pow(1 - t, 3);
    const arc = -80 * this.getSafeUiScale() * sin(t * PI);

    frag.x = frag.startX + (frag.targetX - frag.startX) * eased;
    frag.y = frag.startY + (frag.targetY - frag.startY) * eased + arc;

    if (Array.isArray(frag.trail)) {
      frag.trail.push({ x: frag.x, y: frag.y, alpha: 180 });
      if (frag.trail.length > 12) frag.trail.shift();
    }

    if (t >= 1) {
      frag.x = frag.targetX;
      frag.y = frag.targetY;
      frag.landed = true;
      frag.phase = "roaming";
      frag.impactTimer = 18;
      this.assignBossFragmentRoamTarget(frag, elapsed);
    }
  }

  updateBossFragmentRoaming(frag, elapsed) {
    if (!frag) return;
    if (!frag.roamStartedFrame || elapsed - frag.roamStartedFrame >= frag.roamDuration) {
      this.assignBossFragmentRoamTarget(frag, elapsed);
    }

    const duration = Math.max(1, frag.roamDuration || 120);
    const t = Math.max(0, Math.min(1, (elapsed - frag.roamStartedFrame) / duration));
    const eased = t * t * (3 - 2 * t);

    frag.x = frag.roamStartX + (frag.roamTargetX - frag.roamStartX) * eased;
    frag.y = frag.roamStartY + (frag.roamTargetY - frag.roamStartY) * eased;

    if (Array.isArray(frag.trail)) {
      frag.trail.push({ x: frag.x, y: frag.y, alpha: 120 });
      if (frag.trail.length > 8) frag.trail.shift();
    }
  }

  assignBossFragmentRoamTarget(frag, elapsed) {
    if (!frag) return;

    // Roam targets stay near the showcase path so fragments feel connected to the route.
    const target = this.sampleBossPathPointNear(frag.x, frag.y, 120 * this.getSafeUiScale(), 360 * this.getSafeUiScale(), 45 * this.getSafeUiScale());
    frag.roamStartX = frag.x;
    frag.roamStartY = frag.y;
    if (target) {
      frag.roamTargetX = target.x;
      frag.roamTargetY = target.y;
    } else {
      const bounds = this.getBossFragmentBounds();
      const angle = random(0, TWO_PI);
      const distance = random(55 * this.getSafeUiScale(), 120 * this.getSafeUiScale());
      const fallbackTarget = this.clampBossFragmentPoint({
        x: frag.x + cos(angle) * distance,
        y: frag.y + sin(angle) * distance
      }, bounds);
      frag.roamTargetX = fallbackTarget.x;
      frag.roamTargetY = fallbackTarget.y;
    }
    frag.roamStartedFrame = elapsed;
    frag.roamDuration = random(90, 150);
  }

  sampleBossPathPointNear(centerX, centerY, minDist, maxDist, jitter) {
    const sourcePath = Array.isArray(this.bossShowcasePath) ? this.bossShowcasePath : this.path;
    if (!Array.isArray(sourcePath) || sourcePath.length < 2) return null;

    // Use route offsets so fragments move near the path without stacking.
    const candidates = [];
    const step = 44 * this.getSafeUiScale();
    for (let i = 0; i < sourcePath.length - 1; i++) {
      const a = sourcePath[i];
      const b = sourcePath[i + 1];
      if (!a || !b || typeof a.x !== "number" || typeof a.y !== "number" || typeof b.x !== "number" || typeof b.y !== "number") continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (!isFinite(len) || len <= 0) continue;

      const samples = Math.max(1, Math.ceil(len / step));
      for (let j = 0; j <= samples; j++) {
        const t = j / samples;
        const x = a.x + dx * t;
        const y = a.y + dy * t;
        const d = Math.hypot(x - centerX, y - centerY);
        if (d >= minDist && d <= maxDist) {
          candidates.push({ x, y });
        }
      }
    }

    if (candidates.length === 0) return null;
    const point = candidates[floor(random(candidates.length))];
    const angle = random(0, TWO_PI);
    const offset = random(15 * this.getSafeUiScale(), jitter);
    return {
      x: point.x + cos(angle) * offset,
      y: point.y + sin(angle) * offset
    };
  }

  ensureBossFragmentReturning(frag, elapsed) {
    if (!frag || frag.phase === "returning" || frag.phase === "returned") return;

    // The returning phase locks the fragment out of attacks and sends it back to the revive center.
    frag.phase = "returning";
    frag.landed = false;
    frag.returnStartX = frag.x;
    frag.returnStartY = frag.y;
    frag.returnStartedFrame = elapsed;
    frag.returnProgress = 0;
  }

  updateBossFragmentReturn(frag, elapsed) {
    const duration = Math.max(1, this.fragmentReturnDuration || 150);
    const t = Math.max(0, Math.min(1, (elapsed - frag.returnStartedFrame) / duration));
    const eased = t * t * (3 - 2 * t);
    const arc = -50 * this.getSafeUiScale() * sin(t * PI);

    frag.x = frag.returnStartX + (this.bossDeathCenterX - frag.returnStartX) * eased;
    frag.y = frag.returnStartY + (this.bossDeathCenterY - frag.returnStartY) * eased + arc;
    frag.returnProgress = t;

    if (Array.isArray(frag.trail)) {
      frag.trail.push({ x: frag.x, y: frag.y, alpha: 150 });
      if (frag.trail.length > 12) frag.trail.shift();
    }

    if (t >= 1) {
      frag.x = this.bossDeathCenterX;
      frag.y = this.bossDeathCenterY;
      frag.phase = "returned";
      frag.trail = [];
    }
  }

  finishBossRevive() {
    const now = this.getBossLogicFrame();
    // Revive restores the Boss body after the fragment state machine has fully completed.
    this.bossFragments = [];
    this.bossPhase = "revived";
    this.reviveCount++;
    this.reviveUsed = this.reviveCount > 0;
    this.hp = Math.max(1, Math.round(this.maxHp * this.reviveHpRatio));
    if (this.reviveCount >= 3) {
      this.armor = 0.40;
      this.magicResist = 0.75;
    } else if (this.reviveCount >= 2) {
      this.armor = 0.45;
      this.magicResist = 0.85;
    } else if (this.reviveCount >= 1) {
      this.armor = 0.50;
      this.magicResist = 1.0;
    }
    this.dead = false;
    this.reachedEnd = false;
    this.x = this.bossDeathCenterX;
    this.y = this.bossDeathCenterY;
    if (Array.isArray(this.bossShowcasePath) && this.cachedPathMode === "showcase") {
      this.path = this.bossShowcasePath;
    }
    this.targetIndex = Math.max(1, Math.min(this.cachedTargetIndex || 1, this.path.length - 1));
    this.completedLaps = Math.max(0, this.cachedCompletedLaps || 0);
    this.reviveFlashTimer = 24;
    this.bossLastDestroyFrame = Math.max(this.bossLastDestroyFrame, now);
    if (typeof spawnBossVfx === "function") {
      spawnBossVfx("revive", this.x, this.y, { size: this.w * 4.0 });
    }
  }

  getBossLogicFrame() {
    if (typeof getGameFrameCount === "function") {
      return getGameFrameCount();
    }
    if (typeof frameCount !== "undefined") {
      return frameCount;
    }
    return 0;
  }

  getSafeUiScale() {
    if (typeof uiScale === "number" && isFinite(uiScale) && uiScale > 0) {
      return uiScale;
    }
    return 1;
  }

  getTowerValue(tower) {
    if (!tower || typeof tower !== "object") return 0;
    const spent = Number(tower.totalSpent);
    if (isFinite(spent) && spent >= 0) return spent;
    if (typeof TOWER_COST !== "undefined" && TOWER_COST && tower.type in TOWER_COST) {
      const fallbackCost = Number(TOWER_COST[tower.type]);
      if (isFinite(fallbackCost) && fallbackCost >= 0) return fallbackCost;
    }
    return 0;
  }

  findHighestValueTowerInRange() {
    if (typeof towers === "undefined" || !Array.isArray(towers) || towers.length === 0) {
      return null;
    }

    // Boss pressure targets the most invested tower within range, with distance as a tie-breaker.
    const scale = this.getSafeUiScale();
    const range = this.bossAttackRange || 320 * scale;
    let bestTower = null;
    let bestValue = -1;
    let bestDist = Infinity;

    for (const tower of towers) {
      if (!tower || typeof tower.x !== "number" || typeof tower.y !== "number") continue;

      const dx = tower.x - this.x;
      const dy = tower.y - this.y;
      const d = Math.hypot(dx, dy);
      if (!isFinite(d) || d > range) continue;

      const value = this.getTowerValue(tower);
      if (value > bestValue || (value === bestValue && d < bestDist)) {
        bestTower = tower;
        bestValue = value;
        bestDist = d;
      }
    }

    return bestTower;
  }

  updateBossAbility() {
    if (!this.isBoss || this.dead || this.reachedEnd || this.bossPhase === "fragmenting") return;
    if (typeof resultOverlay !== "undefined" && resultOverlay && resultOverlay.active) return;
    if (typeof gameState !== "undefined" && gameState !== "playing") return;

    // Boss attacks are gated by cooldowns and disabled while the game is not actively playing.
    if (this.bossAttackFlashTimer > 0) {
      this.bossAttackFlashTimer--;
    }

    const now = this.getBossLogicFrame();
    const targetTower = this.findHighestValueTowerInRange();
    if (!targetTower) return;

    const canDestroy = (
      now - this.bossSpawnFrame >= this.bossDestroyUnlockDelay &&
      now - this.bossLastDestroyFrame >= this.bossDestroyCooldown
    );

    this.lastBossTargetX = targetTower.x;
    this.lastBossTargetY = targetTower.y;
    if (canDestroy) {
      // Destroy attacks prefer a projectile so players can read the hit before a tower disappears.
      if (typeof spawnBossProjectile === "function") {
        const didFire = spawnBossProjectile({
          type: "destroy",
          sourceX: this.x,
          sourceY: this.y,
          targetTower
        });
        if (didFire) {
          this.bossAttackFlashTimer = 18;
          this.bossAttackEffectType = "destroy";
          this.bossLastDestroyFrame = now;
          return;
        }
      } else if (typeof destroyTowerByBoss === "function") {
        const didDestroy = destroyTowerByBoss(targetTower, this.x, this.y);
        if (didDestroy) {
          this.bossAttackFlashTimer = 22;
          this.bossAttackEffectType = "destroy";
          this.bossLastDestroyFrame = now;
          return;
        }
      }
    }

    if (now - this.bossLastStunFrame >= this.bossStunCooldown) {
      // Stun attacks use the same visual projectile path but apply a non-destructive effect.
      if (typeof spawnBossProjectile === "function") {
        const didFire = spawnBossProjectile({
          type: "stun",
          sourceX: this.x,
          sourceY: this.y,
          targetTower,
          stunDuration: this.stunDurationFrames
        });
        if (didFire) {
          this.bossAttackFlashTimer = 12;
          this.bossAttackEffectType = "stun";
          this.bossLastStunFrame = now;
        }
      } else if (typeof stunTowerByBoss === "function") {
        const didStun = stunTowerByBoss(targetTower, this.x, this.y, this.stunDurationFrames);
        if (didStun) {
          this.bossAttackFlashTimer = 18;
          this.bossAttackEffectType = "stun";
          this.bossLastStunFrame = now;
        }
      }
    }
  }

  updateFragmentStunAbility() {
    if (!this.isBoss || this.bossPhase !== "fragmenting") return;
    const now = this.getBossLogicFrame();
    if (!Array.isArray(this.bossFragments)) return;

    for (const sourceFragment of this.bossFragments) {
      if (!sourceFragment || sourceFragment.defeated || sourceFragment.handled || sourceFragment.recalled) continue;
      if (sourceFragment.canAttack === false || sourceFragment.attackable === false || sourceFragment.hp <= 0) continue;
      if (sourceFragment.phase !== "roaming") continue;
      if (now < (sourceFragment.nextAttackFrame || 0)) continue;
      // Projectile cap protects the split phase from visual overload.
      if (typeof bossProjectiles !== "undefined" && Array.isArray(bossProjectiles) && bossProjectiles.length >= BOSS_FRAGMENT_PROJECTILE_CAP) return;

      const targetTower = this.findNearestTowerForBossFragment(sourceFragment);
      if (!targetTower) {
        sourceFragment.nextAttackFrame = now + 30;
        continue;
      }

      this.lastBossTargetX = targetTower.x;
      this.lastBossTargetY = targetTower.y;

      const canDestroy = (
        now - this.fragmentingStartedFrame >= this.bossDestroyUnlockDelay &&
        now - this.bossLastDestroyFrame >= this.bossDestroyCooldown
      );
      const attackType = canDestroy ? "destroy" : "stun";
      this.bossAttackFlashTimer = canDestroy ? 18 : 14;
      this.bossAttackEffectType = attackType;
      // Fragments reuse the Boss projectile attacks so the split phase reads like smaller Boss bodies.
      if (typeof spawnBossProjectile === "function") {
        const didFire = spawnBossProjectile({
          type: attackType,
          sourceX: sourceFragment.x,
          sourceY: sourceFragment.y,
          targetTower,
          stunDuration: this.fragmentStunDuration
        });
        if (didFire) {
          sourceFragment.nextAttackFrame = now + this.fragmentStunCooldown;
          this.fragmentLastStunFrame = now;
          if (canDestroy) {
            this.bossLastDestroyFrame = now;
          }
        }
      } else if (typeof stunTowerByBoss === "function") {
        const didStun = stunTowerByBoss(targetTower, sourceFragment.x, sourceFragment.y, this.fragmentStunDuration);
        if (didStun) {
          sourceFragment.nextAttackFrame = now + this.fragmentStunCooldown;
          this.fragmentLastStunFrame = now;
        }
      }
    }
  }

  findNearestTowerForBossFragment(frag) {
    // Nearest built tower targeting for mini Boss attacks.
    if (!frag || typeof towers === "undefined" || !Array.isArray(towers) || towers.length === 0) return null;
    let bestTower = null;
    let bestDist = Infinity;

    for (const tower of towers) {
      if (!this.isValidBossFragmentTower(tower)) continue;
      const d = Math.hypot(tower.x - frag.x, tower.y - frag.y);
      if (!isFinite(d)) continue;
      if (d < bestDist) {
        bestTower = tower;
        bestDist = d;
      }
    }

    return bestTower;
  }

  isValidBossFragmentTower(tower) {
    if (!tower) return false;
    if (!Number.isFinite(tower.x) || !Number.isFinite(tower.y)) return false;
    if (tower.dead || tower.destroyed || tower.disabled || tower.active === false) return false;
    return true;
  }

  displayBossAttackEffect() {
    if (!this.isBoss || this.dead || this.bossAttackFlashTimer <= 0) return;

    // This flash supports the projectile effect without replacing the projectile itself.
    const scale = this.getSafeUiScale();
    const t = this.bossAttackFlashTimer / 18;
    const alpha = 70 * t;
    const isDestroy = this.bossAttackEffectType === "destroy";
    const r = isDestroy ? 255 : 120;
    const g = isDestroy ? 140 : 255;
    const b = isDestroy ? 40 : 110;

    push();
    noFill();
    stroke(r, g, b, alpha);
    strokeWeight(isDestroy ? 3 * scale : 2 * scale);
    ellipse(this.x, this.y, this.bossAttackRange * 1.2, this.bossAttackRange * 1.2);

    noStroke();
    fill(r, g, b, alpha);
    ellipse(this.lastBossTargetX, this.lastBossTargetY, (isDestroy ? 24 : 18) * scale, (isDestroy ? 24 : 18) * scale);
    pop();
  }

  applySlow(factor, duration) {
    this.slowFactor = factor;
    this.slowTimer = duration;
  }

  displayBody() {
    if (this.dead) return;

    const enemyImg = enemyImages[this.typeKey] || enemyImages.green || enemyGif;
    const scale = this.getSafeUiScale();
    const bossVisualScale = this.isBoss ? 1.15 : 1;
    // Visual-only scale keeps Boss combat coordinates unchanged.
    const visualW = this.w * bossVisualScale;
    const visualH = this.h * bossVisualScale;
    const visualY = this.isBoss ? this.y - 54 * scale : this.y;

    if (this.isBoss) {
      const pulse = 1 + sin((typeof frameCount !== "undefined" ? frameCount : 0) * 0.08) * 0.08;
      const auraOuter = this.bossPhase === "revived" ? [255, 110, 140, 120] : [255, 210, 120, 90];
      const auraInner = this.bossPhase === "revived" ? [210, 80, 255, 110] : [255, 150, 80, 70];
      push();
      noStroke();
      fill(20, 16, 12, 95);
      ellipse(this.x, this.y + visualH * 0.30, visualW * 0.72, visualH * 0.22);
      pop();

      push();
      noFill();
      stroke(auraOuter[0], auraOuter[1], auraOuter[2], auraOuter[3]);
      strokeWeight(3 * scale);
      ellipse(this.x, visualY, visualW * 1.05 * pulse, visualH * 1.05 * pulse);
      stroke(auraInner[0], auraInner[1], auraInner[2], auraInner[3]);
      strokeWeight(2 * scale);
      ellipse(this.x, visualY, visualW * 1.22 * pulse, visualH * 1.22 * pulse);
      pop();
    }

    push();

    if (this.hitFlashTimer > 0) {
      tint(255, 180, 180);
    } else if (this.slowFactor < 1) {
      tint(70, 145, 255);
    } else {
      noTint();
    }

    imageMode(CENTER);
    image(enemyImg, this.x, visualY, visualW, visualH);
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

    if (this.isBoss && this.lapTransitionTimer > 0) {
      const ratio = this.lapTransitionTimer / 24;
      push();
      noFill();
      stroke(255, 210, 80, 190 * ratio);
      strokeWeight(5 * scale);
      ellipse(this.x, this.y, this.w * (1.1 + (1 - ratio) * 0.5), this.h * (1.1 + (1 - ratio) * 0.5));
      pop();
    }

    if (this.isBoss && this.bossPhase === "fragmenting" && Array.isArray(this.bossFragments)) {
      if (typeof bossEffectImages !== "undefined" && bossEffectImages.vortex && typeof drawBossVfxImage === "function") {
        const remainingMs = Math.max(0, BOSS_FRAGMENT_DURATION_MS - (getBossRealTimeMs() - this.fragmentingStartMs));
        const finalPulse = remainingMs <= 750 ? 1 + (750 - remainingMs) / 750 * 0.55 : 1;
        const pulse = (1 + 0.12 * sin((typeof frameCount !== "undefined" ? frameCount : 0) * 0.08)) * finalPulse;
        const rotation = (typeof frameCount !== "undefined" ? frameCount : 0) * 0.018;
        drawBossVfxImage(bossEffectImages.vortex, this.bossDeathCenterX, this.bossDeathCenterY, this.w * 2.8 * pulse, 215, rotation);
      }

      push();
      noFill();
      blendMode(ADD);
      const corePulse = 1 + 0.18 * sin((typeof frameCount !== "undefined" ? frameCount : 0) * 0.16);
      stroke(255, 90, 35, 180);
      strokeWeight(4 * scale);
      ellipse(this.bossDeathCenterX, this.bossDeathCenterY, this.w * 0.55 * corePulse, this.h * 0.55 * corePulse);
      stroke(210, 80, 255, 120);
      strokeWeight(2 * scale);
      ellipse(this.bossDeathCenterX, this.bossDeathCenterY, this.w * 0.82 * corePulse, this.h * 0.82 * corePulse);
      blendMode(BLEND);
      pop();

      const fragmentImg = enemyImages.king_boss || enemyImages.boss_fragment_child || enemyImages.split_child || enemyImg;
      for (let frag of this.bossFragments) {
        if (!frag || frag.dead) continue;

        if (Array.isArray(frag.trail) && frag.trail.length > 0 && !frag.landed) {
          push();
          blendMode(ADD);
          noStroke();
          for (let i = 0; i < frag.trail.length; i++) {
            const p = frag.trail[i];
            const ratio = (i + 1) / frag.trail.length;
            fill(255, 95, 25, 130 * ratio);
            ellipse(p.x, p.y, frag.size * 0.44 * ratio, frag.size * 0.44 * ratio);
            fill(190, 70, 255, 80 * ratio);
            ellipse(p.x, p.y, frag.size * 0.62 * ratio, frag.size * 0.62 * ratio);
          }
          blendMode(BLEND);
          pop();
        }

        push();
        imageMode(CENTER);
        if (frag.defeated || frag.handled) {
          tint(135, 135, 135, 125);
        } else if (!frag.landed) {
          blendMode(ADD);
          noStroke();
          fill(255, 120, 35, 130);
          ellipse(frag.x, frag.y, frag.size * 1.2, frag.size * 1.2);
          blendMode(BLEND);
          tint(255, 235);
        } else if (frag.hitFlashTimer > 0) {
          tint(255, 180, 180, 255);
        } else {
          tint(255, 220);
        }
        const displaySize = (frag.defeated || frag.handled) ? frag.size * 0.78 : frag.size;
        image(fragmentImg, frag.x, frag.y, displaySize, displaySize);
        noTint();
        noFill();
        if (frag.defeated || frag.handled) {
          stroke(180, 180, 180, 80);
        } else {
          stroke(frag.landed ? 255 : 255, frag.landed ? 120 : 150, frag.landed ? 210 : 45, frag.landed ? 120 : 170);
        }
        strokeWeight(2 * scale);
        ellipse(frag.x, frag.y, displaySize * (1.05 + 0.05 * sin(frag.pulse)), displaySize * (1.05 + 0.05 * sin(frag.pulse)));
        if (frag.landed && !frag.defeated && !frag.handled) {
          stroke(255, 120, 35, 90);
          ellipse(frag.x, frag.y, frag.size * 1.45, frag.size * 1.45);
        }
        if (frag.impactTimer > 0) {
          const impactRatio = frag.impactTimer / 18;
          stroke(255, 170, 60, 180 * impactRatio);
          strokeWeight(4 * scale);
          ellipse(frag.x, frag.y, frag.size * (1.1 + (1 - impactRatio) * 1.2), frag.size * (1.1 + (1 - impactRatio) * 1.2));
        }
        pop();

        if (frag.maxHp > 0) {
          const barW = frag.size * 0.82;
          const barH = 7 * scale;
          const hpRatio = Math.max(0, Math.min(1, frag.hp / frag.maxHp));
          push();
          noStroke();
          fill(frag.defeated || frag.handled ? 65 : 120, 0, 0, frag.defeated || frag.handled ? 130 : 210);
          rect(frag.x - barW / 2, frag.y - frag.size * 0.58, barW, barH);
          fill(frag.defeated || frag.handled ? 120 : 80, frag.defeated || frag.handled ? 120 : 255, frag.defeated || frag.handled ? 120 : 120, frag.defeated || frag.handled ? 130 : 230);
          rect(frag.x - barW / 2, frag.y - frag.size * 0.58, barW * hpRatio, barH);
          pop();
        }
      }
    }

    if (this.isBoss && this.reviveFlashTimer > 0) {
      const ratio = this.reviveFlashTimer / 24;
      push();
      noFill();
      stroke(255, 220, 120, 210 * ratio);
      strokeWeight(6 * scale);
      ellipse(this.x, this.y, this.w * (1.2 + (1 - ratio) * 0.6), this.h * (1.2 + (1 - ratio) * 0.6));
      pop();
    }

    this.displayBossPathDebugInfo();
    this.displayBossAttackEffect();
  }

  logBossPathDebugOnce() {
    if (!DEBUG_BOSS_PATH || !this.isBoss || this.debugBossPathLogged) return;
    this.debugBossPathLogged = true;

    const currentTarget = (Array.isArray(this.path) && this.targetIndex >= 0 && this.targetIndex < this.path.length)
      ? this.path[this.targetIndex]
      : null;
    const pathIsLoop = this.bossLoopPath === this.path;
    const pathIsExit = this.bossExitPath === this.path;
    const pathIsShowcase = this.bossShowcasePath === this.path;

    console.log("[BOSS_DEBUG:init]", {
      currentMap: typeof currentMap !== "undefined" ? currentMap : null,
      typeKey: this.typeKey,
      type: this.data ? this.data.type : null,
      pathIndex: typeof this.pathIndex !== "undefined" ? this.pathIndex : null,
      targetIndex: this.targetIndex,
      pathLength: Array.isArray(this.path) ? this.path.length : 0,
      bossUsingExitPath: !!this.bossUsingExitPath,
      hasBossLoopPath: Array.isArray(this.bossLoopPath),
      hasBossExitPath: Array.isArray(this.bossExitPath),
      hasBossShowcasePath: Array.isArray(this.bossShowcasePath),
      pathIsLoop,
      pathIsExit,
      pathIsShowcase,
      currentTarget,
      bossPos: { x: this.x, y: this.y },
      path: this.path,
      bossLoopPath: this.bossLoopPath,
      bossExitPath: this.bossExitPath,
      bossShowcasePath: this.bossShowcasePath
    });
  }

  displayBossPathDebugInfo() {
    if (!DEBUG_BOSS_PATH || !this.isBoss || this.dead) return;

    const target = (Array.isArray(this.path) && this.targetIndex >= 0 && this.targetIndex < this.path.length)
      ? this.path[this.targetIndex]
      : null;
    const scale = this.getSafeUiScale();
    const lines = [
      `phase=${this.bossPhase}`,
      `lap=${this.completedLaps}/${this.requiredLaps}`,
      `pathMode=${Array.isArray(this.bossShowcasePath) && this.path === this.bossShowcasePath ? "showcase" : "default"}`,
      `idx=${this.targetIndex} len=${Array.isArray(this.path) ? this.path.length : 0}`,
      `exit=${!!this.bossUsingExitPath}`,
      `target=${target ? `${Math.round(target.x)},${Math.round(target.y)}` : "none"}`,
      `pos=${Math.round(this.x)},${Math.round(this.y)}`,
      `showcasePath=${Array.isArray(this.bossShowcasePath)}`,
      `reachedEnd=${this.reachedEnd}`,
      `revive=${this.reviveCount}/${this.maxRevives}`,
      `loopPath=${Array.isArray(this.bossLoopPath)}`,
      `exitPath=${Array.isArray(this.bossExitPath)}`
    ];

    push();
    rectMode(CORNER);
    textAlign(LEFT, TOP);
    textSize(12 * scale);
    textFont("monospace");
    noStroke();
    fill(0, 0, 0, 170);
    const boxX = this.x + this.w * 0.38;
    const boxY = this.y - this.h * 0.7;
    const lineH = 14 * scale;
    rect(boxX - 6 * scale, boxY - 4 * scale, 210 * scale, lines.length * lineH + 8 * scale, 6 * scale);
    fill(255, 245, 170);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], boxX, boxY + i * lineH);
    }
    pop();
  }

  displayHealthBar() {
    if (this.dead) return;

    const scale = this.getSafeUiScale();
    const bossVisualScale = this.isBoss ? 1.15 : 1;
    const visualH = this.h * bossVisualScale;
    const barW = this.isBoss ? this.w * bossVisualScale * 0.9 : 50 * scale;
    const barH = this.isBoss ? 10 * scale : 6 * scale;
    const barX = this.x - barW * 0.5;
    const visualY = this.isBoss ? this.y - 54 * scale : this.y;
    const barY = this.isBoss ? visualY - visualH * 0.55 - 18 * scale : this.y - 46 * scale;

    let hpRatio = 0;
    if (this.maxHp > 0) {
      hpRatio = this.hp / this.maxHp;
    }
    hpRatio = Math.max(0, Math.min(1, hpRatio));
    const hpBarW = barW * hpRatio;

    push();
    if (this.isBoss) {
      stroke(0, 180);
      strokeWeight(2 * scale);
    } else {
      noStroke();
    }
    fill(255, 0, 0);
    rect(barX, barY, barW, barH);

    noStroke();
    fill(0, 255, 0);
    rect(barX, barY, hpBarW, barH);
    pop();
  }

  display() {
    this.displayBody();
    this.displayHealthBar();
  }
}