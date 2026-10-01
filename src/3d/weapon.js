window.LastLine = window.LastLine || {};

window.LastLine.Weapon = class {
  constructor() {
    this.lastFireTime = 0;
    this.currentWeapon = 'PISTOL';
  }

  canFire() {
    const weapon = window.LastLine.Config.WEAPONS[this.currentWeapon];
    return performance.now() - this.lastFireTime > weapon.fireRate * 1000;
  }

  fire(player, enemies) {
    if (!this.canFire()) return false;
    if (player.magazine[this.currentWeapon] <= 0) return false;

    this.lastFireTime = performance.now();
    player.shoot(enemies);
    return true;
  }
};
