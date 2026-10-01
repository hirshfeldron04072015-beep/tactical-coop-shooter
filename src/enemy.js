window.LastLine = window.LastLine || {};

window.LastLine.Enemy = class extends window.LastLine.Entity {
  constructor(x, y, radius, speed, hp, color, wave) {
    super(x, y);
    this.radius = radius;
    this.speed = speed;
    this.hp = hp;
    this.maxHp = hp;
    this.color = color;
    this.hitFlash = 0;
    this.wave = wave;
  }

  update(target, dt) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    this.x += (dx / d) * this.speed * dt * 60;
    this.y += (dy / d) * this.speed * dt * 60;
    this.hitFlash = Math.max(0, this.hitFlash - dt * 60);
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 12;
  }

  isAlive() {
    return this.hp > 0;
  }

  draw() {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    let color = this.color;
    if (this.hitFlash > 0) color = C.COLORS.WHITE;
    Draw.circle(this.x, this.y, this.radius, color);
    const bw = this.radius * 2, bh = 5;
    Draw.rect(this.x - this.radius, this.y - this.radius - 12, bw, bh, C.COLORS.BLACK);
    Draw.rect(this.x - this.radius, this.y - this.radius - 12, bw * window.LastLine.MathUtils.clamp(this.hp / this.maxHp, 0, 1), bh, C.COLORS.RED);
  }
};