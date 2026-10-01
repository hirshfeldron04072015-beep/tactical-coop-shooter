window.LastLine = window.LastLine || {};

window.LastLine.Game = class {
  constructor() {
    this.state = "menu";
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.pickups = [];
    this.particles = [];
    this.mapName = window.LastLine.CONFIG.MAPS[0].name;
    this.selectedMapIdx = 0;
    this.difficulty = 1;
    this.wave = 1;
    this.gameTimer = 0;
    this.currentMissionIdx = 0;
    this.missionProgress = 0;
    this.message = "";
    this.messageTimer = 0;
    this.enemySpawnDelay = 50;
  }

  startGame() {
    this.state = "playing";
    this.player = new window.LastLine.Player(window.LastLine.CONFIG.WIDTH / 2, window.LastLine.CONFIG.HEIGHT / 2);
    this.enemies = [];
    this.bullets = [];
    this.pickups = [];
    this.particles = [];
    this.wave = 1;
    this.gameTimer = 0;
    this.currentMissionIdx = 0;
    this.missionProgress = 0;
    this.message = "";
    this.messageTimer = 0;
    this.enemySpawnDelay = 50;
    this.spawnWave();
  }

  setMessage(text, duration = 120) {
    this.message = text;
    this.messageTimer = duration;
  }

  spawnWave() {
    const M = window.LastLine.MathUtils;
    const C = window.LastLine.CONFIG;
    const count = Math.min(5 + this.wave * 2, 25 + this.difficulty * 5);
    for (let i = 0; i < count; i++) {
      const sides = ["top", "bottom", "left", "right"];
      const side = sides[M.randInt(0, 3)];
      let x, y;
      if (side === "top") { x = M.rand(0, C.WIDTH); y = -30; }
      else if (side === "bottom") { x = M.rand(0, C.WIDTH); y = C.HEIGHT + 30; }
      else if (side === "left") { x = -30; y = M.rand(0, C.HEIGHT); }
      else { x = C.WIDTH + 30; y = M.rand(0, C.HEIGHT); }
      const radius = M.rand(14, 20);
      const speed = M.rand(0.8, 1.5) + this.wave * 0.15 + this.difficulty * 0.1;
      const hp = M.rand(22, 34) + this.wave * 4 + this.difficulty * 3;
      const color = [M.randInt(100, 220), M.randInt(50, 120), M.randInt(50, 120)];
      this.enemies.push(new window.LastLine.Enemy(x, y, radius, speed, hp, color, this.wave));
    }
  }

  spawnPickup(x, y, kind) {
    this.pickups.push(new window.LastLine.Pickup(x, y, kind));
  }

  spawnParticles(x, y, color, count = 10) {
    const M = window.LastLine.MathUtils;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = M.rand(1, 3.5);
      this.particles.push(new window.LastLine.Particle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed, M.rand(18, 40), M.randInt(2, 5)));
    }
  }

  update(dt) {
    if (this.state !== "playing") return;
    this.gameTimer += dt;
    this.player.update(dt);
    const M = window.LastLine.MathUtils;
    const C = window.LastLine.CONFIG;
    const Input = window.LastLine.Input;
    const moveX = (Input.isDown("KeyD") || Input.isDown("ArrowRight") ? 1 : 0) - (Input.isDown("KeyA") || Input.isDown("ArrowLeft") ? 1 : 0);
    const moveY = (Input.isDown("KeyS") || Input.isDown("ArrowDown") ? 1 : 0) - (Input.isDown("KeyW") || Input.isDown("ArrowUp") ? 1 : 0);
    this.player.move(moveX, moveY, dt);
    this.player.setAngleFromTarget(Input.mouse.x, Input.mouse.y);
    if (Input.mouse.down || Input.isDown("Space")) this.player.shoot(this.bullets);
    if (Input.isDown("ShiftLeft") || Input.isDown("ShiftRight")) this.player.shootSecondary(this.bullets);
    if (Input.isDown("KeyF")) this.player.meleeAttack(this.enemies);
    if (Input.isDown("KeyQ")) this.player.useUtility(this.particles, this.enemies);
    this.enemySpawnDelay = Math.max(0, this.enemySpawnDelay - dt * 60);
    if (this.enemySpawnDelay <= 0) {
      this.spawnWave();
      this.enemySpawnDelay = Math.max(20, 100 - this.wave * 4 - this.difficulty * 5);
      this.wave += 1;
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(dt);
      if (!b.isAlive()) { this.bullets.splice(i, 1); continue; }
      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (M.dist(b, e) < b.radius + e.radius) {
          e.takeDamage(b.damage);
          this.player.totalDamageDealt += b.damage;
          this.spawnParticles(b.x, b.y, b.color, 6);
          this.bullets.splice(i, 1);
          if (!e.isAlive()) {
            this.enemies.splice(j, 1);
            this.player.kills += 1;
            this.player.addXP(15);
            this.missionProgress += 1;
            if (Math.random() < 0.35) this.spawnPickup(e.x, e.y, "xp");
            if (Math.random() < 0.10) this.spawnPickup(e.x, e.y, "key");
          }
          hit = true;
          break;
        }
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(this.player, dt);
      if (M.dist(this.player, e) < e.radius + this.player.radius) {
        this.player.takeDamage(14);
        e.hitFlash = 15;
        this.spawnParticles(this.player.x, this.player.y, C.COLORS.RED, 8);
        if (this.player.health <= 0) {
          this.state = "gameOver";
          this.setMessage("Mission failed.");
        }
      }
    }
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.update(dt);
      if (M.dist(this.player, p) < p.radius + this.player.radius + 8) {
        if (p.kind === "xp") {
          this.player.addXP(40);
          this.setMessage("+40 XP", 30);
        } else if (p.kind === "key") {
          this.player.keys += 1;
          this.setMessage("+1 key", 30);
        }
        this.pickups.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (!this.particles[i].isAlive()) this.particles.splice(i, 1);
    }
    if (this.currentMissionIdx < C.MISSIONS.length) {
      const m = C.MISSIONS[this.currentMissionIdx];
      if (m.type === "kills" && this.missionProgress >= m.target) {
        this.player.keys += m.rewardKeys;
        this.player.addXP(m.rewardXp);
        this.setMessage(`Mission complete: ${m.title}`, 180);
        this.currentMissionIdx += 1;
        this.missionProgress = 0;
        this.wave += 1;
        this.spawnWave();
      }
    }
    if (this.enemies.length === 0 && this.state === "playing") {
      this.wave += 1;
      this.spawnWave();
    }
    if (this.messageTimer > 0) {
      this.messageTimer -= dt * 60;
      if (this.messageTimer <= 0) this.message = "";
    }
  }

  draw() {
    const UI = window.LastLine.UI;
    if (this.state === "menu") UI.drawMenu();
    else if (this.state === "lobby") UI.drawLobby(this.selectedMapIdx);
    else if (this.state === "playing") UI.drawGame(this);
    else if (this.state === "gameOver") UI.drawGameOver(this);
  }
};