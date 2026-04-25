let homeBg;
let selectBg;
let newGameBtnImg;
let gameBtnImg;

let homeVideo = null;
let homeVideoReady = false;
let homeVideoPlayTried = false;

let newGameHoverScale = 1;
let gameHoverScale = 1;
let gameState = "home";
let homeButtons = {};
let levelButtons = [];
let levelHoverScales = {};
let backButton = null;
let backHoverScale = 1;

let currentSceneBgm = null;
let desiredSceneBgm = null;

function setupHomeVideo() {
  if (homeVideo) return;

  // The home video is muted to satisfy browser autoplay rules.
  homeVideo = createVideo(["openning.mp4"]);

  homeVideo.hide();          
  homeVideo.volume(0);       
  homeVideo.elt.muted = true; 
  homeVideo.elt.defaultMuted = true;
  homeVideo.elt.loop = true;
  homeVideo.elt.autoplay = true;
  homeVideo.elt.controls = false;
  homeVideo.elt.playsInline = true;
  homeVideo.elt.setAttribute("muted", "");
  homeVideo.elt.setAttribute("playsinline", "");
  homeVideo.elt.setAttribute("webkit-playsinline", "");

  homeVideo.elt.addEventListener("loadeddata", () => {
    homeVideoReady = true;
    resumeHomeVideo();
  });
}

function resumeHomeVideo() {
  if (!homeVideo || !homeVideoReady) return;

  // Play may be rejected by the browser, so failures are ignored until the next user action.
  homeVideo.volume(0);
  homeVideo.elt.muted = true;
  homeVideo.elt.defaultMuted = true;

  const p = homeVideo.elt.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {});
  }
}

function stopHomeVideo() {
  if (!homeVideo) return;
  if (homeVideo.elt && !homeVideo.elt.paused) {
    homeVideo.elt.pause();
  }
}

function ensureSceneBgm(key, options = {}) {
  const previousDesiredBgm = desiredSceneBgm;
  const force = options.force === true;
  desiredSceneBgm = key;
  if (previousDesiredBgm && previousDesiredBgm !== key && typeof resetBgmAttemptState === "function") {
    resetBgmAttemptState(previousDesiredBgm);
  }
  if (currentSceneBgm === key && typeof isBgmPlaying === "function" && isBgmPlaying(key)) return;
  if (!force && typeof isBgmPlayPending === "function" && isBgmPlayPending(key)) return;
  if (!force && typeof isBgmAutoplayBlocked === "function" && isBgmAutoplayBlocked(key)) return;

  // Scene BGM switches through one helper so home, comic, and maps do not overlap.
  if (typeof stopAllBgm === "function") {
    stopAllBgm();
  }

  if (typeof playBgm === "function") {
    const attempted = playBgm(key, { force });
    currentSceneBgm = attempted ? key : null;
  }
}

function clearSceneBgm() {
  if (typeof resetBgmAttemptState === "function") {
    resetBgmAttemptState(desiredSceneBgm);
  }
  if (typeof stopAllBgm === "function") {
    stopAllBgm();
  }
  currentSceneBgm = null;
  desiredSceneBgm = null;
}

function retryDesiredSceneBgm() {
  if (!desiredSceneBgm) return;
  if (typeof isGameAudioMuted === "function" && isGameAudioMuted()) return;
  if (typeof resetBgmAttemptState === "function") {
    resetBgmAttemptState(desiredSceneBgm);
  }
  ensureSceneBgm(desiredSceneBgm, { force: true });
}

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
  // Home screen prefers the video background and falls back to a static image.
  ensureSceneBgm("homeLoop");
  if (homeVideo && homeVideoReady) {
    if (homeVideo.elt.paused && !homeVideoPlayTried) {
      homeVideoPlayTried = true;
      resumeHomeVideo();
    }

    let vw = homeVideo.width || (homeVideo.elt ? homeVideo.elt.videoWidth : 0);
    let vh = homeVideo.height || (homeVideo.elt ? homeVideo.elt.videoHeight : 0);

    if (vw > 0 && vh > 0) {
      let sx = 64;
      let sy = 0;
      let sw = vw - 128; // 1280 - 64*2 = 1152
      let sh = vh;
      let scale = max(DESIGN_W / sw, DESIGN_H / sh);
      let drawW = sw * scale;
      let drawH = sh * scale;
      let drawX = (DESIGN_W - drawW) / 2;
      let drawY = (DESIGN_H - drawH) / 2;

      image(homeVideo, drawX, drawY, drawW, drawH, sx, sy, sw, sh);
    } else {
      image(homeBg, 0, 0, DESIGN_W, DESIGN_H);
    }
  } else {
    image(homeBg, 0, 0, DESIGN_W, DESIGN_H);
  }

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
  ensureSceneBgm("homeLoop");
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
  // Home buttons branch into intro flow or direct level selection.
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (isInsideButton(gx, gy, homeButtons.newGame)) {
    stopHomeVideo();
    startNewGame();
    return;
  }

  if (isInsideButton(gx, gy, homeButtons.game)) {
    stopHomeVideo();
    continueGame();
    return;
  }
}

function handleLevelSelectClick() {
  let gx = toGameX(mouseX);
  let gy = toGameY(mouseY);

  if (backButton && isInsideButton(gx, gy, backButton)) {
    gameState = "home";
    homeVideoPlayTried = false;
    resumeHomeVideo();
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
  stopHomeVideo();
  clearSceneBgm();
  loadMap(mapId);
  gameState = "playing";
}

function startNewGame() {
  stopHomeVideo();
  startNewGameFlow();
}

function continueGame() {
  stopHomeVideo();
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