window.LastLine = window.LastLine || {};
window.LastLine.Enemy = class {
  constructor(scene, position, difficulty = 1) {
    this.scene = scene;
    this.position = position.clone();
    this.health = 50 + difficulty * 10;
    this.maxHealth = this.health;
    this.speed = 0.08 + difficulty * 0.02;
    this.damage = 10 + difficulty * 5;
    this.attackRange = 1.5;
    this.sightRange = 150;
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0xff3333 }));
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);
  }
  update(player, dt) {
    const M = window.LastLine.Math;
    const dist = M.dist3D(this.position, player.position);
    if (dist < this.sightRange) {
      const dir = new THREE.Vector3().subVectors(player.position, this.position).normalize();
      this.position.addScaledVector(dir, this.speed);
    }
    this.mesh.position.copy(this.position);
  }
  takeDamage(amount) {
    this.health -= amount;
    this.mesh.material.emissive.setHex(0xff0000);
    setTimeout(() => { this.mesh.material.emissive.setHex(0x000000); }, 100);
    return this.health <= 0;
  }
  remove() {
    this.scene.remove(this.mesh);
  }
};