window.LastLine = window.LastLine || {};

window.LastLine.Entity = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update(dt) {}
  draw() {}
  getAABB() {
    return { x: this.x, y: this.y, w: 1, h: 1 };
  }
};