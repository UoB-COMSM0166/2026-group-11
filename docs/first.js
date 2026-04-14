let homeBg;
let selectBg;
let newGameBtnImg;
let gameBtnImg;

let newGameHoverScale = 1;
let gameHoverScale = 1;

// ===== 页面状态 =====
let gameState = "home";
// "home" | "levelSelect" | "playing"

// ===== 首页按钮 =====
let homeButtons = {};

// ===== 选关按钮 =====
let levelButtons = [];
let levelHoverScales = {};

// ===== 返回按钮 =====
let backButton = null;
let backHoverScale = 1;

function setupHomeButtons() {
  homeButtons.newGame = {
    x: DESIGN_W * 0.32,
    y: DESIGN_H * 0.60,
    w: DESIGN_W * 0.38,
    h: DESIGN_W * 0.38 * (207 / 994)
  };

  homeButtons.game = {
    x: DESIGN_W * 0.32,
    y: DESIGN_H * 0.78,
    w: DESIGN_W * 0.38,
    h: DESIGN_W * 0.38 * (207 / 994)
  };
}

function drawHome() {
  image(homeBg, 0, 0, DESIGN_W, DESIGN_H);
  drawNewGameButton();
  drawGameButton();
}

function drawNewGameButton() {
  let btn = homeButtons.newGame;
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);
  let hovering = isInsideButton(gx, gy, btn);

  let targetScale = hovering ? 1.08 : 1.0;
  newGameHoverScale = lerp(newGameHoverScale, targetScale, 0.15);

  let drawW = btn.w * newGameHoverScale;
  let drawH = btn.h * newGameHoverScale;

  let centerX = btn.x + btn.w / 2;
  let centerY = btn.y + btn.h / 2;

  let drawX = centerX - drawW / 2;
  let drawY = centerY - drawH / 2;

  image(newGameBtnImg, drawX, drawY, drawW, drawH);
}

function drawGameButton() {
  let btn = homeButtons.game;
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);
  let hovering = isInsideButton(gx, gy, btn);

  let targetScale = hovering ? 1.08 : 1.0;
  gameHoverScale = lerp(gameHoverScale, targetScale, 0.15);

  let drawW = btn.w * gameHoverScale;
  let drawH = btn.h * gameHoverScale;

  let centerX = btn.x + btn.w / 2;
  let centerY = btn.y + btn.h / 2;

  let drawX = centerX - drawW / 2;
  let drawY = centerY - drawH / 2;

  image(gameBtnImg, drawX, drawY, drawW, drawH);
}

function setupLevelButtons() {
  levelButtons = [
    { mapId: 1, x: 451,  y: 253,  w: 360, h: 275 },
    { mapId: 2, x: 870,  y: 253,  w: 360, h: 275 },
    { mapId: 3, x: 1290, y: 253,  w: 363, h: 275 },
    { mapId: 4, x: 1710, y: 253,  w: 370, h: 275 }
  ];

  for (let btn of levelButtons) {
    levelHoverScales[btn.mapId] = 1;
  }

  backButton = {
    x: 70,
    y: 1430,
    w: 300,
    h: 112
  };
}

function drawLevelSelect() {
  image(selectBg, 0, 0, DESIGN_W, DESIGN_H);

  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  for (let btn of levelButtons) {
    let hovering = isInsideButton(gx, gy, btn);
    let targetScale = hovering ? 1.03 : 1.0;
    levelHoverScales[btn.mapId] = lerp(levelHoverScales[btn.mapId], targetScale, 0.18);

    drawLevelHoverGlow(btn, levelHoverScales[btn.mapId], hovering);
  }

  drawBackButton();
}

function drawLevelHoverGlow(btn, scaleValue, hovering) {
  let centerX = btn.x + btn.w / 2;
  let centerY = btn.y + btn.h / 2;
  let drawW = btn.w * scaleValue;
  let drawH = btn.h * scaleValue;
  let drawX = centerX - drawW / 2;
  let drawY = centerY - drawH / 2;

  push();
  noFill();

  if (hovering) {
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = "rgba(255, 245, 170, 0.95)";
    stroke(255, 248, 180, 240);
    strokeWeight(8);
    rect(drawX, drawY, drawW, drawH, 22);

    drawingContext.shadowBlur = 18;
    drawingContext.shadowColor = "rgba(255, 255, 255, 0.9)";
    stroke(255, 255, 255, 220);
    strokeWeight(3);
    rect(drawX + 4, drawY + 4, drawW - 8, drawH - 8, 18);
  }

  pop();
}

function drawBackButton() {
}

function handleHomeClick() {
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (isInsideButton(gx, gy, homeButtons.newGame)) {
    startNewGame();
    return;
  }

  if (isInsideButton(gx, gy, homeButtons.game)) {
    continueGame();
    return;
  }
}

function handleLevelSelectClick() {
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (backButton && isInsideButton(gx, gy, backButton)) {
    gameState = "home";
    return;
  }

  for (let btn of levelButtons) {
    if (isInsideButton(gx, gy, btn)) {
      enterMap(btn.mapId);
      return;
    }
  }
}

function enterMap(mapId) {
  loadMap(mapId);
  gameState = "playing";
}

function startNewGame() {
  gameState = "levelSelect";
}

function continueGame() {
  gameState = "levelSelect";
}

function saveGame() {
}

function loadGame() {
}

function isInsideButton(px, py, btn) {
  return (
    px >= btn.x &&
    px <= btn.x + btn.w &&
    py >= btn.y &&
    py <= btn.y + btn.h
  );
}

function isInsideRect(px, py, x, y, w, h) {
  return (
    px >= x &&
    px <= x + w &&
    py >= y &&
    py <= y + h
  );
}

function completeMap(mapId) {
  gameState = "levelSelect";
}