const GUIDE_STORAGE_KEY = "td_map1_guide_seen_v1";
const GUIDE_ONLY_ONCE = false;
const GUIDE_SLOT_INDEX = 2;

const TOWER_HOVER_GUIDE = {
  magic: {
    title: "Mage",
    text: "High damage over time, excels vs strong enemies."
  },
  cannon: {
    title: "Archer",
    text: "Fast attacks, reliable single-target damage."
  },
  bomb: {
    title: "Bomb",
    text: "Deals area damage, effective against groups."
  },
  ice: {
    title: "Iced",
    text: "Slows enemies, enhances overall defense."
  }
};

let tutorialGuide = {
  active: false,
  mapId: null,
  phase: 0,
  phaseStartFrame: 0
};

let hoverTowerGuide = null;

function resetGuideOverlayForMap(mapId) {
  // Tutorial runs only on the first map so later levels can focus on combat flow.
  tutorialGuide.mapId = mapId;
  tutorialGuide.phase = 0;
  tutorialGuide.phaseStartFrame = frameCount || 0;

  if (mapId !== 1) {
    tutorialGuide.active = false;
    return;
  }

  if (GUIDE_ONLY_ONCE && localStorage.getItem(GUIDE_STORAGE_KEY) === "1") {
    tutorialGuide.active = false;
    return;
  }

  tutorialGuide.active = true;
}

function finishGuideOverlay() {
  tutorialGuide.active = false;

  if (tutorialGuide.mapId === 1 && GUIDE_ONLY_ONCE) {
    localStorage.setItem(GUIDE_STORAGE_KEY, "1");
  }
}

function isGuideSlotSelected() {
  return menuSlotIndex === GUIDE_SLOT_INDEX;
}

function updateGuideOverlay() {
  if (!tutorialGuide.active) return;
  if (gameState !== "playing") return;
  if (typeof resultOverlay !== "undefined" && resultOverlay && resultOverlay.active) return;

  // Tutorial phases follow player progress: build, start wave, then fade out.
  if (tutorialGuide.phase === 0) {
    if (typeof towers !== "undefined" && towers && towers.length > 0) {
      tutorialGuide.phase = 1;
      tutorialGuide.phaseStartFrame = frameCount;
    }
    return;
  }

  if (tutorialGuide.phase === 1) {
    if (typeof waveHasStarted !== "undefined" && waveHasStarted) {
      tutorialGuide.phase = 2;
      tutorialGuide.phaseStartFrame = frameCount;
      return;
    }

    if (typeof currentWaveStarted !== "undefined" && currentWaveStarted) {
      tutorialGuide.phase = 2;
      tutorialGuide.phaseStartFrame = frameCount;
      return;
    }
  }

  if (tutorialGuide.phase === 2) {
    if (frameCount - tutorialGuide.phaseStartFrame > 180) {
      finishGuideOverlay();
    }
  }
}

function drawGuideOverlay() {
  updateGuideOverlay();

  if (!tutorialGuide.active) return;
  if (gameState !== "playing") return;

  // The overlay highlights goals without blocking the core game systems.
  push();

  noStroke();
  fill(0, 0, 0, 18);
  rect(0, 0, DESIGN_W, DESIGN_H);

  const endPos = getGuideEndPos();
  const buildSlot = getGuideBuildSlot();
  const startPoint = getGuideStartPoint();
  const goldFocus = { x: 330, y: 120 };

  if (tutorialGuide.phase === 0) {
    drawGuideFocus(endPos.x, endPos.y, 105);
    drawGuideFocus(buildSlot.x, buildSlot.y, 90);

    drawGuideBubble({
      x: 350,
      y: 990,
      w: 850,
      h: 110,
      text: "Don't let the enemy pass this point.",
      tipSide: "left"
    });

    if (!menuOpen || !isGuideSlotSelected()) {
      drawGuideBubble({
        x: buildSlot.x - 120,
        y: buildSlot.y - 165,
        w: 320,
        h: 95,
        text: "Build here!",
        tipSide: "bottom"
      });
    }
  }

  if (tutorialGuide.phase === 1) {
    drawGuideFocus(startPoint.x, startPoint.y, 110);
    drawGuideFocus(goldFocus.x, goldFocus.y, 78);

    drawGuideBubble({
      x: startPoint.x - 700,
      y: startPoint.y - 120,
      w: 600,
      h: 200,
      title: "Start the battle!",
      text: "Click to summon enemy troops.",
      tipSide: "right"
    });

    drawGuideBubble({
      x: 120,
      y: 300,
      w: 430,
      h: 150,
      text: "Kill enemies to earn gold coins.",
      tipSide: "top"
    });
  }

  updateHoverTowerGuide();

  if (hoverTowerGuide) {
    drawGuideBubble({
      x: hoverTowerGuide.x,
      y: hoverTowerGuide.y,
      w: hoverTowerGuide.w,
      h: hoverTowerGuide.h,
      title: hoverTowerGuide.title,
      text: hoverTowerGuide.text,
      tipSide: hoverTowerGuide.tipSide
    });
  }

  pop();
}

