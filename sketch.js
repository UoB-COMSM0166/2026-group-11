let mapImages = {};
let currentMap = 1;
let currentMapData = null;

let enemyGif;
let enemyImages = {};
let tower1Img;
let tower2Img;
let tower3Img;
let tower4Img;
let towerMenuImg;

const DESIGN_W = 2560;
const DESIGN_H = 1600;

let viewScale = 1;
let viewOffsetX = 0;
let viewOffsetY = 0;

let uiScale = 1;

let pathPoints = [];
let allPathPoints = [];
let towerSlots = [];

let towers = [];
let lasers = [];
let enemies = [];

let menuOpen = false;
let menuSlotIndex = -1;
let menuX = 0;
let menuY = 0;
let menuScale = 0;
let menuTargetScale = 0;

function preload() {
  preloadAssets();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateViewTransform();

  setupHomeButtons();
  setupLevelButtons();
  loadGame();

  gameState = "home";
}

function draw() {
  background(0);

  push();
  translate(viewOffsetX, viewOffsetY);
  scale(viewScale);

  if (gameState === "home") {
    drawHome();
  } else if (gameState === "levelSelect") {
    drawLevelSelect();
  } else if (gameState === "playing") {
    drawPlaying();
  }

  pop();
}

function drawPlaying() {
  if (mapImages[currentMap]) {
    image(mapImages[currentMap], 0, 0, DESIGN_W, DESIGN_H);
  }

  spawnCurrentWave();
  updateAndDrawEnemies();

  drawTowerSlots();
  updateAndDrawTowers();
  updateAndDrawLasers();

  updateMenuAnimation();
  drawTowerMenu();

  drawUI();
  drawBackButton();
}

function mousePressed() {
  if (gameState === "home") {
    handleHomeClick();
    return;
  }

  if (gameState === "levelSelect") {
    handleLevelSelectClick();
    return;
  }

  if (gameState === "playing") {
    handlePlayingClick();
    return;
  }
}

function keyPressed() {
  if (gameState !== "playing") return;

  if (key === "1") loadMap(1);
  if (key === "2") loadMap(2);
  if (key === "3") loadMap(3);
  if (key === "4") loadMap(4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateViewTransform();
}

function handlePlayingClick() {
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (isInsideRect(gx, gy, 30, 30, 160, 60)) {
    closeTowerMenu();
    gameState = "levelSelect";
    return;
  }

  if (menuOpen) {
    let option = getClickedMenuOption(gx, gy);

    if (option === "cannon") {
      placeTower(menuSlotIndex, "tower2");
      closeTowerMenu();
      return;
    }

    if (option === "magic") {
      placeTower(menuSlotIndex, "tower1");
      closeTowerMenu();
      return;
    }

    if (option === "bomb") {
      placeTower(menuSlotIndex, "tower3");
      closeTowerMenu();
      return;
    }

    if (option === "ice") {
      placeTower(menuSlotIndex, "tower4");
      closeTowerMenu();
      return;
    }

    if (!isInsideMenu(gx, gy)) {
      closeTowerMenu();
      return;
    }

    return;
  }

  for (let i = 0; i < towerSlots.length; i++) {
    let slot = towerSlots[i];
    let d = dist(gx, gy, slot.x, slot.y);

    if (d < 60 * uiScale && !slot.occupied) {
      openTowerMenu(i);
      return;
    }
  }
}


function loadMap(mapNumber) {
  currentMap = mapNumber;
  currentMapData = maps[currentMap];
  updateScaleAndObjects();
}

function updateScaleAndObjects() {
  uiScale = 1;

  pathPoints = [];
  allPathPoints = [];

  if (currentMapData.basePathPoints) {
    for (let p of currentMapData.basePathPoints) {
      pathPoints.push({
        x: p.x,
        y: p.y
      });
    }
  }

  if (currentMapData.enemyPaths) {
    for (let path of currentMapData.enemyPaths) {
      let copiedPath = [];

      for (let p of path) {
        copiedPath.push({
          x: p.x,
          y: p.y
        });
      }

      allPathPoints.push(copiedPath);
    }
  }

  towerSlots = [];
  for (let s of currentMapData.baseTowerSlots) {
    towerSlots.push({
      x: s.x,
      y: s.y,
      occupied: false
    });
  }

  towers = [];
  lasers = [];
  enemies = [];

  resetLevelBattleState();
  closeTowerMenu();
}

function openTowerMenu(slotIndex) {
  menuOpen = true;
  menuSlotIndex = slotIndex;
  menuX = towerSlots[slotIndex].x;
  menuY = towerSlots[slotIndex].y - 30 * uiScale;
  menuScale = 0.1;
  menuTargetScale = 1;
}

function closeTowerMenu() {
  menuOpen = false;
  menuSlotIndex = -1;
  menuScale = 0;
  menuTargetScale = 0;
}

function updateMenuAnimation() {
  if (menuOpen) {
    menuScale = lerp(menuScale, menuTargetScale, 0.35);
  }
}

function drawTowerMenu() {
  if (!menuOpen || menuSlotIndex < 0) return;

  let w = 420 * uiScale * menuScale;
  let h = 630 * uiScale * menuScale;

  imageMode(CENTER);
  image(towerMenuImg, menuX, menuY, w, h);
  imageMode(CORNER);
}

function getClickedMenuOption(mx, my) {
  if (!menuOpen) return null;

  let w = 420 * uiScale * menuScale;
  let h = 630 * uiScale * menuScale;

  let centers = getMenuOptionCenters(w, h);
  let hitR = 90 * uiScale * menuScale;

  if (dist(mx, my, centers.topLeft.x, centers.topLeft.y) <= hitR) return "cannon";
  if (dist(mx, my, centers.topRight.x, centers.topRight.y) <= hitR) return "magic";
  if (dist(mx, my, centers.bottomLeft.x, centers.bottomLeft.y) <= hitR) return "bomb";
  if (dist(mx, my, centers.bottomRight.x, centers.bottomRight.y) <= hitR) return "ice";

  return null;
}

function getMenuOptionCenters(w, h) {
  return {
    topLeft: {
      x: menuX - w * 0.31,
      y: menuY - h * 0.26
    },
    topRight: {
      x: menuX + w * 0.31,
      y: menuY - h * 0.26
    },
    bottomLeft: {
      x: menuX - w * 0.31,
      y: menuY + h * 0.27
    },
    bottomRight: {
      x: menuX + w * 0.31,
      y: menuY + h * 0.27
    }
  };
}

function isInsideMenu(mx, my) {
  let w = 280 * uiScale * menuScale;
  let h = 420 * uiScale * menuScale;

  return (
    mx >= menuX - w / 2 &&
    mx <= menuX + w / 2 &&
    my >= menuY - h / 2 &&
    my <= menuY + h / 2
  );
}

function placeTower(slotIndex, type) {
  if (slotIndex < 0) return;
  let slot = towerSlots[slotIndex];
  if (slot.occupied) return;

  towers.push(new Tower(slot.x, slot.y, type));
  slot.occupied = true;
}

function drawTowerSlots() {
  noFill();
  stroke(255, 255, 255, 70);
  strokeWeight(2);

  for (let slot of towerSlots) {
    ellipse(slot.x, slot.y, 110 * uiScale, 110 * uiScale);
  }
}

function updateAndDrawEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();

    if (enemies[i].dead) {
      handleEnemyDeath(enemies[i]);
      enemies.splice(i, 1);
      continue;
    }

    if (enemies[i].reachedEnd) {
      playerLife = max(0, playerLife - 1);
      enemies.splice(i, 1);
    }
  }

  checkWaveAdvance();
}

