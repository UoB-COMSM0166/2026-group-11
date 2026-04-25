const maps = {
  // Map definitions provide background size, enemy routes, end marker, and build slots.
  1: {
    designW: 2560,
    designH: 1600,
    bg: "image/map1.jpg",
    endMarkerPos: { x: 283, y: 950 },
    basePathPoints: [
      { x: 2258, y: 563 },
      { x: 2258, y: 950 },
      { x: 283, y: 950 }
    ],
    
    baseTowerSlots: [
      { x: 2090, y: 770 },
      { x: 660, y: 770 },
      { x: 1080, y: 770 },
      { x: 870, y: 1130 },
      { x: 1510, y: 1130 },
      { x: 1900, y: 1130 }
    ]
  },

  2: {
    designW: 2560,
    designH: 1600,
    bg: "image/map2.jpg",
    endMarkerPos: { x: 120, y: 928 },
    baseTowerSlots: [
      { x: 763,  y: 360 },
      { x: 1139, y: 506 },
      { x: 1753, y: 506 },

      { x: 283,  y: 748 },
      { x: 1139, y: 748 },
      { x: 1645, y: 748 },

      { x: 469,  y: 1056 },
      { x: 951,  y: 1056 },
      { x: 1460, y: 1056 },

      { x: 1835, y: 1221 },
      { x: 1460, y: 1360 }
    ],
    // Multi-lane maps use enemyPaths so waves can distribute enemies across entrances.
    enemyPaths: [
      [
        { x: 2208, y: -38 },
        { x: 2208, y: 359 },
        { x: 948,  y: 359 },
        { x: 948,  y: 928 },
        { x: -38,  y: 928 }
      ],
      [
        { x: 1646, y: 1638 },
        { x: 1646, y: 928 },
        { x: -38,  y: 928 }
      ]
    ]
  },

  3: {
    designW: 2560,
    designH: 1600,
    bg: "image/map3.jpg",
    endMarkerPos: { x: 1490, y: 1480 },
    baseTowerSlots: [
      { x: 501,  y: 450 },
      { x: 884,  y: 450 },
      { x: 1295, y: 450 },
      { x: 1685, y: 450 },

      { x: 303,  y: 645 },

      { x: 804,  y: 830 },
      { x: 1290, y: 830 },
      { x: 1743, y: 830 },

      { x: 795,  y: 1060 },
      { x: 1524, y: 1060 },

      { x: 570,  y: 1380 },
      { x: 1240, y: 1380 },
      { x: 1700, y: 1380 }
    ],
    // Each path shares the same endpoint so life loss stays consistent across lanes.
    enemyPaths: [
      [
        { x: 48,   y: 180 },
        { x: 1070, y: 180 },
        { x: 1070, y: 644 },
        { x: 519,  y: 644 },
        { x: 519,  y: 1295 },
        { x: 1508, y: 1295 },
        { x: 1508, y: 1564 },
        { x: 1490, y: 1564 }
      ],
      [
        { x: 1893, y: 43 },
        { x: 1893, y: 644 },
        { x: 519,  y: 644 },
        { x: 519,  y: 1295 },
        { x: 1508, y: 1295 },
        { x: 1508, y: 1564 },
        { x: 1490, y: 1564 }
      ],
      [
        { x: 2535, y: 646 },
        { x: 519,  y: 646 },
        { x: 519,  y: 1295 },
        { x: 1508, y: 1295 },
        { x: 1508, y: 1564 },
        { x: 1490, y: 1564 }
      ]
    ]
  },

  4: {
    designW: 2560,
    designH: 1600,
    bg: "image/map4.jpg",
    endMarkerPos: { x: 120, y: 673 },
    // The Boss level keeps tower slots close to the route to emphasize tower control.
    baseTowerSlots: [
      { x: 1370,  y: 885 },
      { x: 900,  y: 660 },
      { x: 1840,  y: 660 },
      
      { x: 370,  y: 227 },
      { x: 926,  y: 322 },
      { x: 1779, y: 322 },
      { x: 2357, y: 390 },

      { x: 382,  y: 460 },
      { x: 372,  y: 825 },      

      { x: 922,  y: 1000 },
      { x: 1784, y: 1000 },

      { x: 377,  y: 1155 },

      { x: 605,  y: 1345 },
      { x: 1275, y: 1345 },
      { x: 1888, y: 1350 }
    ],
    // These routes drive regular enemies; the King Boss replaces them with bossShowcasePath.
enemyPaths: [
      [
        { x: 2517, y: 244 },
        { x: 2517, y: 213 },
        { x: 591,  y: 213 },
        { x: 591,  y: 673 },
        { x: 34,   y: 673 }
      ],
      [
        { x: 2517, y: 244 },
        { x: 2517, y: 272 },
        { x: 2177, y: 272 },
        { x: 2177, y: 1184 },
        { x: 641,  y: 1184 },
        { x: 641,  y: 712 },
        { x: 34,   y: 712 },
        { x: 34,   y: 673 }
      ],
      [
        { x: 2137, y: 1572 },
        { x: 2098, y: 1572 },
        { x: 2098, y: 293 },
        { x: 643,  y: 293 },
        { x: 643,  y: 626 },
        { x: 34,   y: 626 },
        { x: 34,   y: 673 }
      ],
      [
        { x: 2137, y: 1572 },
        { x: 2158, y: 1572 },
        { x: 2158, y: 1286 },
        { x: 568,  y: 1286 },
        { x: 568,  y: 749 },
        { x: 34,   y: 749 },
        { x: 34,   y: 673 }
      ]
    ]
  }
};