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

  tower1Img = loadImage("image/tower1.png");
  tower2Img = loadImage("image/tower2.png");
  tower3Img = loadImage("image/tower3.png");
  tower4Img = loadImage("image/tower4.png");
  towerMenuImg = loadImage("ui/clicktower.png");
}