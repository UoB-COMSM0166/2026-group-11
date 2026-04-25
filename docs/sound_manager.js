const SOUND_DEFINITIONS = {
  // Sound definitions keep paths, volume, and pool size together for each sound group.
  towerAttack: {
    tower1: {
      path: "sound/magic_tower_attack.wav",
      volume: 0.1,
      poolSize: 5,
      playbackRate: 1.0
    },
    tower2: {
      path: "sound/archer_tower_attack.wav",
      volume: 0.1,
      poolSize: 8,
      playbackRate: 1.0
    },
    tower3: {
      path: "sound/cannon_tower_attack.wav",
      volume: 0.2,
      poolSize: 4,
      playbackRate: 1.0
    },
    tower4: {
      path: "sound/ice_tower_attack.wav",
      volume: 0.1,
      poolSize: 6,
      playbackRate: 1.0
    }
  },

  ui: {
    mouseClick: {
      path: "sound/mouse_click_soft.wav",
      volume: 0.2,
      poolSize: 6,
      playbackRate: 1.0
    }
  },

  towerBuild: {
    unified: {
      path: "sound/tower_build_unified.wav",
      volume: 0.2,
      poolSize: 6,
      playbackRate: 1.0
    }
  },

  towerUpgrade: {
    unified: {
      path: "sound/tower_upgrade.wav",
      volume: 0.2,
      poolSize: 6,
      playbackRate: 1.0
    }
  },

  towerRemove: {
    unified: {
      path: "sound/tower_remove.wav",
      volume: 0.2,
      poolSize: 6,
      playbackRate: 1.0
    }
  },
  
  result: {
    victory: {
      path: "sound/level_clear_success.wav",
      volume: 0.2,
      poolSize: 3,
      playbackRate: 1.0
    },
    defeat: {
      path: "sound/level_clear_fail.wav",
      volume: 0.2,
      poolSize: 3,
      playbackRate: 1.0
    }
  },
  
  waveStart: {
    spawn: {
      path: "sound/monster_attack.wav",
      volume: 0.15,
      poolSize: 4,
      playbackRate: 1.0
    }
  },

    economy: {},
    enemy: {},
    bgm: {
      comicIntro: {
        path: "sound/comic.mp3",
        volume: 0.35,
        poolSize: 1,
        playbackRate: 1.0
      },
      homeLoop: {
       path: "sound/start.mp3",
        volume: 0.28,
        poolSize: 1,
        playbackRate: 1.0
      },

      map1Loop: {
        path: "sound/spring.mp3",
        volume: 0.26,
        poolSize: 1,
        playbackRate: 1.0
      },

       map2Loop: {
         path: "sound/summer.mp3",
         volume: 0.26,
         poolSize: 1,
         playbackRate: 1.0
      },

       map3Loop: {
         path: "sound/fall.mp3",
         volume: 0.26,
         poolSize: 1,
         playbackRate: 1.0
      },

       map4Loop: {
         path: "sound/winter.mp3",
         volume: 0.26,
         poolSize: 1,
         playbackRate: 1.0
      }
  }
};
  
let gameSoundPools = {};
let gameSoundReady = false;
let gameAudioUnlocked = false;

function initSoundPackage() {
  if (gameSoundReady) return;

  // Build audio pools once so repeated attacks do not restart the same Audio element.
  gameSoundPools = {};

  for (const category in SOUND_DEFINITIONS) {
    gameSoundPools[category] = {};

    for (const key in SOUND_DEFINITIONS[category]) {
      const def = SOUND_DEFINITIONS[category][key];
      gameSoundPools[category][key] = createAudioPool(def);
    }
  }

  gameSoundReady = true;
}

function createAudioPool(def) {
  const pool = [];
  const size = Math.max(1, def.poolSize || 1);

  // Small pools allow overlapping SFX while keeping browser audio usage predictable.
  for (let i = 0; i < size; i++) {
    const audio = new Audio(def.path);
    audio.preload = "auto";
    audio.volume = def.volume == null ? 1 : def.volume;
    audio.playbackRate = def.playbackRate || 1;
    audio.load();
    pool.push(audio);
  }

  return {
    path: def.path,
    config: {
      volume: def.volume == null ? 1 : def.volume,
      playbackRate: def.playbackRate || 1
    },
    sounds: pool,
    cursor: 0
  };
}

function isGameAudioMuted() {
  return typeof gameAudioMuted !== "undefined" && gameAudioMuted;
}

