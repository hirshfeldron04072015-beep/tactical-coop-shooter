window.LastLine = window.LastLine || {};

window.LastLine.Projectile = class extends window.LastLine.Entity {
  constructor(x, y, angle, damage, speed, color, radius = 5, life = 90) {
    super(x, y);
    this.angle = angle;
    this.damage = damage;
    this.speed = speed;
    this.color = color;
    this.radius = radius;
    this.life = life;
  }

  update(dt) {
    this.x += Math.cos(this.angle) * this.speed * dt * 60;
    this.y += Math.sin(this.angle) * this.speed * dt * 60;
    this.life -= dt * 60;
  }

  isAlive() {
    const C = window.LastLine.CONFIG;
    return this.life > 0 && this.x > -50 && this.x < C.WIDTH + 50 && this.y > -50 && this.y < C.HEIGHT + 50;
  }

  draw() {
    const Draw = window.LastLine.Draw;
    Draw.circle(this.x, this.y, this.radius, this.color);
  }
};