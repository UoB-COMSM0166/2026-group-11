let mapImages = {};
let currentMap = 1;
let currentMapData = null;

let enemyGif;
let enemyImages = {};
let tower1Lv1Img;
let tower1Lv2Img;
let tower1Lv3Img;
let tower2Lv1Img;
let tower2Lv2Img;
let tower2Lv3Img;
let tower3Lv1Img;
let tower3Lv2Img;
let tower3Lv3Img;
let tower4Lv1Img;
let tower4Lv2Img;
let tower4Lv3Img;
let towerMenuImg;
let hudPanelImg;
let defeatImg;
let victoryImg;
let startWaveImg;
let speed1Img;
let speed2Img;
let upgradeRingImgs = {};
let startPulse = 0;
let startButtonRadius = 110;

let resultOverlay = {
  active: false,
  type: null,
  anim: 0,
  targetAnim: 0,
  blockInput: false
};

let centerNoticeText = "";
let centerNoticeTimer = 0;
let centerNoticeDuration = 90;

const DESIGN_W = 2560;
const DESIGN_H = 1600;
const TOP_RIGHT_UI_BUTTON_SIZE = 115;
const TOWER_ACTION_UI_W = 360;
const TOWER_ACTION_UI_H = 540;
const TOWER_ACTION_UI_CENTER_Y_OFFSET = -48;
const TOWER_ACTION_TOP_OFFSET_Y = -0.177;
const TOWER_ACTION_BOTTOM_OFFSET_Y = 0.207;
const TOWER_ACTION_BUTTON_RADIUS = 54;
const TOWER_SELL_REFUND_RATE = 0.8;

const TOWER_ACTION_RING_MAP = {
  tower1: ["up2", "up4"],
  tower2: ["up1", "up3"],
  tower3: ["up3", "up5"],
  tower4: ["up1", "up3"]
};

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
  } else if (gameState === "comic") {
    drawComicIntro();
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

  if (!resultOverlay.active) {
    spawnCurrentWave();
    updateAndDrawEnemies();

    drawTowerSlots();
    updateAndDrawTowers();
    updateAndDrawLasers();

    updateMenuAnimation();
    drawTowerMenu();
  } else {
    drawTowerSlots();

    for (let enemy of enemies) {
      enemy.displayBody();
    }

    for (let enemy of enemies) {
      enemy.displayHealthBar();
    }

    for (let tower of towers) {
      tower.display();
    }

    for (let laser of lasers) {
      if (laser.display) laser.display();
    }
  }

  drawUI();
  drawBackButton();
  drawResultOverlay();
}

