window.LastLine = window.LastLine || {};

window.LastLine.Pickup = class extends window.LastLine.Entity {
  constructor(x, y, kind) {
    super(x, y);
    this.kind = kind;
    this.radius = 10;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt) {
    this.phase += dt * 3;
  }

  draw() {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    let color = C.COLORS.BLUE;
    if (this.kind === "xp") color = C.COLORS.GREEN;
    if (this.kind === "key") color = C.COLORS.YELLOW;
    const bob = Math.sin(this.phase) * 4;
    Draw.circle(this.x, this.y + bob, this.radius, color);
  }
};