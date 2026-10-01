window.LastLine = window.LastLine || {};

window.LastLine.MathUtils = {
  clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  },
  rand(min, max) {
    return Math.random() * (max - min) + min;
  },
  randInt(min, max) {
    return Math.floor(this.rand(min, max + 1));
  },
  dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  },
  distXY(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  },
  getLevelThreshold(level) {
    return 120 + (level - 1) * 80;
  },
  getUnlockedWeapons(player) {
    const result = {};
    const WEAPONS = window.LastLine.WEAPONS;
    for (const slot in WEAPONS) {
      result[slot] = [];
      for (const name in WEAPONS[slot]) {
        const data = WEAPONS[slot][name];
        if (data.unlockKey <= player.keys || Object.values(window.LastLine.CONFIG.STARTER_LOADOUT).includes(name)) {
          result[slot].push(name);
        }
      }
    }
    return result;
  }
};