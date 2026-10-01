window.LastLine = window.LastLine || {};
window.LastLine.Player = class {
  constructor(scene) {
    this.scene = scene;
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3();
    this.speed = 0.15;
    this.sprintSpeed = 0.25;
    this.health = 100;
    this.maxHealth = 100;
    this.level = 1;
    this.xp = 0;
    this.ammo = 300;
    this.maxAmmo = 300;
    this.kills = 0;
    this.damageDealt = 0;
    this.isSprinting = false;
    this.canShoot = true;
    this.shootCooldown = 0;
    this.gravity = 0.98;
    this.velocity.y = 0;
    this.timeAlive = 0;
  }
  update(dt, input) {
    const M = window.LastLine.Math;
    const dir = new THREE.Vector3();
    if (input.isDown('KeyW') || input.isDown('ArrowUp')) dir.z -= 1;
    if (input.isDown('KeyS') || input.isDown('ArrowDown')) dir.z += 1;
    if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dir.x -= 1;
    if (input.isDown('KeyD') || input.isDown('ArrowRight')) dir.x += 1;
    if (dir.length() > 0) dir.normalize();
    this.isSprinting = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
    const moveSpeed = this.isSprinting ? this.sprintSpeed : this.speed;
    this.velocity.x = dir.x * moveSpeed;
    this.velocity.z = dir.z * moveSpeed;
    this.position.add(this.velocity);
    const limit = window.LastLine.CONFIG.WORLD_SIZE / 2;
    this.position.x = M.clamp(this.position.x, -limit, limit);
    this.position.z = M.clamp(this.position.z, -limit, limit);
    this.shootCooldown = Math.max(0, this.shootCooldown - dt);
  }
  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }
  shoot(ammo, damage) {
    if (this.canShoot && this.ammo > 0) {
      this.shootCooldown = 0.1;
      this.ammo -= 1;
      return { damage: damage, cooldown: this.shootCooldown };
    }
    return null;
  }
};