window.LastLine = window.LastLine || {};

window.LastLine.Enemy = class {
  constructor(scene, position, type = 'basic') {
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.health = window.LastLine.Config.ENEMY_HEALTH * (type === 'elite' ? 1.5 : 1);
    this.maxHealth = this.health;
    this.type = type;
    this.target = null;
    this.lastAttackTime = 0;
    this.detectionRange = window.LastLine.Config.ENEMY_DETECTION_RANGE;
    this.onGround = false;

    // Create mesh
    const geometry = new THREE.BoxGeometry(0.6, 1.6, 0.4);
    const material = new THREE.MeshStandardMaterial({
      color: type === 'elite' ? 0xff3333 : 0xdd4444,
      roughness: 0.4,
      metalness: 0.3,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // Head
    const headGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({
      color: type === 'elite' ? 0xff5555 : 0xff6666,
    });
    this.head = new THREE.Mesh(headGeom, headMat);
    this.head.position.y = 0.6;
    this.mesh.add(this.head);
  }

  update(dt, player, enemies, scene) {
    // Detect player
    const distToPlayer = window.LastLine.Math.distance(this.position, player.position);
    if (distToPlayer < this.detectionRange) {
      this.target = player;
    } else {
      this.target = null;
    }

    // Move toward target
    if (this.target) {
      const dir = this.target.position.clone().sub(this.position).normalize();
      const speed = window.LastLine.Config.ENEMY_SPEED;
      this.velocity.x = dir.x * speed;
      this.velocity.z = dir.z * speed;

      // Attack if in range
      if (distToPlayer < window.LastLine.Config.ENEMY_ATTACK_RANGE) {
        if (performance.now() - this.lastAttackTime > window.LastLine.Config.ENEMY_ATTACK_COOLDOWN * 1000) {
          this.attack(player);
          this.lastAttackTime = performance.now();
        }
      }
    } else {
      this.velocity.x *= 0.95;
      this.velocity.z *= 0.95;
    }

    // Gravity
    this.velocity.y -= window.LastLine.Config.GRAVITY * dt;

    // Apply velocity
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    // Ground check
    this.onGround = this.position.y <= window.LastLine.Config.GROUND_HEIGHT + 0.1;
    if (this.onGround) {
      this.position.y = window.LastLine.Config.GROUND_HEIGHT;
      this.velocity.y = 0;
    }

    // Update mesh
    this.mesh.position.copy(this.position);
  }

  attack(player) {
    player.takeDamage(window.LastLine.Config.ENEMY_ATTACK_DAMAGE);
  }

  takeDamage(amount) {
    this.health -= amount;
    // Flash on hit
    this.mesh.material.color.setHex(0xffff00);
    setTimeout(() => {
      if (this.mesh && this.type === 'elite') {
        this.mesh.material.color.setHex(0xff3333);
      } else if (this.mesh) {
        this.mesh.material.color.setHex(0xdd4444);
      }
    }, 100);
    return this.health <= 0;
  }

  remove(scene) {
    scene.remove(this.mesh);
  }
};