function mousePressed() {
  if (gameState === "home") {
    handleHomeClick();
    return;
  }

  if (gameState === "comic") {
    handleComicIntroClick();
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

  if (key === "u" || key === "U") {
    tryUpgradeSelectedTower();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateViewTransform();
}

function handlePlayingClick() {
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (clickedWaveStartButton(gx, gy)) {
    beginCurrentWave();
    return;
  }

  if (selectedTower && !menuOpen && !resultOverlay.active) {
    const selectedAction = getClickedSelectedTowerAction(gx, gy);

    if (selectedAction === "upgrade") {
      tryUpgradeSelectedTower();
      return;
    }

    if (selectedAction === "sell") {
      sellSelectedTower();
      return;
    }
  }

  if (resultOverlay.active) {
    const rects = getResultOverlayButtonRects();
    if (!rects) return;

    if (pointInRect(gx, gy, rects.leftBtn)) {
      hideResultOverlay();
      loadMap(currentMap);
      return;
    }

    if (pointInRect(gx, gy, rects.rightBtn)) {
      if (resultOverlay.type === "victory") {
        hideResultOverlay();

        if (currentMap < 4) {
          loadMap(currentMap + 1);
        } else {
          gameState = "levelSelect";
        }
      } else {
        hideResultOverlay();
        gameState = "levelSelect";
      }
      return;
    }

    return;
  }

  if (isInsideRect(gx, gy, 30, 30, 160, 60)) {
    closeTowerMenu();
    selectedTower = null;
    gameState = "levelSelect";
    return;
  }

  if (menuOpen) {
    let option = getClickedMenuOption(gx, gy);

    if (option === "cannon") {
      placeTower(menuSlotIndex, "tower2");
      closeTowerMenu();
      selectedTower = null;
      return;
    }

    if (option === "magic") {
      placeTower(menuSlotIndex, "tower1");
      closeTowerMenu();
      selectedTower = null;
      return;
    }

    if (option === "bomb") {
      placeTower(menuSlotIndex, "tower3");
      closeTowerMenu();
      selectedTower = null;
      return;
    }

    if (option === "ice") {
      placeTower(menuSlotIndex, "tower4");
      closeTowerMenu();
      selectedTower = null;
      return;
    }

    if (!isInsideMenu(gx, gy)) {
      closeTowerMenu();
    } else {
      return;
    }
  }

  if (handleTowerSelection(gx, gy)) {
    closeTowerMenu();
    return;
  }

  for (let i = 0; i < towerSlots.length; i++) {
    let slot = towerSlots[i];
    let d = dist(gx, gy, slot.x, slot.y);

    if (d < 60 * uiScale && !slot.occupied) {
      selectedTower = null;
      openTowerMenu(i);
      return;
    }
  }

  selectedTower = null;
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
  selectedTower = null;

  centerNoticeText = "";
  centerNoticeTimer = 0;

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

function getWaveStartPoints() {
  const fixedWaveStartPoints = {
    1: [
      { x: 2260, y: 600 }
    ],
    2: [
      { x: 2205, y: 50 },
      { x: 1645, y: 1540 }
    ],
    3: [
      { x: 1890, y: 60 },
      { x: 2440, y: 660 },
      { x: 120, y: 180 }
    ],
    4: [
      { x: 2470, y: 255 },
      { x: 2130, y: 1510 }
    ]
  };

  if (fixedWaveStartPoints[currentMap]) {
    return fixedWaveStartPoints[currentMap];
  }

  let points = [];

  if (allPathPoints && allPathPoints.length > 0) {
    for (let path of allPathPoints) {
      if (path && path.length > 0) {
        points.push({
          x: path[0].x,
          y: path[0].y
        });
      }
    }
    return points;
  }

  if (pathPoints && pathPoints.length > 0) {
    points.push({
      x: pathPoints[0].x,
      y: pathPoints[0].y
    });
  }

  return points;
}

function drawWaveStartButtons() {
  if (!waveWaitingForStart || !startWaveImg || resultOverlay.active) return;

  const points = getWaveStartPoints();
  if (points.length === 0) return;

  startPulse += 0.08;
  const pulse = 1 + sin(startPulse) * 0.06;

  for (let p of points) {
    const size = 170 * pulse;

    push();
    noStroke();
    fill(255, 220, 80, 55);
    ellipse(p.x, p.y, 150 * pulse, 150 * pulse);
    pop();

    imageMode(CENTER);
    image(startWaveImg, p.x, p.y, size, size);
    imageMode(CORNER);
  }
}

function clickedWaveStartButton(mx, my) {
  if (!waveWaitingForStart) return false;

  const points = getWaveStartPoints();

  for (let p of points) {
    if (dist(mx, my, p.x, p.y) <= startButtonRadius) {
      return true;
    }
  }

  return false;
}

function showResultOverlay(type) {
  if (resultOverlay.active) return;

  resultOverlay.active = true;
  resultOverlay.type = type;
  resultOverlay.anim = 0;
  resultOverlay.targetAnim = 1;
  resultOverlay.blockInput = true;

  closeTowerMenu();
  selectedTower = null;
}

function hideResultOverlay() {
  resultOverlay.active = false;
  resultOverlay.type = null;
  resultOverlay.anim = 0;
  resultOverlay.targetAnim = 0;
  resultOverlay.blockInput = false;
}

function getUpgradeButtonRect() {
  return {
    x: DESIGN_W / 2 - 210,
    y: DESIGN_H - 165,
    w: 420,
    h: 88
  };
}

function tryUpgradeSelectedTower() {
  if (!selectedTower) return false;

  if (!selectedTower.canUpgrade || !selectedTower.canUpgrade()) {
    showCenterNotice("Max level", 80);
    return true;
  }

  const cost = selectedTower.getUpgradeCost();

  if (playerGold < cost) {
    showCenterNotice("Not enough gold", 90);
    return true;
  }

  playerGold -= cost;
  if (typeof selectedTower.totalSpent === "number") {
    selectedTower.totalSpent += cost;
  }
  selectedTower.upgrade();
  showCenterNotice("Tower upgraded", 70);
  return true;
}

function getTowerActionUiImageForTower(tower) {
  if (!tower) return null;

  const keyList = TOWER_ACTION_RING_MAP[tower.type];
  if (!keyList || keyList.length === 0) return null;

  const keyIndex = constrain(tower.level - 1, 0, keyList.length - 1);
  const key = keyList[keyIndex];
  return upgradeRingImgs[key] || null;
}

function getTowerActionUiLayout(tower) {
  if (!tower) return null;

  const w = TOWER_ACTION_UI_W * uiScale;
  const h = TOWER_ACTION_UI_H * uiScale;
  const cx = tower.x;
  const cy = tower.y + TOWER_ACTION_UI_CENTER_Y_OFFSET * uiScale;

  return {
    x: cx,
    y: cy,
    w,
    h,
    topBtn: {
      x: cx,
      y: cy + h * TOWER_ACTION_TOP_OFFSET_Y,
      r: TOWER_ACTION_BUTTON_RADIUS * uiScale
    },
    bottomBtn: {
      x: cx,
      y: cy + h * TOWER_ACTION_BOTTOM_OFFSET_Y,
      r: TOWER_ACTION_BUTTON_RADIUS * uiScale
    }
  };
}

function getClickedSelectedTowerAction(mx, my) {
  if (!selectedTower) return null;

  const layout = getTowerActionUiLayout(selectedTower);
  if (!layout) return null;

  if (dist(mx, my, layout.topBtn.x, layout.topBtn.y) <= layout.topBtn.r) {
    return "upgrade";
  }

  if (dist(mx, my, layout.bottomBtn.x, layout.bottomBtn.y) <= layout.bottomBtn.r) {
    return "sell";
  }

  return null;
}

function getSelectedTowerSellValue() {
  if (!selectedTower) return 0;

  const spent = selectedTower.totalSpent || TOWER_COST[selectedTower.type] || 0;
  return floor(spent * TOWER_SELL_REFUND_RATE);
}

function sellSelectedTower() {
  if (!selectedTower) return false;

  const refund = getSelectedTowerSellValue();
  playerGold += refund;

  towerSlots.push({
    x: selectedTower.x,
    y: selectedTower.y,
    occupied: false
  });

  const towerIndex = towers.indexOf(selectedTower);
  if (towerIndex >= 0) {
    towers.splice(towerIndex, 1);
  }

  selectedTower = null;
  closeTowerMenu();
  showCenterNotice("Sold for $" + refund, 80);
  return true;
}

function drawSelectedTowerActionUi(tower) {
  if (!tower || tower !== selectedTower || menuOpen || resultOverlay.active) return;

  const img = getTowerActionUiImageForTower(tower);
  const layout = getTowerActionUiLayout(tower);
  if (!img || !layout) return;

  imageMode(CENTER);
  image(img, layout.x, layout.y, layout.w, layout.h);
  imageMode(CORNER);

  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);
  const topHover = dist(gx, gy, layout.topBtn.x, layout.topBtn.y) <= layout.topBtn.r;
  const bottomHover = dist(gx, gy, layout.bottomBtn.x, layout.bottomBtn.y) <= layout.bottomBtn.r;

  if (topHover) {
    push();
    noFill();
    stroke(255, 245, 160, 170);
    strokeWeight(6 * uiScale);
    ellipse(layout.topBtn.x, layout.topBtn.y, layout.topBtn.r * 2.15, layout.topBtn.r * 2.15);
    pop();
  }

  if (bottomHover) {
    push();
    noFill();
    stroke(255, 245, 160, 170);
    strokeWeight(6 * uiScale);
    ellipse(layout.bottomBtn.x, layout.bottomBtn.y, layout.bottomBtn.r * 2.15, layout.bottomBtn.r * 2.15);
    pop();
  }

  if (!tower.canUpgrade || !tower.canUpgrade()) {
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0, 170);
    rect(layout.topBtn.x, layout.topBtn.y, 150 * uiScale, 86 * uiScale, 18 * uiScale);

    fill(255, 245, 180);
    textAlign(CENTER, CENTER);
    textFont("Futura");
    textSize(34 * uiScale);
    text("MAX", layout.topBtn.x, layout.topBtn.y + 3 * uiScale);
    pop();
  }
}

function drawUpgradePanel() {
  if (!selectedTower || menuOpen || resultOverlay.active) return;

  const panel = getUpgradeButtonRect();
  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);
  const hovering = isInsideRect(gx, gy, panel.x, panel.y, panel.w, panel.h);

  push();
  rectMode(CORNER);

  noStroke();
  fill(0, 0, 0, 155);
  rect(panel.x, panel.y, panel.w, panel.h, 22);

  stroke(hovering ? 255 : 220, hovering ? 220 : 195, 120, 220);
  strokeWeight(4);
  noFill();
  rect(panel.x, panel.y, panel.w, panel.h, 22);

  fill(255, 245, 205);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Futura");

  let title = "Upgrade";
  let detail = "Lv." + selectedTower.level + " -> Lv." + min(selectedTower.level + 1, selectedTower.maxLevel);

  if (selectedTower.canUpgrade && selectedTower.canUpgrade()) {
    title = "Upgrade  $" + selectedTower.getUpgradeCost();
  } else {
    title = "MAX LEVEL";
    detail = "Lv." + selectedTower.level;
  }

  textSize(34);
  text(title, panel.x + panel.w / 2, panel.y + 34);

  textSize(22);
  text(detail, panel.x + panel.w / 2, panel.y + 64);

  pop();
}