function updateAndDrawTowers() {
  for (let tower of towers) {
    tower.update();
    tower.display();
  }
}

function updateAndDrawLasers() {
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    lasers[i].display();

    if (lasers[i].isDead()) {
      lasers.splice(i, 1);
    }
  }
}

function drawUI() {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(max(18, 28 * uiScale));

  const waveNumber = currentWaveIndex + 1;
  const totalWaves = currentLevelWaves.length;
  const aliveCount = enemies.length;
  const waitingCount = currentStageQueue.length;
  const currentWave = currentLevelWaves[currentWaveIndex];
  const totalStages = currentWave ? currentWave.stages.length : 0;
  const stageNumber = totalStages > 0 ? currentStageIndex + 1 : 0;

  text("Map: " + currentMap, 40, 50);
  text("Wave: " + waveNumber + " / " + totalWaves, 40, 90);
  text("Stage: " + stageNumber + " / " + totalStages, 40, 130);
  text("Alive: " + aliveCount, 40, 170);
  text("Remaining in stage: " + waitingCount, 40, 210);
  text("Gold: " + playerGold, 40, 250);
  text("Life: " + playerLife, 40, 290);
  text("Towers: " + towers.length, 40, 330);
  text("Press 1 / 2 / 3 / 4 to switch map", 40, 370);

  if (currentWaveIndex >= currentLevelWaves.length - 1 && isWaveFullySpawned() && enemies.length === 0) {
    text("All waves cleared", 40, 410);
  }
}

function updateViewTransform() {
  viewScale = min(windowWidth / DESIGN_W, windowHeight / DESIGN_H);

  let displayW = DESIGN_W * viewScale;
  let displayH = DESIGN_H * viewScale;

  viewOffsetX = (windowWidth - displayW) / 2;
  viewOffsetY = (windowHeight - displayH) / 2;
}

function toGameX(screenX) {
  return (screenX - viewOffsetX) / viewScale;
}

function toGameY(screenY) {
  return (screenY - viewOffsetY) / viewScale;
}

function placeTower(slotIndex, type) {
  let cost = TOWER_COST[type];

  // ❌ 钱不够 → 不建塔
  if (playerGold < cost) {
    console.log("Not enough gold");
    return;
  }

  // ✅ 扣钱
  playerGold -= cost;

  let slot = towerSlots[slotIndex];

  // 建塔
  towers.push(new Tower(slot.x, slot.y, type));

  // 删除这个位置（防止重复建）
  towerSlots.splice(slotIndex, 1);
}