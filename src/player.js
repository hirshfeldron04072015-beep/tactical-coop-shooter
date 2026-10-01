window.LastLine = window.LastLine || {};

window.LastLine.Player = class extends window.LastLine.Entity {
  constructor(x, y, name = "Rook") {
    super(x, y);
    this.name = name;
    this.radius = 18;
    this.speed = 4.2;
    this.angle = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.level = 1;
    this.xp = 0;
    this.keys = 0;
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.inventory = { ...window.LastLine.CONFIG.STARTER_LOADOUT };
    this.fireCooldown = 0;
    this.meleeCooldown = 0;
    this.utilityCooldown = 0;
    this.hitFlash = 0;
    this.shieldActive = false;
    this.shieldHealth = 0;
    this.shieldMaxHealth = 30;
  }

  move(dx, dy, dt) {
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }
    this.x += dx * this.speed * dt * 60;
    this.y += dy * this.speed * dt * 60;
    const C = window.LastLine.CONFIG;
    const M = window.LastLine.MathUtils;
    this.x = M.clamp(this.x, this.radius, C.WIDTH - this.radius);
    this.y = M.clamp(this.y, this.radius, C.HEIGHT - this.radius);
  }

  setAngleFromTarget(tx, ty) {
    this.angle = Math.atan2(ty - this.y, tx - this.x);
  }

  shoot(bullets) {
    if (this.fireCooldown > 0) return;
    const weapon = window.LastLine.WEAPONS.primary[this.inventory.primary];
    const M = window.LastLine.MathUtils;
    const spread = M.rand(-weapon.spread, weapon.spread);
    const ang = this.angle + spread;
    const x = this.x + Math.cos(ang) * (this.radius + 10);
    const y = this.y + Math.sin(ang) * (this.radius + 10);
    bullets.push(new window.LastLine.Projectile(x, y, ang, weapon.damage, weapon.speed, weapon.color));
    this.fireCooldown = weapon.firerate * 60;
  }

  shootSecondary(bullets) {
    if (this.fireCooldown > 0) return;
    const weapon = window.LastLine.WEAPONS.secondary[this.inventory.secondary];
    const M = window.LastLine.MathUtils;
    const spread = M.rand(-weapon.spread, weapon.spread);
    const ang = this.angle + spread;
    const x = this.x + Math.cos(ang) * (this.radius + 12);
    const y = this.y + Math.sin(ang) * (this.radius + 12);
    bullets.push(new window.LastLine.Projectile(x, y, ang, weapon.damage, weapon.speed, weapon.color, 6));
    this.fireCooldown = weapon.firerate * 60;
  }

  meleeAttack(enemies) {
    if (this.meleeCooldown > 0) return;
    const weapon = window.LastLine.WEAPONS.melee[this.inventory.melee];
    const damage = weapon.damage;
    const M = window.LastLine.MathUtils;
    for (const enemy of enemies) {
      if (M.dist(this, enemy) < this.radius + enemy.radius + 28) {
        enemy.takeDamage(damage);
        this.totalDamageDealt += damage;
        this.meleeCooldown = weapon.firerate * 60;
        return;
      }
    }
  }

  useUtility(particles, enemies) {
    if (this.utilityCooldown > 0) return;
    const M = window.LastLine.MathUtils;
    const C = window.LastLine.CONFIG;
    const kind = this.inventory.utility;
    
    if (kind === "Field Medkit") {
      this.health = Math.min(this.maxHealth, this.health + 28);
    } else if (kind === "Smoke Bomb") {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = M.rand(1, 3);
        particles.push(new window.LastLine.Particle(this.x, this.y, C.COLORS.MID, Math.cos(angle) * speed, Math.sin(angle) * speed, 40, 4));
      }
    } else if (kind === "Shock Mine") {
      for (const enemy of enemies) {
        if (M.dist(this, enemy) < 170) {
          enemy.takeDamage(18);
          this.totalDamageDealt += 18;
        }
      }
    } else if (kind === "Dash Core") {
      this.x += Math.cos(this.angle) * 55;
      this.y += Math.sin(this.angle) * 55;
      this.x = M.clamp(this.x, this.radius, C.WIDTH - this.radius);
      this.y = M.clamp(this.y, this.radius, C.HEIGHT - this.radius);
    } else if (kind === "Force Shield") {
      this.shieldActive = true;
      this.shieldHealth = this.shieldMaxHealth;
    }
    this.utilityCooldown = 220;
  }

  addXP(amount) {
    const M = window.LastLine.MathUtils;
    this.xp += amount;
    while (this.xp >= M.getLevelThreshold(this.level)) {
      this.xp -= M.getLevelThreshold(this.level);
      this.level += 1;
      this.maxHealth += 10;
      this.health = this.maxHealth;
      this.keys += 2;
    }
  }

  takeDamage(amount) {
    if (this.shieldActive && this.shieldHealth > 0) {
      const absorbed = Math.min(amount, this.shieldHealth);
      this.shieldHealth -= absorbed;
      amount -= absorbed;
    }
    this.health -= amount;
    this.hitFlash = 15;
  }

  update(dt) {
    this.fireCooldown = Math.max(0, this.fireCooldown - dt * 60);
    this.meleeCooldown = Math.max(0, this.meleeCooldown - dt * 60);
    this.utilityCooldown = Math.max(0, this.utilityCooldown - dt * 60);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 60);
    if (this.shieldActive && this.shieldHealth <= 0) {
      this.shieldActive = false;
    }
  }

  draw() {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    if (this.shieldActive && this.shieldHealth > 0) {
      const ctx = window.LastLine.ctx;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = Draw.rgba(C.COLORS.BLUE, 0.5);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    const color = this.hitFlash > 0 ? C.COLORS.WHITE : C.COLORS.BLUE;
    Draw.circle(this.x, this.y, this.radius, color);
    const gunX = this.x + Math.cos(this.angle) * (this.radius + 18);
    const gunY = this.y + Math.sin(this.angle) * (this.radius + 18);
    Draw.line(this.x, this.y, gunX, gunY, C.COLORS.LIGHT, 4);
    Draw.text(this.name, this.x - 24, this.y - 44, C.COLORS.WHITE, 14);
    const bw = 60, bh = 7;
    const bx = this.x - bw / 2, by = this.y + this.radius + 12;
    Draw.rect(bx, by, bw, bh, C.COLORS.BLACK);
    Draw.rect(bx, by, bw * window.LastLine.MathUtils.clamp(this.health / this.maxHealth, 0, 1), bh, C.COLORS.GREEN);
    if (this.shieldActive && this.shieldHealth > 0) {
      Draw.rect(bx, by + 10, bw, bh, C.COLORS.BLACK);
      Draw.rect(bx, by + 10, bw * window.LastLine.MathUtils.clamp(this.shieldHealth / this.shieldMaxHealth, 0, 1), bh, C.COLORS.BLUE);
    }
  }
};