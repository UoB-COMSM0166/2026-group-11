// 出怪系统 + 金币系统 + 波次系统

let playerGold = 150;
let playerLife = 10;
const MAX_PLAYER_LIFE = 10;

let waveWaitingForStart = false;
let waveHasStarted = false;

const LEVEL_START_GOLD = {
  1: 150,
  2: 300,
  3: 400,
  4: 600
};

const DEFAULT_WAVE_CONFIGS = [
  {
    spawnIntervalSec: 0.8,
    stageIntervalSec: 3.0,
    stages: [
      [{ type: "green", count: 4 }],
      [{ type: "red", count: 2 }]
    ]
  },
  {
    spawnIntervalSec: 0.8,
    stageIntervalSec: 3.0,
    stages: [
      [{ type: "purple", count: 4 }],
      [{ type: "black", count: 2 }, { type: "gold", count: 1 }]
    ]
  },
  {
    spawnIntervalSec: 0.8,
    stageIntervalSec: 3.0,
    stages: [
      [{ type: "glow", count: 2 }, { type: "crystal", count: 2 }],
      [{ type: "ice_spike", count: 2 }, { type: "split_parent", count: 2 }]
    ]
  },
  {
    spawnIntervalSec: 0.8,
    stageIntervalSec: 3.0,
    stages: [
      [{ type: "fly", count: 3 }, { type: "psychic_slug", count: 2 }],
      [{ type: "dungeon", count: 2 }, { type: "crimson", count: 1 }, { type: "rainbow", count: 1 }]
    ]
  }
];

const LEVEL_WAVE_CONFIGS = {
  1: [
    {
      spawnIntervalSec: 1.8,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 8 }],
        [{ type: "green", count: 8 }]
      ]
    },
    {
      spawnIntervalSec: 1.8,
      stageIntervalSec: 1.0,
      stages: [
        [{ type: "green", count: 10 }],
        [{ type: "red", count: 6 }]
      ]
    },
    {
      spawnIntervalSec: 1.5,
      stageIntervalSec: 3.0,
      stages: [
        [{ type: "green", count: 4 }, { type: "red", count: 6 }],
        [{ type: "red", count: 8 }]
      ]
    },
    {
      spawnIntervalSec: 1.5,
      stageIntervalSec: 3.0,
      stages: [
        [{ type: "green", count: 4 }, { type: "red", count: 6 }],
        [{ type: "red", count: 10 }, { type: "black", count: 3 }]
      ]
    },
    {
      spawnIntervalSec: 1.0,
      stageIntervalSec: 3.0,
      stages: [
        [{ type: "green", count: 5 }],
        [{ type: "black", count: 5 }],
        [{ type: "red", count: 6 }],
        [{ type: "dungeon", count: 1 }]
      ]
    }
  ],

  2: [
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 8 }],
        [{ type: "green", count: 8 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 10 }],
        [{ type: "red", count: 6 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 4 }, { type: "red", count: 6 }],
        [{ type: "red", count: 8 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "purple", count: 6 }],
        [{ type: "red", count: 6 }, { type: "purple", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "split_parent", count: 4 }],
        [{ type: "purple", count: 6 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 4 }],
        [{ type: "split_parent", count: 4 }],
        [{ type: "purple", count: 6 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "purple", count: 8 }],
        [{ type: "black", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 5 }],
        [{ type: "split_parent", count: 4 }],
        [{ type: "dungeon", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "purple", count: 6 }],
        [{ type: "black", count: 6 }],
        [{ type: "dungeon", count: 1 }],
        [{ type: "crimson", count: 1 }]
      ]
    }
  ],

  3: [
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 7 }],
        [{ type: "green", count: 7 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 8 }],
        [{ type: "red", count: 6 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 4 }, { type: "red", count: 6 }],
        [{ type: "red", count: 7 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "purple", count: 6 }],
        [{ type: "red", count: 6 }, { type: "purple", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "split_parent", count: 5 }],
        [{ type: "purple", count: 6 }],
        [{ type: "dungeon", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 5 }],
        [{ type: "split_parent", count: 5 }],
        [{ type: "crimson", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "fly", count: 6 }],
        [{ type: "purple", count: 6 }],
        [{ type: "black", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "gold", count: 5 }],
        [{ type: "split_parent", count: 5 }],
        [{ type: "dungeon", count: 2 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 6 }],
        [{ type: "crimson", count: 1 }],
        [{ type: "gold", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "fly", count: 7 }],
        [{ type: "glow", count: 4 }],
        [{ type: "split_parent", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 6 }],
        [{ type: "dungeon", count: 2 }],
        [{ type: "glow", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "gold", count: 5 }],
        [{ type: "split_parent", count: 5 }],
        [{ type: "dungeon", count: 2 }],
        [{ type: "rainbow", count: 1 }]
      ]
    }
  ],

  4: [
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 5 }],
        [{ type: "green", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 6 }],
        [{ type: "red", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.6,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "green", count: 4 }, { type: "red", count: 5 }],
        [{ type: "black", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "purple", count: 5 }],
        [{ type: "red", count: 5 }, { type: "black", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 4 }],
        [{ type: "split_parent", count: 3 }],
        [{ type: "dungeon", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "black", count: 4 }],
        [{ type: "split_parent", count: 3 }],
        [{ type: "crystal", count: 2 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "fly", count: 5 }],
        [{ type: "psychic_slug", count: 5 }]
      ]
    },
    {
      spawnIntervalSec: 0.4,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "ice_spike", count: 2 }],
        [{ type: "split_parent", count: 3 }],
        [{ type: "dungeon", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "gold", count: 4 }],
        [{ type: "crystal", count: 2 }],
        [{ type: "ice_spike", count: 2 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "psychic_slug", count: 4 }],
        [{ type: "glow", count: 3 }],
        [{ type: "split_parent", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "gold", count: 4 }],
        [{ type: "dungeon", count: 2 }],
        [{ type: "ice_spike", count: 3 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "crystal", count: 4 }],
        [{ type: "gold", count: 5 }],
        [{ type: "crimson", count: 1 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "split_parent", count: 3 }],
        [{ type: "dungeon", count: 2 }],
        [{ type: "ice_spike", count: 3 }],
        [{ type: "gold", count: 4 }]
      ]
    },
    {
      spawnIntervalSec: 0.3,
      stageIntervalSec: 2.0,
      stages: [
        [{ type: "crystal", count: 4 }],
        [{ type: "ice_spike", count: 4 }],
        [{ type: "crimson", count: 2 }],
        [{ type: "gold", count: 4 }]
      ]
    }
  ]
};