function showCenterNotice(text, duration = 90) {
  centerNoticeText = text;
  centerNoticeDuration = duration;
  centerNoticeTimer = duration;
}

function drawCenterNotice() {
  if (centerNoticeTimer <= 0) return;

  let alpha = 255;
  if (centerNoticeTimer < 15) {
    alpha = map(centerNoticeTimer, 0, 15, 0, 255);
  }

  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  noStroke();
  fill(0, 0, 0, min(alpha, 175));
  rect(DESIGN_W / 2, DESIGN_H / 2, 560, 120, 20);

  fill(255, 245, 170, alpha);
  textSize(46);
  textFont("Futura");
  text(centerNoticeText, DESIGN_W / 2, DESIGN_H / 2 + 2);

  pop();

  centerNoticeTimer--;
}

function updateResultOverlayAnimation() {
  if (!resultOverlay.active) return;
  resultOverlay.anim = lerp(resultOverlay.anim, resultOverlay.targetAnim, 0.12);
}

function getResultOverlayButtonRects() {
  const img = resultOverlay.type === "victory" ? victoryImg : defeatImg;
  if (!img) return null;

  const baseW = 1200;
  const scalePop = 0.88 + resultOverlay.anim * 0.12;
  const w = baseW * scalePop;
  const h = w * (img.height / img.width);

  const x = DESIGN_W / 2;
  const y = DESIGN_H / 2 - 40 + (1 - resultOverlay.anim) * 50;

  if (resultOverlay.type === "defeat") {
    return {
      panel: { x, y, w, h },
      leftBtn: {
        x: 980,
        y: 875,
        w: 290,
        h: 90
      },
      rightBtn: {
        x: 1285,
        y: 875,
        w: 295,
        h: 90
      }
    };
  }

  return {
    panel: { x, y, w, h },
    leftBtn: {
      x: 980,
      y: 885,
      w: 300,
      h: 105
    },
    rightBtn: {
      x: 1280,
      y: 885,
      w: 315,
      h: 105
    }
  };
}

