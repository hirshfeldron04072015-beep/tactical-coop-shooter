window.LastLine = window.LastLine || {};
window.LastLine.CONFIG = {
  WORLD_SIZE: 500,
  COLORS: {
    PRIMARY: 0x00ff00,
    SECONDARY: 0xff6600,
    ACCENT: 0x0099ff,
    ENEMY: 0xff3333,
    GROUND: 0x1a1a1a,
    SKY: 0x0a0a0f,
    NEON_GREEN: 0x0fc864,
    NEON_ORANGE: 0xff9900,
    NEON_CYAN: 0x00ccff,
    NEON_MAGENTA: 0xff00ff,
    NEON_YELLOW: 0xffcc00
  },
  GAME_SPEED: 1.0,
  DIFFICULTY: 1.0,
  MISSIONS: [
    { title: "Eliminate 10 Enemies", type: "kills", target: 10, reward: 100 },
    { title: "Survive 60 Seconds", type: "time", target: 60, reward: 150 },
    { title: "Deal 500 Damage", type: "damage", target: 500, reward: 200 }
  ]
};