let currentLevelWaves = DEFAULT_WAVE_CONFIGS;
let currentWaveIndex = 0;
let currentStageIndex = 0;
let currentStageQueue = [];
let spawnIntervalFrames = 48;
let stageIntervalFrames = 180;
let lastSpawnFrame = 0;
let totalSpawnedThisWave = 0;
let stageDelayStartFrame = -1;
let waveClearedTimer = 0;

function getRouteCount() {
  if (allPathPoints.length > 0) return allPathPoints.length;
  if (pathPoints.length > 0) return 1;
  return 0;
}

function cloneStageQueue(stageConfig) {
  const singleRouteQueue = [];

  for (let group of stageConfig) {
    for (let i = 0; i < group.count; i++) {
      singleRouteQueue.push(group.type);
    }
  }

  const routeCount = getRouteCount();
  const finalQueue = [];

  if (routeCount <= 1) {
    for (let type of singleRouteQueue) {
      finalQueue.push({
        type,
        pathIndex: 0
      });
    }
    return finalQueue;
  }

  for (let enemyIndex = 0; enemyIndex < singleRouteQueue.length; enemyIndex++) {
    for (let pathIndex = 0; pathIndex < routeCount; pathIndex++) {
      finalQueue.push({
        type: singleRouteQueue[enemyIndex],
        pathIndex: pathIndex
      });
    }
  }

  return finalQueue;
}

function getSpawnPathByIndex(pathIndex) {
  if (allPathPoints.length > 0) {
    return allPathPoints[pathIndex] || allPathPoints[0];
  }

  if (pathPoints.length > 0) {
    return pathPoints;
  }

  return null;
}

function getCurrentMapWaveConfigs() {
  return LEVEL_WAVE_CONFIGS[currentMap] || DEFAULT_WAVE_CONFIGS;
}

