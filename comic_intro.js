let comicImgs = [];
let comicArrowImg = null;
let currentComicPageIndex = 0;
let currentComicStep = 0;

let topFadeAlpha = 0;
let bottomFadeAlpha = 0;
let comicFadeSpeed = 12;

function preloadComicAssets() {
  comicImgs = [
    loadImage("comic/comic1.png"),
    loadImage("comic/comic2.png"),
    loadImage("comic/comic3.png"),
    loadImage("comic/comic4.png"),
    loadImage("comic/comic5.png"),
    loadImage("comic/comic6.png")
  ];

  comicArrowImg = loadImage("comic/tobecontinue.png");
}

function resetIntroComic() {
  currentComicPageIndex = 0;
  currentComicStep = 0;
  topFadeAlpha = 0;
  bottomFadeAlpha = 0;
}

function startIntroComic() {
  resetIntroComic();
  gameState = "comic";
}

function startNewGameFlow() {
  startIntroComic();
}

function drawComicIntro() {
  background(0);

  // 当前页第一张渐显
  if (topFadeAlpha < 255) {
    topFadeAlpha += comicFadeSpeed;
    if (topFadeAlpha > 255) topFadeAlpha = 255;
  }

  // 当前页第二张只有出现后才渐显
  if (currentComicStep >= 1 && bottomFadeAlpha < 255) {
    bottomFadeAlpha += comicFadeSpeed;
    if (bottomFadeAlpha > 255) bottomFadeAlpha = 255;
  }

  let topImg = comicImgs[currentComicPageIndex * 2];
  let bottomImg = comicImgs[currentComicPageIndex * 2 + 1];

  // 上面那张
  if (topImg) {
    let w1 = 1450;
    let h1 = w1 * (topImg.height / topImg.width);
    let x1 = 90;
    let y1 = 70;

    tint(255, topFadeAlpha);
    image(topImg, x1, y1, w1, h1);
    noTint();
  }

  // 下面那张：这一页点过一次后才显示，并且只让它自己渐显
  if (currentComicStep >= 1 && bottomImg) {
    let w2 = 1220;
    let h2 = w2 * (bottomImg.height / bottomImg.width);
    let x2 = 820;
    let y2 = 720;

    tint(255, bottomFadeAlpha);
    image(bottomImg, x2, y2, w2, h2);
    noTint();
  }

  // continue 箭头：一直显示
  if (comicArrowImg) {
    let gx = toGameX(mouseX);
    let gy = toGameY(mouseY);

    let arrowW = 420;
    let arrowH = arrowW * (comicArrowImg.height / comicArrowImg.width);
    let arrowX = 70;
    let arrowY = DESIGN_H - arrowH - 55;

    let hovering = isInsideRect(gx, gy, arrowX, arrowY, arrowW, arrowH);

    let pulse = 1 + sin(frameCount * 0.08) * 0.04;
    let scaleValue = hovering ? pulse * 1.05 : pulse;

    let finalW = arrowW * scaleValue;
    let finalH = arrowH * scaleValue;
    let finalX = arrowX - (finalW - arrowW) / 2;
    let finalY = arrowY - (finalH - arrowH) / 2;

    image(comicArrowImg, finalX, finalY, finalW, finalH);
  }
}

function handleComicIntroClick() {
  // 先让当前页第二张出现，并从 0 开始渐显
  if (currentComicStep === 0) {
    currentComicStep = 1;
    bottomFadeAlpha = 0;
    return;
  }

  // 进入下一页，第一页重新渐显，第二张重置
  if (currentComicPageIndex < 2) {
    currentComicPageIndex++;
    currentComicStep = 0;
    topFadeAlpha = 0;
    bottomFadeAlpha = 0;
    return;
  }

  // 最后一页结束
  gameState = "levelSelect";
}