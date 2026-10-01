window.LastLine = window.LastLine || {};

window.LastLine.CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  COLORS: {
    BLACK: [10, 10, 14],
    DARK: [27, 28, 35],
    DARKER: [18, 18, 26],
    MID: [54, 60, 74],
    LIGHT: [195, 203, 216],
    WHITE: [255, 255, 255],
    RED: [214, 82, 82],
    GREEN: [92, 192, 122],
    BLUE: [101, 148, 250],
    ORANGE: [255, 166, 77],
    YELLOW: [240, 210, 90],
    PURPLE: [162, 122, 255],
    CYAN: [104, 216, 255]
  },
  STARTER_LOADOUT: {
    primary: "Pulse Rifle",
    secondary: "Guardian Pistol",
    melee: "Combat Knife",
    utility: "Field Medkit"
  },
  MAPS: [
    { name: "Rift District", unlockLevel: 1, difficulty: 1 },
    { name: "Thermal Docks", unlockLevel: 2, difficulty: 2 },
    { name: "Ashline Ruins", unlockLevel: 3, difficulty: 3 },
    { name: "The Null Coast", unlockLevel: 4, difficulty: 4 },
    { name: "Hollow Breach", unlockLevel: 5, difficulty: 5 },
    { name: "Void Station", unlockLevel: 8, difficulty: 6 }
  ],
  MISSIONS: [
    { title: "Sweep the Gate", type: "kills", target: 12, rewardKeys: 3, rewardXp: 90 },
    { title: "Escort the Relic", type: "time", target: 35, rewardKeys: 5, rewardXp: 130 },
    { title: "Hunt the Warden", type: "boss", target: 1, rewardKeys: 7, rewardXp: 180 },
    { title: "Signal Recovery", type: "kills", target: 18, rewardKeys: 5, rewardXp: 140 },
    { title: "Last Stand", type: "survive", target: 50, rewardKeys: 8, rewardXp: 200 },
    { title: "Void Walker", type: "kills", target: 25, rewardKeys: 10, rewardXp: 250 },
    { title: "The Final Push", type: "survive", target: 90, rewardKeys: 15, rewardXp: 400 }
  ]
};

window.LastLine.WEAPONS = {
  primary: {
    "Pulse Rifle": { slot: "primary", damage: 14, firerate: 0.12, speed: 12, spread: 0.08, color: [101, 148, 250], unlockKey: 0, desc: "Standard rifle." },
    "Shard Carbine": { slot: "primary", damage: 18, firerate: 0.15, speed: 11, spread: 0.10, color: [162, 122, 255], unlockKey: 15, desc: "Higher damage." },
    "Plasma SMG": { slot: "primary", damage: 12, firerate: 0.07, speed: 13, spread: 0.12, color: [255, 166, 77], unlockKey: 30, desc: "Rapid fire." },
    "Scatter Shot": { slot: "primary", damage: 10, firerate: 0.45, speed: 10, spread: 0.4, color: [240, 210, 90], unlockKey: 45, desc: "Wide spread." },
    "Rail Gun": { slot: "primary", damage: 28, firerate: 0.30, speed: 16, spread: 0.02, color: [104, 216, 255], unlockKey: 60, desc: "Sniper rifle." }
  },
  secondary: {
    "Guardian Pistol": { slot: "secondary", damage: 20, firerate: 0.25, speed: 14, spread: 0.04, color: [101, 148, 250], unlockKey: 0, desc: "Sidearm." },
    "Volt Revolver": { slot: "secondary", damage: 26, firerate: 0.32, speed: 13, spread: 0.06, color: [240, 210, 90], unlockKey: 18, desc: "Heavy revolver." },
    "Arc Launcher": { slot: "secondary", damage: 34, firerate: 0.6, speed: 11, spread: 0.08, color: [255, 166, 77], unlockKey: 35, desc: "Explosive." },
    "Plasma Pistol": { slot: "secondary", damage: 22, firerate: 0.20, speed: 15, spread: 0.05, color: [200, 100, 255], unlockKey: 50, desc: "Energy weapon." }
  },
  melee: {
    "Combat Knife": { slot: "melee", damage: 32, firerate: 0.52, speed: 0, spread: 0, color: [255, 255, 255], unlockKey: 0, desc: "Quick blade." },
    "Shock Saber": { slot: "melee", damage: 44, firerate: 0.42, speed: 0, spread: 0, color: [162, 122, 255], unlockKey: 20, desc: "Electrified." },
    "Breaker Axe": { slot: "melee", damage: 58, firerate: 0.7, speed: 0, spread: 0, color: [214, 82, 82], unlockKey: 40, desc: "Heavy damage." },
    "Plasma Cutter": { slot: "melee", damage: 50, firerate: 0.45, speed: 0, spread: 0, color: [255, 100, 200], unlockKey: 70, desc: "Energy blade." }
  },
  utility: {
    "Field Medkit": { slot: "utility", damage: 0, firerate: 0.0, speed: 0, spread: 0, color: [92, 192, 122], unlockKey: 0, desc: "Heal 28 HP." },
    "Smoke Bomb": { slot: "utility", damage: 0, firerate: 0.0, speed: 0, spread: 0, color: [54, 60, 74], unlockKey: 14, desc: "Visual cover." },
    "Shock Mine": { slot: "utility", damage: 20, firerate: 0.0, speed: 0, spread: 0, color: [101, 148, 250], unlockKey: 26, desc: "Area damage." },
    "Dash Core": { slot: "utility", damage: 0, firerate: 0.0, speed: 0, spread: 0, color: [255, 166, 77], unlockKey: 38, desc: "Quick dash." },
    "Force Shield": { slot: "utility", damage: 0, firerate: 0.0, speed: 0, spread: 0, color: [104, 150, 255], unlockKey: 55, desc: "Temporary shield." }
  }
};