function startWave(waveIndex) {
  currentWaveIndex = waveIndex;
  currentStageIndex = 0;
  stageDelayStartFrame = -1;
  totalSpawnedThisWave = 0;
  waveClearedTimer = 0;

  currentLevelWaves = getCurrentMapWaveConfigs();
  const wave = currentLevelWaves[currentWaveIndex];

  if (!wave) {
    currentStageQueue = [];
    waveWaitingForStart = false;
    waveHasStarted = false;
    return;
  }

  spawnIntervalFrames = max(1, round(wave.spawnIntervalSec * 60));
  stageIntervalFrames = max(1, round(wave.stageIntervalSec * 60));
  currentStageQueue = cloneStageQueue(wave.stages[0] || []);

  waveWaitingForStart = true;
  waveHasStarted = false;

  lastSpawnFrame = frameCount;
}

function beginCurrentWave() {
  if (!waveWaitingForStart) return;

  waveWaitingForStart = false;
  waveHasStarted = true;
  lastSpawnFrame = frameCount;
}

function advanceStageIfNeeded() {
  const wave = currentLevelWaves[currentWaveIndex];
  if (!wave) return;

  if (currentStageQueue.length > 0) {
    stageDelayStartFrame = -1;
    return;
  }

  if (currentStageIndex >= wave.stages.length - 1) return;

  if (stageDelayStartFrame < 0) {
    stageDelayStartFrame = frameCount;
    return;
  }

  if (frameCount - stageDelayStartFrame >= stageIntervalFrames) {
    currentStageIndex++;
    currentStageQueue = cloneStageQueue(wave.stages[currentStageIndex] || []);
    lastSpawnFrame = frameCount;
    stageDelayStartFrame = -1;
  }
}

function spawnCurrentWave() {
  if (currentWaveIndex >= currentLevelWaves.length) return;
  if (waveWaitingForStart) return;

  advanceStageIfNeeded();

  if (currentStageQueue.length <= 0) return;
  if (frameCount - lastSpawnFrame < spawnIntervalFrames) return;

  const spawnInfo = currentStageQueue.shift();
  const enemyPathToUse = getSpawnPathByIndex(spawnInfo.pathIndex);

  if (enemyPathToUse) {
    enemies.push(new Enemy(enemyPathToUse, spawnInfo.type));
    totalSpawnedThisWave++;
    lastSpawnFrame = frameCount;
  }
}

function handleEnemyDeath(enemy) {
  if (enemy.deathHandled) return;
  enemy.deathHandled = true;

  playerGold += enemy.rewardGold || 0;

  if (enemy.canSplit && enemy.splitInto && enemy.splitCount > 0) {
    spawnSplitChildren(enemy);
  }
}

function spawnSplitChildren(parentEnemy) {
  for (let i = 0; i < parentEnemy.splitCount; i++) {
    let child = new Enemy(parentEnemy.path, parentEnemy.splitInto);
    child.targetIndex = parentEnemy.targetIndex;
    child.x = parentEnemy.x + random(-18, 18) * uiScale;
    child.y = parentEnemy.y + random(-18, 18) * uiScale;
    enemies.push(child);
  }
}

function isWaveFullySpawned() {
  const wave = currentLevelWaves[currentWaveIndex];
  if (!wave || !wave.stages) return true;

  return (
    currentStageIndex >= wave.stages.length - 1 &&
    currentStageQueue.length === 0
  );
}

function isLevelVictory() {
  const allSpawned = currentWaveIndex >= currentLevelWaves.length - 1 && isWaveFullySpawned();
  const noEnemiesAlive = enemies.length === 0;
  return allSpawned && noEnemiesAlive;
}

function isLevelDefeat() {
  return playerLife <= 0;
}

function checkWaveAdvance() {
  if (waveWaitingForStart || !waveHasStarted) {
    waveClearedTimer = 0;
    return;
  }

  const allSpawned = isWaveFullySpawned();
  const noEnemiesAlive = enemies.length === 0;

  if (!allSpawned || !noEnemiesAlive) {
    waveClearedTimer = 0;
    return;
  }

  if (waveClearedTimer === 0) {
    waveClearedTimer = frameCount;
  }

  if (frameCount - waveClearedTimer <= 90) return;

  if (currentWaveIndex >= currentLevelWaves.length - 1) {
    showResultOverlay("victory");
    return;
  }

  startWave(currentWaveIndex + 1);
}

function resetLevelBattleState() {
  playerGold = LEVEL_START_GOLD[currentMap] || 150;
  playerLife = MAX_PLAYER_LIFE;

  waveWaitingForStart = false;
  waveHasStarted = false;

  currentLevelWaves = getCurrentMapWaveConfigs();
  startWave(0);
}