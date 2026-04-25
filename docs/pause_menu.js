let stop1Img = null;
let stop2Img = null;

let pauseMenuOpen = false;
let gameAudioMuted = false;

function preloadPauseMenu() {
  // Pause assets are patched into preloadAssets so the menu is ready during gameplay.
  if (!stop1Img) stop1Img = loadImage("ui/stop1.png");
  if (!stop2Img) stop2Img = loadImage("ui/stop2.png");
}

function getPauseButtonData() {
  return {
    x: DESIGN_W - 130,
    y: 110,
    size: TOP_RIGHT_UI_BUTTON_SIZE
  };
}

function getPausePanelData() {
  if (!stop2Img) return null;

  const w = 1380;
  const h = w * (stop2Img.height / stop2Img.width);

  return {
    x: DESIGN_W / 2,
    y: DESIGN_H / 2,
    w,
    h
  };
}

function getPauseButtons() {
  return {
    sound: {
      x: (800 + 1170) / 2,
      y: (670 + 1020) / 2,
      w: 1170 - 800,
      h: 1020 - 670
    },

    back: {
      x: (1280 + 1840) / 2,
      y: (620 + 750) / 2,
      w: 1840 - 1280,
      h: 750 - 620
    },

    exit: {
      x: (1280 + 1840) / 2,
      y: (770 + 900) / 2,
      w: 1840 - 1280,
      h: 900 - 770
    },

    restart: {
      x: (1280 + 1840) / 2,
      y: (920 + 1050) / 2,
      w: 1840 - 1280,
      h: 1050 - 920
    }
  };
}

function pauseMouseX() {
  return typeof toGameX === "function" ? toGameX(mouseX) : mouseX;
}

function pauseMouseY() {
  return typeof toGameY === "function" ? toGameY(mouseY) : mouseY;
}

function pointInCenterRect(px, py, r) {
  return (
    px >= r.x - r.w / 2 &&
    px <= r.x + r.w / 2 &&
    py >= r.y - r.h / 2 &&
    py <= r.y + r.h / 2
  );
}

function pointInCircle(px, py, cx, cy, radius) {
  return dist(px, py, cx, cy) <= radius;
}

function isInsidePauseButton(px, py) {
  const btn = getPauseButtonData();
  return pointInCircle(px, py, btn.x, btn.y, btn.size * 0.5);
}

function openPauseMenu() {
  if (typeof gameState !== "undefined" && gameState !== "playing") return;
  if (typeof resultOverlay !== "undefined" && resultOverlay.active) return;

  // Pause keeps the current battle state so players can resume safely.
  pauseMenuOpen = true;

  if (typeof closeTowerMenu === "function") closeTowerMenu();
  if (typeof selectedTower !== "undefined") selectedTower = null;
}

function closePauseMenu() {
  pauseMenuOpen = false;
}

function toggleMuteState() {
  gameAudioMuted = !gameAudioMuted;

  // Browser audio may use both pooled HTML audio and p5 master volume.
  if (typeof setGameSoundsMuted === "function") {
  setGameSoundsMuted(gameAudioMuted);
  }
  
  if (typeof masterVolume === "function") {
    masterVolume(gameAudioMuted ? 0 : 1);
  }

  if (typeof getAudioContext === "function") {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        if (gameAudioMuted && ctx.state === "running") ctx.suspend();
        if (!gameAudioMuted && ctx.state === "suspended") ctx.resume();
      }
    } catch (e) {}
  }

  try {
    const mediaNodes = document.querySelectorAll("audio, video");
    for (const media of mediaNodes) {
      media.muted = gameAudioMuted;
      media.volume = gameAudioMuted ? 0 : 1;
    }
  } catch (e) {}
}