function drawResultOverlay() {
  if (!resultOverlay.active) return;

  updateResultOverlayAnimation();

  const alpha = 180 * resultOverlay.anim;

  noStroke();
  fill(0, 0, 0, alpha);
  rect(0, 0, DESIGN_W, DESIGN_H);

  const img = resultOverlay.type === "victory" ? victoryImg : defeatImg;
  if (!img) return;

  const baseW = 1200;
  const scalePop = 0.88 + resultOverlay.anim * 0.12;
  const w = baseW * scalePop;
  const h = w * (img.height / img.width);

  const x = DESIGN_W / 2;
  const y = DESIGN_H / 2 - 40 + (1 - resultOverlay.anim) * 50;

  push();
  tint(255, 255 * resultOverlay.anim);
  imageMode(CENTER);
  image(img, x, y, w, h);
  pop();

  imageMode(CORNER);

  const rects = getResultOverlayButtonRects();
  if (!rects) return;

  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);

  if (pointInRect(gx, gy, rects.leftBtn)) {
    drawButtonGlow(rects.leftBtn);
  }
  if (pointInRect(gx, gy, rects.rightBtn)) {
    drawButtonGlow(rects.rightBtn);
  }
}

function pointInRect(px, py, r) {
  return (
    px >= r.x &&
    px <= r.x + r.w &&
    py >= r.y &&
    py <= r.y + r.h
  );
}