function getGuideEndPos() {
  if (currentMapData && currentMapData.endMarkerPos) {
    return currentMapData.endMarkerPos;
  }
  return { x: 283, y: 950 };
}

function getGuideBuildSlot() {
  if (
    currentMapData &&
    currentMapData.baseTowerSlots &&
    currentMapData.baseTowerSlots.length > GUIDE_SLOT_INDEX
  ) {
    return currentMapData.baseTowerSlots[GUIDE_SLOT_INDEX];
  }
  return { x: 660, y: 770 };
}

function getGuideStartPoint() {
  if (typeof getWaveStartPoints === "function") {
    const pts = getWaveStartPoints();
    if (pts && pts.length > 0) return pts[0];
  }
  return { x: 2260, y: 600 };
}

function updateHoverTowerGuide() {
  hoverTowerGuide = null;

  // Hover tips explain tower roles only while the tutorial build slot menu is open.
  if (gameState !== "playing") return;
  if (!menuOpen) return;
  if (menuSlotIndex < 0) return;
  if (!isGuideSlotSelected()) return;

  const buttons = getTowerMenuButtonsForGuide();
  if (!buttons) return;

  if (isMouseInCircle(buttons.topLeft.x, buttons.topLeft.y, buttons.hitR)) {
    hoverTowerGuide = {
      ...TOWER_HOVER_GUIDE.cannon,
      x: buttons.topLeft.x - 500,
      y: buttons.topLeft.y - 170,
      w: 420,
      h: 200,
      tipSide: "right"
    };
    return;
  }

  if (isMouseInCircle(buttons.topRight.x, buttons.topRight.y, buttons.hitR)) {
    hoverTowerGuide = {
      ...TOWER_HOVER_GUIDE.magic,
      x: buttons.topRight.x + 90,
      y: buttons.topRight.y - 170,
      w: 460,
      h: 220,
      tipSide: "left"
    };
    return;
  }

  if (isMouseInCircle(buttons.bottomLeft.x, buttons.bottomLeft.y, buttons.hitR)) {
    hoverTowerGuide = {
      ...TOWER_HOVER_GUIDE.bomb,
      x: buttons.bottomLeft.x - 500,
      y: buttons.bottomLeft.y - 100,
      w: 430,
      h: 200,
      tipSide: "right"
    };
    return;
  }

  if (isMouseInCircle(buttons.bottomRight.x, buttons.bottomRight.y, buttons.hitR)) {
    hoverTowerGuide = {
      ...TOWER_HOVER_GUIDE.ice,
      x: buttons.bottomRight.x + 90,
      y: buttons.bottomRight.y - 100,
      w: 440,
      h: 220,
      tipSide: "left"
    };
  }
}

function getTowerMenuButtonsForGuide() {
  if (!menuOpen || menuSlotIndex < 0) return null;

  let w = 420 * uiScale * menuScale;
  let h = 630 * uiScale * menuScale;

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
    },
    hitR: 90 * uiScale * menuScale
  };
}

function isMouseInCircle(cx, cy, r) {
  const gx = toGameX(mouseX);
  const gy = toGameY(mouseY);
  return dist(gx, gy, cx, cy) <= r;
}

function drawGuideFocus(x, y, r) {
  const pulse = 1 + sin(frameCount * 0.08) * 0.06;

  push();
  noFill();

  stroke(70, 170, 255, 220);
  strokeWeight(6);
  ellipse(x, y, r * 2 * pulse, r * 2 * pulse);

  stroke(255, 255, 255, 170);
  strokeWeight(3);
  ellipse(x, y, r * 1.55 * pulse, r * 1.55 * pulse);

  pop();
}

