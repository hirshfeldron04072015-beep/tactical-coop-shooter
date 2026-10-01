window.LastLine = window.LastLine || {};

window.LastLine.Particle = class extends window.LastLine.Entity {
  constructor(x, y, color, vx, vy, life, size = 3) {
    super(x, y);
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.size = size;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.life -= dt * 60;
  }

  isAlive() {
    return this.life > 0;
  }

  draw() {
    const Draw = window.LastLine.Draw;
    Draw.circle(this.x, this.y, this.size, this.color);
  }
};