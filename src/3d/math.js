window.LastLine = window.LastLine || {};

window.LastLine.Math = {
  distance: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  clamp: (v, min, max) => Math.min(Math.max(v, min), max),

  lerp: (a, b, t) => a + (b - a) * t,

  randomRange: (min, max) => Math.random() * (max - min) + min,

  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  getAngle: (a, b) => {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    return Math.atan2(dx, dz);
  },

  getDirection: (angle) => ({
    x: Math.sin(angle),
    z: Math.cos(angle),
  }),
};