function unlockGameAudio() {
  if (!gameSoundReady || gameAudioUnlocked) return;
  gameAudioUnlocked = true;

  // Browsers often require a user gesture before audio can play reliably.
  for (const category in gameSoundPools) {
    if (category === "bgm") continue;

    for (const key in gameSoundPools[category]) {
      const pool = gameSoundPools[category][key];
      if (!pool || !pool.sounds || pool.sounds.length === 0) continue;

      const audio = pool.sounds[0];
      const oldMuted = audio.muted;
      const oldVolume = audio.volume;

      try {
        audio.muted = true;
        audio.volume = 0;

        const p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = oldMuted;
            audio.volume = oldVolume;
          }).catch((err) => {
            audio.muted = oldMuted;
            audio.volume = oldVolume;
            console.warn("[Audio unlock failed]", category, key, pool.path, err);
          });
        } else {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = oldMuted;
          audio.volume = oldVolume;
        }
      } catch (err) {
        audio.muted = oldMuted;
        audio.volume = oldVolume;
        console.warn("[Audio unlock error]", category, key, pool.path, err);
      }
    }
  }
}

function playSfx(category, key, overrides = {}) {
  if (!gameSoundReady) return;
  if (isGameAudioMuted()) return;

  // SFX playback is defensive because browser autoplay policies can reject play().
  const categoryPool = gameSoundPools[category];
  if (!categoryPool) return;

  const pool = categoryPool[key];
  if (!pool || !pool.sounds || pool.sounds.length === 0) return;

  const audio = pool.sounds[pool.cursor];
  pool.cursor = (pool.cursor + 1) % pool.sounds.length;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = overrides.volume == null ? pool.config.volume : overrides.volume;
    audio.playbackRate = overrides.playbackRate || pool.config.playbackRate;

    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        console.warn("[Audio play failed]", category, key, pool.path, err);
      });
    }
  } catch (err) {
    console.warn("[Audio play error]", category, key, pool.path, err);
  }
}

function playTowerAttackSfx(towerType) {
  playSfx("towerAttack", towerType);
}

function playUIClickSfx() {
  playSfx("ui", "mouseClick");
}

function playTowerBuildSfx() {
  playSfx("towerBuild", "unified");
}

function playTowerUpgradeSfx() {
  playSfx("towerUpgrade", "unified");
}

function playTowerRemoveSfx() {
  playSfx("towerRemove", "unified");
}

function playVictoryResultSfx() {
  playSfx("result", "victory");
}

function playDefeatResultSfx() {
  playSfx("result", "defeat");
}

function playWaveStartSfx() {
  playSfx("waveStart", "spawn");
}

function setGameSoundsMuted(muted) {
  // Muting pauses active sounds so pause-menu audio state is immediate.
  for (const category in gameSoundPools) {
    for (const key in gameSoundPools[category]) {
      const pool = gameSoundPools[category][key];
      if (!pool || !pool.sounds) continue;

      for (const audio of pool.sounds) {
        audio.muted = !!muted;
        if (muted) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {}
        }
      }
    }
  }
}

function playBgm(key) {
  if (!gameSoundReady) return;
  if (isGameAudioMuted()) return;

  // BGM uses a single pooled track per scene and loops until the scene changes.
  const bgmPool = gameSoundPools.bgm;
  if (!bgmPool) return;

  const pool = bgmPool[key];
  if (!pool || !pool.sounds || pool.sounds.length === 0) return;

  const audio = pool.sounds[0];
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = true;
    audio.muted = false;
    audio.volume = pool.config.volume;
    audio.playbackRate = pool.config.playbackRate;

    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        console.warn("[BGM play failed]", key, pool.path, err);
      });
    }
  } catch (err) {
    console.warn("[BGM play error]", key, pool.path, err);
  }
}

function stopBgm(key) {
  if (!gameSoundReady) return;

  const bgmPool = gameSoundPools.bgm;
  if (!bgmPool) return;

  const pool = bgmPool[key];
  if (!pool || !pool.sounds || pool.sounds.length === 0) return;

  const audio = pool.sounds[0];
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (err) {
    console.warn("[BGM stop error]", key, pool.path, err);
  }
}

function stopAllBgm() {
  if (!gameSoundReady || !gameSoundPools.bgm) return;

  for (const key in gameSoundPools.bgm) {
    stopBgm(key);
  }
}

function playMapBgm(mapId) {
  // Map IDs map directly to seasonal background loops.
  if (mapId === 1) {
    playBgm("map1Loop");
  } else if (mapId === 2) {
    playBgm("map2Loop");
  } else if (mapId === 3) {
    playBgm("map3Loop");
  } else if (mapId === 4) {
    playBgm("map4Loop");
  }
}