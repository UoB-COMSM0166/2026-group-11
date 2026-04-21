let gameSpeedMultiplier = 1;
let gameLogicFrame = 0;

function getGameFrameCount() {
  return gameLogicFrame;
}

function toggleGameSpeed() {
  gameSpeedMultiplier = gameSpeedMultiplier === 1 ? 2 : 1;
}

function getSpeedButtonData() {
  return {
    x: DESIGN_W - 240,
    y: 110,
    size: TOP_RIGHT_UI_BUTTON_SIZE
  };
}

function isInsideSpeedButton(px, py) {
  const btn = getSpeedButtonData();
  return dist(px, py, btn.x, btn.y) <= btn.size * 0.5;
}

function drawSpeedButtonGlow(cx, cy, d) {
  push();
  noFill();

  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = "rgba(255, 242, 170, 0.95)";
  stroke(255, 238, 160, 235);
  strokeWeight(6);
  ellipse(cx, cy, d, d);

  drawingContext.shadowBlur = 14;
  drawingContext.shadowColor = "rgba(255,255,255,0.85)";
  stroke(255, 255, 255, 165);
  strokeWeight(2.5);
  ellipse(cx, cy, d - 10, d - 10);

  pop();
}

function drawSpeedButton() {
  const btn = getSpeedButtonData();
  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);
  const hovering = isInsideSpeedButton(gx, gy);

  const img = gameSpeedMultiplier === 1 ? speed1Img : speed2Img;
  if (!img) return;

  if (hovering) {
    drawSpeedButtonGlow(btn.x, btn.y, btn.size * 0.95);
  }

  push();
  imageMode(CENTER);
  drawingContext.imageSmoothingEnabled = false;
  image(img, btn.x, btn.y, btn.size, btn.size);
  pop();
}

const originalDrawUI = drawUI;
drawUI = function () {
  originalDrawUI();
  drawSpeedButton();
};

const originalHandlePlayingClick = handlePlayingClick;
handlePlayingClick = function () {
  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);

  if (resultOverlay && resultOverlay.active) {
    originalHandlePlayingClick();
    return;
  }

  if (isInsideSpeedButton(gx, gy)) {
    toggleGameSpeed();
    return;
  }

  originalHandlePlayingClick();
};

const originalKeyPressed = keyPressed;
keyPressed = function () {
  if (gameState === "playing" && (key === "f" || key === "F" || key === " ")) {
    toggleGameSpeed();
    return false;
  }

  return originalKeyPressed();
};

const originalResetLevelBattleState = resetLevelBattleState;
resetLevelBattleState = function () {
  gameLogicFrame = 0;
  originalResetLevelBattleState();
};

startWave = function (waveIndex) {
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

  lastSpawnFrame = getGameFrameCount();
};

function beginCurrentWaveSpeedSafe() {
  if (!waveWaitingForStart) return;

  waveWaitingForStart = false;
  waveHasStarted = true;
  lastSpawnFrame = getGameFrameCount();
}

beginCurrentWave = beginCurrentWaveSpeedSafe;

advanceStageIfNeeded = function () {
  const wave = currentLevelWaves[currentWaveIndex];
  if (!wave) return;

  if (currentStageQueue.length > 0) {
    stageDelayStartFrame = -1;
    return;
  }

  if (currentStageIndex >= wave.stages.length - 1) return;

  if (stageDelayStartFrame < 0) {
    stageDelayStartFrame = getGameFrameCount();
    return;
  }

  if (getGameFrameCount() - stageDelayStartFrame >= stageIntervalFrames) {
    currentStageIndex++;
    currentStageQueue = cloneStageQueue(wave.stages[currentStageIndex] || []);
    lastSpawnFrame = getGameFrameCount();
    stageDelayStartFrame = -1;
  }
};

spawnCurrentWave = function () {
  if (currentWaveIndex >= currentLevelWaves.length) return;
  if (waveWaitingForStart) return;
  if (resultOverlay && resultOverlay.active) return;

  advanceStageIfNeeded();

  if (currentStageQueue.length <= 0) return;
  if (getGameFrameCount() - lastSpawnFrame < spawnIntervalFrames) return;

  const spawnInfo = currentStageQueue.shift();
  const enemyPathToUse = getSpawnPathByIndex(spawnInfo.pathIndex);

  if (enemyPathToUse) {
    enemies.push(new Enemy(enemyPathToUse, spawnInfo.type));
    totalSpawnedThisWave++;
    lastSpawnFrame = getGameFrameCount();
  }
};

checkWaveAdvance = function () {
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
    waveClearedTimer = getGameFrameCount();
  }

  if (getGameFrameCount() - waveClearedTimer <= 90) return;

  if (currentWaveIndex >= currentLevelWaves.length - 1) {
    showResultOverlay("victory");
    return;
  }

  startWave(currentWaveIndex + 1);
};

function updateEnemiesOnly() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();

    if (enemies[i].dead) {
      handleEnemyDeath(enemies[i]);
      enemies.splice(i, 1);
      continue;
    }

    if (enemies[i].reachedEnd) {
      playerLife = max(0, playerLife - 1);
      enemies.splice(i, 1);

      if (isLevelDefeat()) {
        showResultOverlay("defeat");
        return;
      }
    }
  }

  checkWaveAdvance();
}

function updateTowersOnly() {
  for (let tower of towers) {
    tower.update();
  }
}

function updateLasersOnly() {
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();

    if (lasers[i].isDead()) {
      lasers.splice(i, 1);
    }
  }
}

function drawEnemiesOnly() {
  for (let enemy of enemies) {
    if (enemy.displayBody) enemy.displayBody();
    else enemy.display();
  }

  for (let enemy of enemies) {
    if (enemy.displayHealthBar) enemy.displayHealthBar();
  }
}

function drawTowersOnly() {
  for (let tower of towers) {
    tower.display();
  }

  // 所有塔画完后，再画选中塔的升级UI
  if (selectedTower) {
    selectedTower.displayLevelBadge();
    drawSelectedTowerActionUi(selectedTower);
  }
}

function drawLasersOnly() {
  for (let laser of lasers) {
    if (laser.display) laser.display();
  }
}

function runPlayingSimulationStep() {
  if (resultOverlay && resultOverlay.active) return;

  gameLogicFrame++;
  spawnCurrentWave();
  updateEnemiesOnly();

  if (resultOverlay && resultOverlay.active) return;

  updateTowersOnly();
  updateLasersOnly();
}

drawPlaying = function () {
  const steps = max(1, gameSpeedMultiplier);

  if (!(resultOverlay && resultOverlay.active)) {
    for (let i = 0; i < steps; i++) {
      runPlayingSimulationStep();

      if (resultOverlay && resultOverlay.active) {
        break;
      }
    }
  }

  if (mapImages[currentMap]) {
    image(mapImages[currentMap], 0, 0, DESIGN_W, DESIGN_H);
  }

  drawTowerSlots();
  drawEnemiesOnly();
  drawTowersOnly();
  drawLasersOnly();

  if (!(resultOverlay && resultOverlay.active)) {
    updateMenuAnimation();
    drawTowerMenu();
    if (typeof drawWaveStartButtons === "function") {
      drawWaveStartButtons();
    }
  }

  drawUI();
  drawBackButton();

  if (typeof drawResultOverlay === "function") {
    drawResultOverlay();
  }
};