function drawButtonGlow(r) {
  push();
  noFill();
  stroke(255, 235, 140, 180);
  strokeWeight(6);
  rect(r.x, r.y, r.w, r.h, 18);

  stroke(255, 255, 220, 90);
  strokeWeight(12);
  rect(r.x, r.y, r.w, r.h, 20);
  pop();
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
      x: menuX - w * 0.29,
      y: menuY - h * 0.11
    },
    topRight: {
      x: menuX + w * 0.29,
      y: menuY - h * 0.11
    },
    bottomLeft: {
      x: menuX - w * 0.29,
      y: menuY + h * 0.15
    },
    bottomRight: {
      x: menuX + w * 0.29,
      y: menuY + h * 0.15
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

  for (let enemy of enemies) {
    enemy.displayBody();
  }

  for (let enemy of enemies) {
    enemy.displayHealthBar();
  }

  checkWaveAdvance();
}

function updateAndDrawTowers() {
  for (let tower of towers) {
    tower.update();
    tower.display();
  }

  // 所有塔都画完后，再把选中塔的升级UI画到最上层
  if (selectedTower) {
    selectedTower.displayLevelBadge();
    drawSelectedTowerActionUi(selectedTower);
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
  if (hudPanelImg) {
    const panelX = 40;
    const panelY = 40;
    const panelW = 520;
    const panelH = 340;

    image(hudPanelImg, panelX, panelY, panelW, panelH);

    fill(90, 45, 10);
    noStroke();
    textAlign(LEFT, CENTER);

    textSize(40);
    textFont("Futura");
    text(playerGold, panelX + 270, panelY + 90);

    const waveNumber = min(currentWaveIndex + 1, currentLevelWaves.length);
    const totalWaves = currentLevelWaves.length;
    textSize(40);
    textFont("Futura");
    text(waveNumber + " / " + totalWaves, panelX + 270, panelY + 170);

    const lifeSlots = 10;
    const filledLife = constrain(playerLife, 0, lifeSlots);

    const barX = panelX + 125;
    const barY = panelY + 228;
    const barW = 320;
    const barH = 43;
    const gap = 2;

    const slotW = (barW - gap * (lifeSlots - 1)) / lifeSlots;

    for (let i = 0; i < lifeSlots; i++) {
      let x = barX + i * (slotW + gap);
      let y = barY;
      let innerPad = 3;

      if (i < filledLife) {
        fill(216, 74, 48);
      } else {
        fill(210, 190, 150, 90);
      }

      noStroke();
      rect(x + innerPad, y + innerPad, slotW - innerPad * 2, barH - innerPad * 2, 4);
    }
  }

  drawCenterNotice();
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

  if (playerGold < cost) {
    showCenterNotice("Not enough gold", 90);
    return;
  }

  playerGold -= cost;

  let slot = towerSlots[slotIndex];
  towers.push(new Tower(slot.x, slot.y, type));
  towerSlots.splice(slotIndex, 1);
  selectedTower = null;
}