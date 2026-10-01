window.LastLine = window.LastLine || {};
window.LastLine.Weapon = class {
  constructor(scene) {
    this.scene = scene;
    this.bullets = [];
    this.bulletSpeed = 1.5;
  }
  fire(origin, direction, damage, range = 200) {
    const bullet = {
      position: origin.clone(),
      direction: direction.clone().normalize(),
      damage: damage,
      range: range,
      traveled: 0
    };
    this.bullets.push(bullet);
  }
  update(dt, enemies) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      const move = new THREE.Vector3().copy(bullet.direction).multiplyScalar(this.bulletSpeed);
      bullet.position.add(move);
      bullet.traveled += move.length();
      if (bullet.traveled > bullet.range) {
        this.bullets.splice(i, 1);
        continue;
      }
      const M = window.LastLine.Math;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        const dist = M.dist3D(bullet.position, enemy.position);
        if (dist < 1.0) {
          if (enemy.takeDamage(bullet.damage)) {
            enemies.splice(j, 1);
            enemy.remove();
          }
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }
};