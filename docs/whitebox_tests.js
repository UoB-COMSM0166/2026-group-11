(function () {
  const resultsEl = document.getElementById("results");
  const summaryEl = document.getElementById("summary");
  const runBtn = document.getElementById("runTestsBtn");
  const clearBtn = document.getElementById("clearBtn");

  // p5 fallback helpers for test-only HTML context.
  // Define only when missing, so real p5 globals are never overridden.
  if (typeof window.dist !== "function") {
    window.dist = function (x1, y1, x2, y2) {
      return Math.hypot((x2 || 0) - (x1 || 0), (y2 || 0) - (y1 || 0));
    };
  }
  if (typeof window.max !== "function") {
    window.max = function (...args) {
      return Math.max(...args);
    };
  }
  if (typeof window.min !== "function") {
    window.min = function (...args) {
      return Math.min(...args);
    };
  }
  if (typeof window.random !== "function") {
    window.random = function (a, b) {
      if (typeof a === "undefined") return Math.random();
      if (typeof b === "undefined") return Math.random() * a;
      return a + Math.random() * (b - a);
    };
  }
  if (typeof window.constrain !== "function") {
    window.constrain = function (value, low, high) {
      return Math.max(low, Math.min(high, value));
    };
  }
  if (typeof window.floor !== "function") {
    window.floor = function (value) {
      return Math.floor(value);
    };
  }
  if (typeof window.ceil !== "function") {
    window.ceil = function (value) {
      return Math.ceil(value);
    };
  }
  if (typeof window.abs !== "function") {
    window.abs = function (value) {
      return Math.abs(value);
    };
  }
  if (typeof window.sqrt !== "function") {
    window.sqrt = function (value) {
      return Math.sqrt(value);
    };
  }
  if (typeof window.round !== "function") {
    window.round = Math.round;
  }
  if (typeof window.cos !== "function") {
    window.cos = Math.cos;
  }
  if (typeof window.sin !== "function") {
    window.sin = Math.sin;
  }
  if (typeof window.atan2 !== "function") {
    window.atan2 = Math.atan2;
  }
  if (typeof window.PI === "undefined") {
    window.PI = Math.PI;
  }
  if (typeof window.TWO_PI === "undefined") {
    window.TWO_PI = Math.PI * 2;
  }
  if (typeof window.HALF_PI === "undefined") {
    window.HALF_PI = Math.PI / 2;
  }

  function defineTestGlobals() {
    window.uiScale = 1;
    window.currentMap = 1;
    window.enemies = [];
    window.lasers = [];
    window.towers = [];
    window.towerSlots = [];
    window.selectedTower = null;
    window.pathPoints = [];
    window.allPathPoints = [];
    window.frameCount = 0;
  }

  defineTestGlobals();

  // whitebox_tests.html does not load sketch.js, so provide a tiny
  // test-only fallback for boss tower-destroy behavior.
  if (typeof destroyTowerByBoss !== "function") {
    window.destroyTowerByBoss = function (targetTower) {
      if (!targetTower || !Array.isArray(towers)) return false;
      const idx = towers.indexOf(targetTower);
      if (idx < 0) return false;

      const x = targetTower.x;
      const y = targetTower.y;
      towers.splice(idx, 1);

      if (typeof selectedTower !== "undefined" && selectedTower === targetTower) {
        selectedTower = null;
      }

      if (Array.isArray(towerSlots)) {
        const exists = towerSlots.some(slot => {
          if (!slot) return false;
          return Math.hypot(slot.x - x, slot.y - y) < 1;
        });
        if (!exists) {
          towerSlots.push({ x, y, occupied: false });
        }
      }

      return true;
    };
  }
  if (typeof stunTowerByBoss !== "function") {
    window.stunTowerByBoss = function (targetTower, bossX, bossY, durationFrames) {
      if (!targetTower || typeof targetTower.applyStun !== "function") return false;
      targetTower.applyStun(durationFrames || 180);
      return true;
    };
  }

  function resetState() {
    // Each test starts from a clean battle state to avoid cross-test timing leaks.
    defineTestGlobals();

    playerGold = 150;
    playerLife = 10;

    waveWaitingForStart = false;
    waveHasStarted = false;
    currentLevelWaves = DEFAULT_WAVE_CONFIGS;
    currentWaveIndex = 0;
    currentStageIndex = 0;
    currentStageQueue = [];
    spawnIntervalFrames = 48;
    stageIntervalFrames = 180;
    lastSpawnFrame = 0;
    totalSpawnedThisWave = 0;
    stageDelayStartFrame = -1;
    waveClearedTimer = 0;
  }

  function createPath() {
    return [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 400, y: 0 }
    ];
  }

  function finishBossFragmentingForTest(boss) {
    // Tests jump to the final split frame to verify allReturned revive behavior.
    frameCount = boss.fragmentingStartedFrame + boss.fragmentingDuration;
    boss.update();
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message} | Actual: ${actual} | Expected: ${expected}`);
    }
  }

  function assertApprox(actual, expected, tolerance, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message} | Actual: ${actual} | Expected: ${expected} | Tolerance: ${tolerance}`);
    }
  }

  function renderResult(title, passed, detail) {
    const card = document.createElement("div");
    card.className = `case ${passed ? "pass" : "fail"}`;

    const titleEl = document.createElement("div");
    titleEl.className = "case-title";
    titleEl.textContent = `${passed ? "✔" : "✘"} ${title}`;

    const detailEl = document.createElement("div");
    detailEl.textContent = detail;

    card.appendChild(titleEl);
    card.appendChild(detailEl);
    resultsEl.appendChild(card);
  }

  function clearResults() {
    resultsEl.innerHTML = "";
    summaryEl.className = "summary";
    summaryEl.textContent = "Tests have not been run yet.";
  }

  const testCases = [
    // Core tower tests protect upgrade caps, targeting, and damage timing.
    {
      name: "Stage 1 towers cannot be upgraded",
      run() {
        resetState();
        currentMap = 1;
        const tower = new Tower(100, 100, "tower1");

        assertEqual(tower.maxLevel, 1, "The maximum level in Stage 1 should be 1");
        assertEqual(tower.canUpgrade(), false, "Towers in Stage 1 should not be upgradeable");
        assertEqual(tower.getUpgradeCost(), 0, "Upgrade cost should be 0 when upgrading is not allowed");
        assertEqual(tower.upgrade(), false, "upgrade() should return false");
      }
    },
    {
      name: "Stage 2 towers can only upgrade to level 2 and stats update correctly",
      run() {
        resetState();
        currentMap = 2;
        const tower = new Tower(100, 100, "tower2");

        assertEqual(tower.level, 1, "Initial level should be 1");
        assertEqual(tower.range, 400, "Level 1 archer tower range is incorrect");
        assertEqual(tower.upgrade(), true, "Stage 2 should allow upgrading to level 2");
        assertEqual(tower.level, 2, "Tower level should be 2 after upgrade");
        assertEqual(tower.range, 500, "Level 2 archer tower range is incorrect");
        assertEqual(tower.damage, 15, "Level 2 archer tower damage is incorrect");
        assertEqual(tower.canUpgrade(), false, "Stage 2 towers should not be upgradeable beyond level 2");
      }
    },
    {
      name: "Cannon tower white-box targeting: ignores flying units and prefers the densest cluster",
      run() {
        resetState();
        currentMap = 4;
        const tower = new Tower(0, 0, "tower3");

        enemies = [
          { x: 100, y: 0, dead: false, reachedEnd: false, canFly: false },
          { x: 105, y: 0, dead: false, reachedEnd: false, canFly: false },
          { x: 110, y: 0, dead: false, reachedEnd: false, canFly: false },
          { x: 290, y: 0, dead: false, reachedEnd: false, canFly: false },
          { x: 102, y: 0, dead: false, reachedEnd: false, canFly: true }
        ];

        const target = tower.findBestSplashTarget();
        assert(target !== null, "The cannon tower should find a target");
        assertEqual(target.x, 100, "The cannon tower should choose the nearest dense ground target");
      }
    },
    {
      name: "Ice tower white-box targeting: prioritizes unslowed ground units",
      run() {
        resetState();
        currentMap = 4;
        const tower = new Tower(0, 0, "tower4");

        enemies = [
          { x: 50, y: 0, dead: false, reachedEnd: false, canFly: true, slowTimer: 0 },
          { x: 100, y: 0, dead: false, reachedEnd: false, canFly: false, slowTimer: 20 },
          { x: 220, y: 0, dead: false, reachedEnd: false, canFly: false, slowTimer: 0 },
          { x: 260, y: 0, dead: false, reachedEnd: false, canFly: false, slowTimer: 0 }
        ];

        const target = tower.findBestIceTarget();
        assert(target !== null, "The ice tower should find a target");
        assertEqual(target.x, 220, "The ice tower should prioritize the nearest unslowed ground unit");
      }
    },
    {
      name: "Enemy physical/magic damage multipliers are calculated correctly",
      run() {
        resetState();
        const path = createPath();

        const blackEnemy = new Enemy(path, "black");
        const physicalDamage = blackEnemy.takeDamage(40, "physical");
        assertEqual(physicalDamage, 30, "black physical damage multiplier should be 0.75");
        assertEqual(blackEnemy.hp, 150, "black HP after damage is incorrect");

        const crystalEnemy = new Enemy(path, "crystal");
        const magicDamage = crystalEnemy.takeDamage(40, "magic");
        assertEqual(magicDamage, 10, "crystal magic damage multiplier should be 0.25");
        assertEqual(crystalEnemy.hp, 390, "crystal HP after damage is incorrect");
      }
    },
    {
      name: "Enemy always takes at least 1 damage",
      run() {
        resetState();
        const path = createPath();
        const enemy = new Enemy(path, "ice_spike");

        const damage = enemy.takeDamage(1, "physical");
        assertEqual(damage, 1, "Minimum damage should be clamped to 1");
        assertEqual(enemy.hp, enemy.maxHp - 1, "HP reduction for minimum damage is incorrect");
      }
    },
    {
      name: "Slow timer decreases and speed is restored after it ends",
      run() {
        resetState();
        const path = createPath();
        const enemy = new Enemy(path, "red");

        enemy.applySlow(0.5, 2);
        enemy.update();
        assertApprox(enemy.x, 1.5, 1e-9, "After the 1st update, displacement should use the slowed speed");
        assertEqual(enemy.slowTimer, 1, "After the 1st update, slowTimer should decrease to 1");
        assertApprox(enemy.slowFactor, 0.5, 1e-9, "After the 1st update, slowFactor should not be restored");

        enemy.update();
        assertApprox(enemy.x, 4.5, 1e-9, "After the 2nd update, movement should resume at normal speed");
        assertEqual(enemy.slowTimer, 0, "After the 2nd update, slowTimer should be 0");
        assertApprox(enemy.slowFactor, 1, 1e-9, "slowFactor should be restored to 1 after slow ends");
      }
    },
    {
      name: "Multi-lane wave queue is cloned correctly",
      run() {
        resetState();
        allPathPoints = [createPath(), createPath(), createPath()];

        const queue = cloneStageQueue([
          { type: "green", count: 2 },
          { type: "red", count: 1 }
        ]);

        assertEqual(queue.length, 9, "The total queue length should be 9 for 3 lanes");
        assertEqual(queue[0].type, "green", "The 1st entry should be green");
        assertEqual(queue[0].pathIndex, 0, "The 1st pathIndex is incorrect");
        assertEqual(queue[1].pathIndex, 1, "The 2nd pathIndex is incorrect");
        assertEqual(queue[2].pathIndex, 2, "The 3rd pathIndex is incorrect");
        assertEqual(queue[6].type, "red", "The last group should be red");
      }
    },
    {
      name: "Split enemy spawns child enemies on death and preserves path progress",
      run() {
        resetState();
        const parent = new Enemy(createPath(), "split_parent");
        parent.x = 120;
        parent.y = 80;
        parent.targetIndex = 2;
        enemies = [];

        spawnSplitChildren(parent);

        assertEqual(enemies.length, 4, "split_parent should spawn 4 child enemies");
        enemies.forEach((child, index) => {
          assertEqual(child.typeKey, "split_child", `Child enemy ${index + 1} has the wrong type`);
          assertEqual(child.targetIndex, 2, `Child enemy ${index + 1} has incorrect path progress`);
          assert(child.path === parent.path, `Child enemy ${index + 1} did not inherit the path`);
        });
      }
    },
    {
      name: "Enemy death reward is granted only once",
      run() {
        resetState();
        playerGold = 0;
        const enemy = new Enemy(createPath(), "split_parent");
        enemy.rewardGold = 12;
        enemy.canSplit = false;

        handleEnemyDeath(enemy);
        handleEnemyDeath(enemy);

        assertEqual(playerGold, 12, "The same enemy death reward should not be granted twice");
      }
    },
    {
      name: "Boss type config exists and split settings are valid",
      run() {
        // Protects Boss combat constants from accidental tuning changes.
        resetState();
        assert(ENEMY_TYPES.king_boss, "king_boss config should exist");
        assertEqual(ENEMY_TYPES.king_boss.canSplit, false, "king_boss should not use normal split_parent split flow");
        assertEqual(ENEMY_TYPES.king_boss.hp, 6000, "king_boss HP should be set to 6000");
        assertEqual(ENEMY_TYPES.king_boss.speed, 1.8, "king_boss speed should be set to 1.8");
        assertEqual(ENEMY_TYPES.king_boss.armor, 0.60, "king_boss armor should be set to 0.60");
        assertEqual(ENEMY_TYPES.king_boss.magicResist, 1.2, "king_boss magicResist should be set to 1.2");
        assertEqual(ENEMY_TYPES.king_boss.size, 220, "king_boss size should be 220");
      }
    },
    {
      name: "Level 4 wave 2 starts with king_boss and has fewer stages",
      run() {
        // Confirms the Boss showcase wave stays in the intended map slot.
        resetState();
        const level4 = LEVEL_WAVE_CONFIGS[4];
        assert(Array.isArray(level4) && level4.length >= 2, "Level 4 should have at least 2 waves");
        const wave2 = level4[1];
        assert(wave2 && Array.isArray(wave2.stages), "Level 4 wave 2 stages should exist");
        assert(wave2.stages.length <= 3, "Level 4 wave 2 should have fewer stages for boss showcase");
        const firstStageHasBoss = wave2.stages[0].some(group => group && group.type === "king_boss");
        assertEqual(firstStageHasBoss, true, "Level 4 wave 2 first stage should contain king_boss");
        assertEqual(wave2.stages[0][0].singleSpawn, true, "king_boss first stage should use singleSpawn");
      }
    },
    {
      name: "Map 4 boss uses long showcase path and reaches end only at final point",
      run() {
        // Covers the long Boss route so path-end handling does not reintroduce teleporting.
        resetState();
        const prevCurrentMap = currentMap;
        const prevAllPathPoints = allPathPoints;
        const prevPathPoints = pathPoints;
        const prevEnemies = enemies;
        const prevFrameCount = frameCount;

        try {
          currentMap = 4;
          allPathPoints = [[
            { x: 2517, y: 244 },
            { x: 2517, y: 272 },
            { x: 2177, y: 272 },
            { x: 2177, y: 1184 },
            { x: 641, y: 1184 },
            { x: 641, y: 712 },
            { x: 34, y: 712 },
            { x: 34, y: 673 }
          ]];
          pathPoints = [];
          enemies = [];
          frameCount = 0;

          startWave(1);
          beginCurrentWave();
          frameCount = spawnIntervalFrames;
          spawnCurrentWave();

          assertEqual(enemies.length, 1, "Wave 2 first spawn should be the boss");
          const boss = enemies[0];
          assertEqual(boss.typeKey, "king_boss", "Spawned enemy should be king_boss");
          assert(Array.isArray(boss.bossShowcasePath), "Boss should have bossShowcasePath");
          assertEqual(boss.path, boss.bossShowcasePath, "Boss path should be bossShowcasePath");
          assertEqual(boss.bossLoopPathConfigured, true, "Boss loop path should be configured only once");
          assert(boss.bossShowcasePath.length > 20, "bossShowcasePath should be a long path");
          assertEqual(boss.targetIndex, 1, "Boss targetIndex should start at 1");
          const endIndex = boss.bossShowcasePath.findIndex(p => p.x === 34 && p.y === 673);
          assert(endIndex >= 0, "bossShowcasePath should contain final endpoint");
          assertEqual(endIndex, boss.bossShowcasePath.length - 1, "Final endpoint should only appear at the end");
          assert(Array.isArray(boss.bossExitPath) && boss.bossExitPath.length === 0, "bossExitPath should be disabled");
        } finally {
          currentMap = prevCurrentMap;
          allPathPoints = prevAllPathPoints;
          pathPoints = prevPathPoints;
          enemies = prevEnemies;
          frameCount = prevFrameCount;
        }
      }
    },
    {
      name: "Boss picks highest totalSpent tower in range",
      run() {
        resetState();
        const boss = new Enemy(createPath(), "king_boss");
        boss.x = 0;
        boss.y = 0;
        boss.bossAttackRange = 400;

        towers = [
          { x: 120, y: 0, type: "tower1", totalSpent: 100 },
          { x: 180, y: 0, type: "tower2", totalSpent: 220 },
          { x: 80, y: 0, type: "tower3", totalSpent: 220 }
        ];

        const target = boss.findHighestValueTowerInRange();
        assert(target !== null, "Boss should find a target tower");
        assertEqual(target.x, 80, "When totalSpent ties, boss should pick the nearer tower");
      }
    },
    {
      name: "Boss stuns tower without destroying and without refund",
      run() {
        resetState();
        playerGold = 999;
        currentMap = 4;
        const tower = new Tower(300, 400, "tower1");
        tower.totalSpent = 100;
        towers = [tower];
        selectedTower = tower;
        towerSlots = [];

        const stunned = stunTowerByBoss(tower, 0, 0, 180);
        assertEqual(stunned, true, "stunTowerByBoss should return true");
        assertEqual(towers.length, 1, "Tower should remain in towers after boss attack");
        assertEqual(selectedTower, tower, "selectedTower should remain unchanged");
        assertEqual(playerGold, 999, "Boss stun should not refund gold");
        assertEqual(tower.isStunned(), true, "Tower should be stunned");
      }
    },
    {
      name: "Boss first lethal damage enters fragmenting without reward",
      run() {
        // Covers the fragment outbound, roaming, and returning state flow.
        resetState();
        playerGold = 0;
        const boss = new Enemy(createPath(), "king_boss");
        enemies = [boss];
        const oldGold = playerGold;
        const lapBefore = boss.completedLaps;

        boss.takeDamage(999999, "magic");
        assertEqual(boss.dead, false, "Boss first lethal hit should not mark dead");
        assertEqual(boss.bossPhase, "fragmenting", "Boss should enter fragmenting phase");
        assertEqual(boss.reviveCount, 0, "Boss reviveCount should not increment before merge");
        assert(Array.isArray(boss.bossFragments) && boss.bossFragments.length === 4, "Boss should create 4 internal fragments");
        boss.bossFragments.forEach((frag, index) => {
          assertApprox(frag.x, boss.bossDeathCenterX, 1e-9, `Boss fragment ${index + 1} should start at death center x`);
          assertApprox(frag.y, boss.bossDeathCenterY, 1e-9, `Boss fragment ${index + 1} should start at death center y`);
          assert(typeof frag.targetX === "number" && typeof frag.targetY === "number", `Boss fragment ${index + 1} should have a road target`);
          const d = Math.hypot(frag.targetX - boss.bossDeathCenterX, frag.targetY - boss.bossDeathCenterY);
          assert(d > 220, `Boss fragment ${index + 1} target should not be too close to death center`);
          assert(d < 750, `Boss fragment ${index + 1} target should not be too far from death center`);
          assertEqual(frag.landed, false, `Boss fragment ${index + 1} should not be landed immediately`);
          assertEqual(frag.phase, "outbound", `Boss fragment ${index + 1} should start outbound`);
        });
        assertEqual(enemies.length, 1, "Fragments should not be added into enemies array");
        assertEqual(playerGold, oldGold, "First boss lethal hit should not grant gold");
        assertEqual(boss.completedLaps, lapBefore, "Boss laps should remain unchanged while fragmenting");

        const deathX = boss.bossDeathCenterX;
        const deathY = boss.bossDeathCenterY;
        frameCount = boss.fragmentingStartedFrame + 40;
        boss.update();
        assertEqual(boss.x, deathX, "Boss should not move while fragmenting");
        assertEqual(boss.y, deathY, "Boss should not move while fragmenting");
        assertEqual(boss.reachedEnd, false, "Boss should not reach end while fragmenting");
        assert(boss.bossFragments.some(frag => Math.hypot(frag.x - deathX, frag.y - deathY) > 20), "At least one fragment should fly away from the death center");

        frameCount = boss.fragmentingStartedFrame + boss.fragmentFlightDuration + 32;
        boss.update();
        boss.bossFragments.forEach((frag, index) => {
          assertEqual(frag.landed, true, `Boss fragment ${index + 1} should land after flightDuration`);
          assertEqual(frag.phase, "roaming", `Boss fragment ${index + 1} should roam after landing`);
        });
        const roamingPositions = boss.bossFragments.map(frag => ({ x: frag.x, y: frag.y }));
        frameCount = boss.fragmentingStartedFrame + boss.fragmentFlightDuration + 120;
        boss.update();
        assert(
          boss.bossFragments.some((frag, index) => Math.hypot(frag.x - roamingPositions[index].x, frag.y - roamingPositions[index].y) > 1),
          "At least one roaming fragment should move along the route area"
        );
        assertEqual(boss.bossPhase, "fragmenting", "Boss should not revive just because fragments have landed");

        frameCount = boss.fragmentingStartedFrame + boss.fragmentingDuration - boss.fragmentReturnDuration + 10;
        boss.update();
        boss.bossFragments.forEach((frag, index) => {
          assertEqual(frag.phase, "returning", `Boss fragment ${index + 1} should return near the end of fragmenting`);
        });
      }
    },
    {
      name: "Boss fragments merge and revive to 80 percent hp",
      run() {
        // Revive should wait until every fragment has returned.
        resetState();
        const boss = new Enemy(createPath(), "king_boss");
        boss.takeDamage(999999, "physical");
        assertEqual(boss.bossPhase, "fragmenting", "Boss should be fragmenting before merge");

        frameCount = boss.fragmentingStartedFrame + 1;
        boss.update();
        assertEqual(boss.bossPhase, "fragmenting", "Boss should not revive before fragmentingDuration");
        finishBossFragmentingForTest(boss);

        assertEqual(boss.bossPhase, "revived", "Boss should enter revived phase");
        assertEqual(boss.reviveUsed, true, "Boss revive should be consumed");
        assertEqual(boss.reviveCount, 1, "Boss reviveCount should increment after revive");
        assertEqual(boss.hp, Math.round(boss.maxHp * 0.8), "Boss revived hp should be 80% max hp");
        assertEqual(boss.armor, 0.50, "Boss armor should increase after first revive");
        assertEqual(boss.magicResist, 1.0, "Boss magicResist should increase after first revive");
        assertEqual(boss.maxRevives, 3, "Boss maxRevives should be 3");
      }
    },
    {
      name: "Stunned tower cannot attack and later recovers",
      run() {
        resetState();
        currentMap = 4;
        const tower = new Tower(200, 200, "tower1");
        towers = [tower];
        enemies = [];

        frameCount = 10;
        tower.applyStun(30);
        assertEqual(tower.isStunned(), true, "Tower should be stunned immediately");
        const beforeCooldown = tower.cooldown;
        tower.update();
        assertEqual(tower.cooldown, beforeCooldown, "Stunned tower should not run attack logic");

        frameCount = 50;
        assertEqual(tower.isStunned(), false, "Tower should recover after stun duration");
      }
    },
    {
      name: "singleSpawn boss is not duplicated on multi-lane queue",
      run() {
        // Boss waves use singleSpawn so multi-lane maps do not clone the Boss.
        resetState();
        allPathPoints = [createPath(), createPath(), createPath()];
        const queue = cloneStageQueue([
          { type: "king_boss", count: 1, singleSpawn: true, pathIndex: 0 },
          { type: "green", count: 1 }
        ]);

        const bossCount = queue.filter(item => item.type === "king_boss").length;
        const greenCount = queue.filter(item => item.type === "green").length;
        assertEqual(bossCount, 1, "singleSpawn boss should only appear once");
        assertEqual(greenCount, 3, "Normal enemy should still duplicate across lanes");
      }
    },
    {
      name: "Boss showcase path does not teleport to path start at path end",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        const startX = boss.path[0].x;
        const startY = boss.path[0].y;
        const endPoint = boss.path[boss.path.length - 1];
        boss.x = endPoint.x;
        boss.y = endPoint.y;
        boss.targetIndex = boss.path.length;
        boss.update();
        assertEqual(boss.reachedEnd, true, "Boss should end after showcase path finishes");
        assertEqual(boss.x, endPoint.x, "Boss x should stay at path end without teleport");
        assertEqual(boss.y, endPoint.y, "Boss y should stay at path end without teleport");
        assert(!(boss.x === startX && boss.y === startY), "Boss should not reset to path start");
      }
    },
    {
      name: "Boss midway movement never teleports to path start or resets targetIndex",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        const startX = boss.path[0].x;
        const startY = boss.path[0].y;
        const midIdx = Math.floor(boss.path.length / 2);
        const midPoint = boss.path[midIdx];
        const prevPoint = boss.path[midIdx - 1];

        boss.x = prevPoint.x;
        boss.y = prevPoint.y;
        boss.targetIndex = midIdx;
        boss.update();

        assertEqual(boss.reachedEnd, false, "Boss should not end in the middle of showcase path");
        assert(!(boss.x === startX && boss.y === startY), "Boss should not teleport to path start in the middle");
        assert(boss.targetIndex >= midIdx, "Boss targetIndex should not reset to 1 in the middle");
        assert(!(boss.targetIndex === 1 && midIdx > 1), "Boss targetIndex should not reset to 1");
        assert(Math.abs(boss.x - midPoint.x) < 10 || Math.abs(boss.y - midPoint.y) < 10, "Boss should move toward mid target naturally");
      }
    },
    {
      name: "Normal enemy path behavior remains unchanged",
      run() {
        resetState();
        const normalPath = createPath();
        const normal = new Enemy(normalPath, "green");
        normal.x = normalPath[normalPath.length - 1].x;
        normal.y = normalPath[normalPath.length - 1].y;
        normal.targetIndex = normalPath.length - 1;
        normal.update();
        assertEqual(normal.reachedEnd, true, "Normal enemy should still end on first lap");
      }
    },
    {
      name: "Boss showcase path reaches end without loop/exit switching",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        const endPoint = boss.path[boss.path.length - 1];
        boss.x = endPoint.x;
        boss.y = endPoint.y;
        boss.targetIndex = boss.path.length;

        boss.update();
        assertEqual(boss.reachedEnd, true, "Boss should end on showcase path completion");
        assertEqual(boss.path, boss.bossShowcasePath, "Boss should stay on showcase path");
        assertEqual(boss.bossUsingExitPath, false, "Boss should not switch to exit path");
      }
    },
    {
      name: "Boss revive uses reduced maxHp and revives at death position",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        boss.x = 123;
        boss.y = 45;
        boss.targetIndex = 2;
        const startMaxHp = boss.maxHp;
        boss.takeDamage(999999, "magic");
        assertEqual(boss.bossPhase, "fragmenting", "Boss should enter fragmenting");
        assertEqual(boss.maxHp, Math.round(startMaxHp * 0.9), "Boss maxHp should decay by 10%");
        assertEqual(boss.cachedPathMode, "showcase", "Boss should cache showcase path mode on death");
        assertEqual(boss.cachedCompletedLaps, boss.completedLaps, "Boss should cache completedLaps on death");
        finishBossFragmentingForTest(boss);
        assertEqual(boss.bossPhase, "revived", "Boss should revive after fragments merge");
        assertEqual(boss.x, 123, "Boss should revive at death x position");
        assertEqual(boss.y, 45, "Boss should revive at death y position");
        assertEqual(boss.targetIndex, 2, "Boss should continue with cached targetIndex");
        assertEqual(boss.hp, Math.round(boss.maxHp * 0.8), "Revived hp should be 80% of current maxHp");
        assert(Array.isArray(boss.bossShowcasePath), "Boss should keep bossShowcasePath after revive");
        assertEqual(boss.path, boss.bossShowcasePath, "Boss should continue on showcase path after revive");
      }
    },
    {
      name: "Boss revives three times with stable fragment count and dies on fourth lethal hit",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        assertEqual(boss.maxRevives, 3, "Boss maxRevives should be 3");
        const startPoint = boss.path[0];
        boss.x = 999;
        boss.y = 777;
        boss.targetIndex = 5;

        boss.takeDamage(999999, "physical");
        assertEqual(boss.bossPhase, "fragmenting", "First lethal hit should enter fragmenting");
        assertEqual(boss.reviveCount, 0, "reviveCount should remain 0 before first merge");
        assertEqual(boss.bossFragments.length, 4, "First fragmenting should create exactly 4 fragments");
        finishBossFragmentingForTest(boss);
        assertEqual(boss.reviveCount, 1, "After first merge reviveCount should be 1");
        assertEqual(boss.hp, Math.round(boss.maxHp * 0.8), "First revive hp should be 80 percent maxHp");
        assertEqual(boss.x, 999, "First revive x should stay at death position");
        assertEqual(boss.y, 777, "First revive y should stay at death position");
        assertEqual(boss.path, boss.bossShowcasePath, "First revive should keep showcase path");
        assertEqual(boss.targetIndex, 5, "First revive should keep cached targetIndex");
        assert(!(boss.x === startPoint.x && boss.y === startPoint.y), "First revive should not reset to path start");

        boss.takeDamage(999999, "physical");
        assertEqual(boss.bossPhase, "fragmenting", "Second lethal hit should enter fragmenting");
        assertEqual(boss.bossFragments.length, 4, "Second fragmenting should create exactly 4 fragments");
        finishBossFragmentingForTest(boss);
        assertEqual(boss.reviveCount, 2, "After second merge reviveCount should be 2");
        assertEqual(boss.hp, Math.round(boss.maxHp * 0.8), "Second revive hp should be 80 percent maxHp");
        assertEqual(boss.armor, 0.45, "Second revive armor should be 0.45");
        assertEqual(boss.magicResist, 0.85, "Second revive magicResist should be 0.85");

        boss.takeDamage(999999, "physical");
        assertEqual(boss.bossPhase, "fragmenting", "Third lethal hit should enter fragmenting");
        assertEqual(boss.bossFragments.length, 4, "Third fragmenting should create exactly 4 fragments");
        finishBossFragmentingForTest(boss);
        assertEqual(boss.reviveCount, 3, "After third merge reviveCount should be 3");
        assertEqual(boss.hp, Math.round(boss.maxHp * 0.8), "Third revive hp should be 80 percent maxHp");
        assertEqual(boss.armor, 0.40, "Third revive armor should be 0.40");
        assertEqual(boss.magicResist, 0.75, "Third revive magicResist should be 0.75");
        assertEqual(boss.path, boss.bossShowcasePath, "Third revive should keep showcase path");
        assert(!(boss.x === startPoint.x && boss.y === startPoint.y), "Third revive should not reset to path start");

        boss.takeDamage(999999, "physical");
        assertEqual(boss.dead, true, "Boss should truly die on fourth lethal hit");
      }
    },
    {
      name: "Boss destroy and stun cooldowns are independent",
      run() {
        resetState();
        const boss = new Enemy(createPath(), "king_boss");
        assertEqual(boss.bossStunCooldown, 400, "Boss stun cooldown should be 400");
        assertEqual(boss.bossDestroyCooldown, 900, "Boss destroy cooldown should be 900");
        assertEqual(boss.bossDestroyUnlockDelay, 600, "Boss destroy unlock delay should be 600");
      }
    },
    {
      name: "Fragmenting phase should not trigger destroy skill",
      run() {
        resetState();
        currentMap = 4;
        const boss = new Enemy(createPath(), "king_boss");
        boss.takeDamage(999999, "magic");
        boss.bossSpawnFrame = 0;
        frameCount = 5000;
        boss.bossLastDestroyFrame = -999999;
        const tower = new Tower(100, 0, "tower1");
        tower.totalSpent = 999;
        towers = [tower];

        boss.update();
        assertEqual(towers.length, 1, "Boss should not destroy towers during fragmenting phase");
      }
    },
    {
      name: "startWave initializes parameters correctly",
      run() {
        resetState();
        currentMap = 1;
        pathPoints = createPath();
        frameCount = 0;

        startWave(0);

        assertEqual(currentWaveIndex, 0, "currentWaveIndex initialization is incorrect");
        assertEqual(currentStageIndex, 0, "currentStageIndex initialization is incorrect");
        assertEqual(spawnIntervalFrames, 60, "spawnIntervalFrames is incorrect for Stage 1 Wave 1");
        assertEqual(stageIntervalFrames, 72, "stageIntervalFrames is incorrect for Stage 1 Wave 1");
        assertEqual(currentStageQueue.length, 6, "The number of enemies in the first stage of Stage 1 Wave 1 is incorrect");
        assertEqual(waveWaitingForStart, true, "The wave should be waiting to start");
        assertEqual(waveHasStarted, false, "The wave should not be marked as started yet");
      }
    },
    {
      name: "spawnCurrentWave actually spawns enemies when the timer is reached",
      run() {
        resetState();
        currentMap = 1;
        pathPoints = createPath();
        frameCount = 0;

        startWave(0);
        beginCurrentWave();

        frameCount = spawnIntervalFrames;
        spawnCurrentWave();

        assertEqual(enemies.length, 1, "Exactly 1 enemy should be spawned");
        assertEqual(enemies[0].typeKey, "green", "The first spawned enemy type is incorrect");
        assertEqual(totalSpawnedThisWave, 1, "The spawned enemy count is incorrect");
      }
    }
  ];

  function runAllTests() {
    clearResults();

    let passedCount = 0;
    let failedCount = 0;

    for (const testCase of testCases) {
      try {
        testCase.run();
        renderResult(testCase.name, true, "Passed");
        passedCount++;
      } catch (error) {
        renderResult(testCase.name, false, error.message || String(error));
        failedCount++;
        console.error(`[White-box test failed] ${testCase.name}`, error);
      }
    }

    const total = passedCount + failedCount;
    const allPassed = failedCount === 0;
    summaryEl.className = `summary ${allPassed ? "pass" : "fail"}`;
    summaryEl.textContent = `Total ${total}: Passed ${passedCount}, Failed ${failedCount}.`;
  }

  runBtn.addEventListener("click", runAllTests);
  clearBtn.addEventListener("click", clearResults);
  window.addEventListener("load", runAllTests);
})();