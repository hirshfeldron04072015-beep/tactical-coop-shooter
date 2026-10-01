window.LastLine = window.LastLine || {};
window.LastLine.Math = {
  clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(this.rand(min, max + 1)); },
  dist3D(a, b) { return a.distanceTo(b); },
  lerp(a, b, t) { return a + (b - a) * t; }
};