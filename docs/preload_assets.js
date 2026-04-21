// 资源预加载文件

function preloadAssets() {
  homeBg = loadImage("image/first.png");
  selectBg = loadImage("image/select.jpg");
  newGameBtnImg = loadImage("ui/new game.png");
  gameBtnImg = loadImage("ui/game.png");

  mapImages[1] = loadImage("image/map1.jpg");
  mapImages[2] = loadImage("image/map2.jpg");
  mapImages[3] = loadImage("image/map3.jpg");
  mapImages[4] = loadImage("image/map4.jpg");

  enemyGif = loadImage("image/Green_Slime.gif");
  enemyImages.green = enemyGif;
  enemyImages.red = loadImage("image/Red_Slime.gif");
  enemyImages.purple = loadImage("image/Purple_Slime.gif");
  enemyImages.black = loadImage("image/Black_Slime.gif");
  enemyImages.gold = loadImage("image/gold_Slime.gif");
  enemyImages.glow = loadImage("image/glow_Slime.gif");
  enemyImages.crystal = loadImage("image/Crystal_Slime.gif");
  enemyImages.ice_spike = loadImage("image/Spiked_Ice_Slime.gif");
  enemyImages.split_parent = loadImage("image/Mother_Slime.gif");
  enemyImages.split_child = loadImage("image/Baby_Slime.gif");
  enemyImages.dungeon = loadImage("image/Dungeon_Slime.gif");
  enemyImages.crimson = loadImage("image/Crimslime.gif");
  enemyImages.rainbow = loadImage("image/Rainbow_Slime.gif");
  enemyImages.fly = loadImage("image/Gastropod.gif");
  enemyImages.psychic_slug = loadImage("image/Spectral_Gastropod.gif");

  tower1Lv1Img = loadImage("image/tower1_lv1.png");
  tower1Lv2Img = loadImage("image/tower1_lv2.png");
  tower1Lv3Img = loadImage("image/tower1_lv3.png");

  tower2Lv1Img = loadImage("image/tower2_lv1.png");
  tower2Lv2Img = loadImage("image/tower2_lv2.png");
  tower2Lv3Img = loadImage("image/tower2_lv3.png");

  tower3Lv1Img = loadImage("image/tower3_lv1.png");
  tower3Lv2Img = loadImage("image/tower3_lv2.png");
  tower3Lv3Img = loadImage("image/tower3_lv3.png");

  tower4Lv1Img = loadImage("image/tower4_lv1.png");
  tower4Lv2Img = loadImage("image/tower4_lv2.png");
  tower4Lv3Img = loadImage("image/tower4_lv3.png");
  
  towerMenuImg = loadImage("ui/clicktower.png");
  hudPanelImg = loadImage("ui/heart.png");
  defeatImg = loadImage("ui/defeat.png");
  victoryImg = loadImage("ui/victory.png");
  startWaveImg = loadImage("ui/start.png");
  speed1Img = loadImage("ui/speed1.png");
  speed2Img = loadImage("ui/speed2.png");

  upgradeRingImgs = {
    up1: loadImage("ui/up1.png"),
    up2: loadImage("ui/up2.png"),
    up3: loadImage("ui/up3.png"),
    up4: loadImage("ui/up4.png"),
    up5: loadImage("ui/up5.png")
  };
  
  preloadComicAssets();
}