function drawGuideBubble(cfg) {
  // Bubbles share one drawing helper so tutorial text has consistent shape and spacing.
  const x = cfg.x;
  const y = cfg.y;
  const w = cfg.w;
  const h = cfg.h;
  const r = cfg.radius || 18;

  const title = cfg.title || "";
  const textValue = cfg.text || "";
  const tipSide = cfg.tipSide || "bottom";

  push();

  drawingContext.shadowBlur = 14;
  drawingContext.shadowColor = "rgba(0,0,0,0.16)";
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 4;

  fill(248, 244, 230);
  stroke(160, 145, 105);
  strokeWeight(4);
  drawConnectedBubbleShape(x, y, w, h, r, tipSide);

  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;

  noFill();
  stroke(255, 250, 235, 180);
  strokeWeight(2);
  drawConnectedBubbleInset(x + 5, y + 5, w - 10, h - 10, max(8, r - 5), tipSide);

  noStroke();
  textAlign(LEFT, TOP);
  textFont("Verdana");

  if (title) {
    fill(180, 50, 35);
    textSize(50);
    textStyle(BOLD);
    text(title, x + 18, y + 14, w - 36, 60);

    fill(45, 45, 45);
    textSize(38);
    textStyle(NORMAL);
    textLeading(42);
    text(textValue, x + 18, y + 78, w - 36, h - 96);
  } else {
    fill(35, 35, 35);
    textSize(38);
    textStyle(BOLD);
    textLeading(42);
    text(textValue, x + 18, y + 22, w - 36, h - 44);
  }

  pop();
}

function drawConnectedBubbleShape(x, y, w, h, r, tipSide) {
  beginShape();

  if (tipSide === "bottom") {
    const base1 = x + w * 0.42;
    const tipX = x + w * 0.50;
    const base2 = x + w * 0.58;
    const tipY = y + h + 42;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(base2, y + h);
    vertex(tipX, tipY);
    vertex(base1, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "top") {
    const base1 = x + w * 0.34;
    const tipX = x + w * 0.42;
    const base2 = x + w * 0.50;
    const tipY = y - 42;

    vertex(x + r, y);
    vertex(base1, y);
    vertex(tipX, tipY);
    vertex(base2, y);

    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "left") {
    const base1 = y + h * 0.50;
    const tipY = y + h * 0.66;
    const base2 = y + h * 0.80;
    const tipX = x - 42;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, base2);
    vertex(tipX, tipY);
    vertex(x, base1);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "right") {
    const base1 = y + h * 0.50;
    const tipY = y + h * 0.66;
    const base2 = y + h * 0.80;
    const tipX = x + w + 42;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, base1);
    vertex(tipX, tipY);
    vertex(x + w, base2);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  }

  endShape(CLOSE);
}

function drawConnectedBubbleInset(x, y, w, h, r, tipSide) {
  beginShape();

  if (tipSide === "bottom") {
    const base1 = x + w * 0.42;
    const tipX = x + w * 0.50;
    const base2 = x + w * 0.58;
    const tipY = y + h + 28;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(base2, y + h);
    vertex(tipX, tipY);
    vertex(base1, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "top") {
    const base1 = x + w * 0.34;
    const tipX = x + w * 0.42;
    const base2 = x + w * 0.50;
    const tipY = y - 28;

    vertex(x + r, y);
    vertex(base1, y);
    vertex(tipX, tipY);
    vertex(base2, y);

    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "left") {
    const base1 = y + h * 0.50;
    const tipY = y + h * 0.66;
    const base2 = y + h * 0.80;
    const tipX = x - 28;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, base2);
    vertex(tipX, tipY);
    vertex(x, base1);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  } else if (tipSide === "right") {
    const base1 = y + h * 0.50;
    const tipY = y + h * 0.66;
    const base2 = y + h * 0.80;
    const tipX = x + w + 28;

    vertex(x + r, y);
    vertex(x + w - r, y);
    quadraticVertex(x + w, y, x + w, y + r);

    vertex(x + w, base1);
    vertex(tipX, tipY);
    vertex(x + w, base2);

    vertex(x + w, y + h - r);
    quadraticVertex(x + w, y + h, x + w - r, y + h);

    vertex(x + r, y + h);
    quadraticVertex(x, y + h, x, y + h - r);

    vertex(x, y + r);
    quadraticVertex(x, y, x + r, y);
  }

  endShape(CLOSE);
}

function resetGuideTutorial() {
  // Manual reset is useful for classroom demos and repeated playtests.
  localStorage.removeItem(GUIDE_STORAGE_KEY);
  resetGuideOverlayForMap(currentMap || 1);
}