function drawPauseButtonGlow(cx, cy, d) {
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

function drawPauseRectGlow(btn, radius = 24) {
  push();
  noFill();
  rectMode(CENTER);

  drawingContext.shadowBlur = 34;
  drawingContext.shadowColor = "rgba(255, 242, 170, 0.98)";
  stroke(255, 238, 160, 230);
  strokeWeight(6);
  rect(btn.x, btn.y, btn.w, btn.h, radius);

  drawingContext.shadowBlur = 16;
  drawingContext.shadowColor = "rgba(255,255,255,0.9)";
  stroke(255, 255, 255, 170);
  strokeWeight(2.5);
  rect(btn.x, btn.y, btn.w - 8, btn.h - 8, max(8, radius - 6));

  pop();
}

function drawMuteSlash(btn) {
  if (!gameAudioMuted) return;

  push();
  strokeCap(ROUND);

  stroke(170, 30, 30, 245);
  strokeWeight(14);
  line(
    btn.x - btn.w * 0.26,
    btn.y + btn.h * 0.30,
    btn.x + btn.w * 0.26,
    btn.y - btn.h * 0.30
  );

  stroke(255, 235, 180, 185);
  strokeWeight(5);
  line(
    btn.x - btn.w * 0.26,
    btn.y + btn.h * 0.30,
    btn.x + btn.w * 0.26,
    btn.y - btn.h * 0.30
  );

  pop();
}

function drawPauseButtonOnly() {
  if (typeof gameState !== "undefined" && gameState !== "playing") return;
  if (pauseMenuOpen) return;
  if (typeof resultOverlay !== "undefined" && resultOverlay.active) return;
  if (!stop1Img) return;

  const btn = getPauseButtonData();
  const mx = pauseMouseX();
  const my = pauseMouseY();
  const hovering = isInsidePauseButton(mx, my);

  if (hovering) {
    drawPauseButtonGlow(btn.x, btn.y, btn.size * 0.95);
  }

  push();
  imageMode(CENTER);
  drawingContext.imageSmoothingEnabled = false;
  image(stop1Img, btn.x, btn.y, btn.size, btn.size);
  pop();
}

function drawPausePanelOnly() {
  if (!pauseMenuOpen) return;
  if (!stop2Img) return;

  const panel = getPausePanelData();
  const buttons = getPauseButtons();
  if (!panel || !buttons) return;

  const mx = pauseMouseX();
  const my = pauseMouseY();

  push();
  noStroke();
  fill(0, 0, 0, 170);
  rectMode(CORNER);
  rect(0, 0, DESIGN_W, DESIGN_H);
  pop();

  push();
  imageMode(CENTER);
  drawingContext.imageSmoothingEnabled = false;
  image(stop2Img, panel.x, panel.y, panel.w, panel.h);
  pop();

  if (pointInCenterRect(mx, my, buttons.sound)) drawPauseRectGlow(buttons.sound, 28);
  if (pointInCenterRect(mx, my, buttons.back)) drawPauseRectGlow(buttons.back, 28);
  if (pointInCenterRect(mx, my, buttons.exit)) drawPauseRectGlow(buttons.exit, 28);
  if (pointInCenterRect(mx, my, buttons.restart)) drawPauseRectGlow(buttons.restart, 28);

  drawMuteSlash(buttons.sound);
}

function drawPauseOverlay() {
  if (pauseMenuOpen) drawPausePanelOnly();
  else drawPauseButtonOnly();
}

function drawEnemiesPausedOnly() {
  if (typeof drawEnemiesOnly === "function") {
    drawEnemiesOnly();
    return;
  }

  if (typeof enemies === "undefined") return;

  for (let enemy of enemies) {
    if (enemy.displayBody) enemy.displayBody();
    else if (enemy.display) enemy.display();
  }

  for (let enemy of enemies) {
    if (enemy.displayHealthBar) enemy.displayHealthBar();
  }
}

function drawTowersPausedOnly() {
  if (typeof drawTowersOnly === "function") {
    drawTowersOnly();
    return;
  }

  if (typeof towers === "undefined") return;

  for (let tower of towers) {
    if (tower.display) tower.display();
  }
}

function drawLasersPausedOnly() {
  if (typeof drawLasersOnly === "function") {
    drawLasersOnly();
    return;
  }

  if (typeof lasers === "undefined") return;

  for (let laser of lasers) {
    if (laser.display) laser.display();
  }
}

function drawWaveButtonsPausedStatic() {
  if (typeof waveWaitingForStart === "undefined") return;
  if (!waveWaitingForStart) return;
  if (typeof startWaveImg === "undefined" || !startWaveImg) return;
  if (typeof getWaveStartPoints !== "function") return;

  const points = getWaveStartPoints();
  if (!points || points.length === 0) return;

  for (let p of points) {
    push();
    noStroke();
    fill(255, 220, 80, 55);
    ellipse(p.x, p.y, 150, 150);
    pop();

    imageMode(CENTER);
    image(startWaveImg, p.x, p.y, 170, 170);
    imageMode(CORNER);
  }
}

function drawPausedPlayingFrame() {
  // Draw a static gameplay frame while simulation updates are blocked.
  if (typeof mapImages !== "undefined" && mapImages[currentMap]) {
    image(mapImages[currentMap], 0, 0, DESIGN_W, DESIGN_H);
  }

  if (typeof drawTowerSlots === "function") drawTowerSlots();

  drawEnemiesPausedOnly();
  drawTowersPausedOnly();
  drawLasersPausedOnly();

  if (!(typeof resultOverlay !== "undefined" && resultOverlay.active)) {
    drawWaveButtonsPausedStatic();
  }

  if (typeof drawUI === "function") drawUI();
  if (typeof drawBackButton === "function") drawBackButton();
  if (typeof drawResultOverlay === "function") drawResultOverlay();
}

function handlePauseMenuAction(mx, my) {
  const buttons = getPauseButtons();
  if (!buttons) return true;

  // Pause menu actions either resume, restart, return to level select, or mute audio.
  if (pointInCenterRect(mx, my, buttons.sound)) {
    toggleMuteState();
    return true;
  }

  if (pointInCenterRect(mx, my, buttons.back)) {
    closePauseMenu();
    return true;
  }

  if (pointInCenterRect(mx, my, buttons.exit)) {
    closePauseMenu();

    if (typeof closeTowerMenu === "function") closeTowerMenu();
    if (typeof selectedTower !== "undefined") selectedTower = null;

    gameState = "levelSelect";
    return true;
  }

  if (pointInCenterRect(mx, my, buttons.restart)) {
    closePauseMenu();

    if (typeof hideResultOverlay === "function") hideResultOverlay();
    if (typeof loadMap === "function") loadMap(currentMap);

    return true;
  }

  return true;
}

function mousePressedPauseMenu() {
  if (typeof gameState !== "undefined" && gameState !== "playing") return false;
  if (typeof resultOverlay !== "undefined" && resultOverlay.active) return false;

  const mx = pauseMouseX();
  const my = pauseMouseY();

  if (pauseMenuOpen) {
    return handlePauseMenuAction(mx, my);
  }

  if (isInsidePauseButton(mx, my)) {
    openPauseMenu();
    return true;
  }

  return false;
}

function keyPressedPauseMenu() {
  if (typeof gameState !== "undefined" && gameState !== "playing") return true;
  if (typeof resultOverlay !== "undefined" && resultOverlay.active) return true;

  if (keyCode === ESCAPE || key === "Escape") {
    if (pauseMenuOpen) closePauseMenu();
    else openPauseMenu();
    return false;
  }

  return true;
}

(function patchPauseSystem() {
  // Patch hooks let the pause system freeze gameplay without changing the main loop code.
  if (typeof preloadAssets === "function") {
    const originalPreloadAssets = preloadAssets;

    preloadAssets = function () {
      originalPreloadAssets();
      preloadPauseMenu();
    };
  }

  if (typeof drawPlaying === "function") {
    const originalDrawPlaying = drawPlaying;

    drawPlaying = function () {
      if (pauseMenuOpen) {
        drawPausedPlayingFrame();
        drawPauseOverlay();
        return;
      }

      originalDrawPlaying();
      drawPauseOverlay();
    };
  }

  if (typeof runPlayingSimulationStep === "function") {
    const originalRunPlayingSimulationStep = runPlayingSimulationStep;

    runPlayingSimulationStep = function () {
      if (pauseMenuOpen) return;
      return originalRunPlayingSimulationStep();
    };
  }

  if (typeof handlePlayingClick === "function") {
    const originalHandlePlayingClick = handlePlayingClick;

    handlePlayingClick = function () {
      if (mousePressedPauseMenu()) return;
      originalHandlePlayingClick();
    };
  }

  if (typeof keyPressed === "function") {
    const originalKeyPressed = keyPressed;

    keyPressed = function () {
      const shouldContinue = keyPressedPauseMenu();
      if (shouldContinue === false) return false;
      return originalKeyPressed();
    };
  }

  if (typeof loadMap === "function") {
    const originalLoadMap = loadMap;

    loadMap = function (mapNumber) {
      closePauseMenu();
      return originalLoadMap(mapNumber);
    };
  }
})();