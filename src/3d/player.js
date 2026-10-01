window.LastLine = window.LastLine || {};

window.LastLine.Player = class {
  constructor(scene, position = { x: 0, y: 20, z: 0 }) {
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.health = window.LastLine.Config.PLAYER_MAX_HEALTH;
    this.maxHealth = window.LastLine.Config.PLAYER_MAX_HEALTH;
    this.isCrouching = false;
    this.isGrounded = false;
    this.lastMeleeTime = 0;
    this.onGround = false;
    this.raycaster = new THREE.Raycaster();
    this.groundCheckDistance = 0.1;
    this.scene = scene;
    this.currentWeapon = 'PISTOL';
    this.ammo = {};
    this.magazine = {};
    
    Object.keys(window.LastLine.Config.WEAPONS).forEach(weapon => {
      this.ammo[weapon] = window.LastLine.Config.WEAPONS[weapon].ammo;
      this.magazine[weapon] = window.LastLine.Config.WEAPONS[weapon].magazine;
    });

    // Create invisible player collider (capsule)
    this.collider = new THREE.Sphere(this.position, 0.3);
  }

  takeDamage(amount) {
    this.health = window.LastLine.Math.clamp(this.health - amount, 0, this.maxHealth);
    return this.health <= 0;
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  checkGround(scene) {
    this.raycaster.set(this.position, new THREE.Vector3(0, -1, 0));
    this.raycaster.ray.origin.y -= window.LastLine.Config.PLAYER_HEIGHT / 2;
    
    // Simple ground check - player is grounded if above ground height
    this.onGround = this.position.y <= window.LastLine.Config.GROUND_HEIGHT + 0.5;
  }

  update(camera, dt, scene, enemies) {
    const input = window.LastLine.Input;
    const movement = input.getMovementInput();

    // Movement
    const moveDir = new THREE.Vector3(0, 0, 0);
    const forward = new THREE.Vector3(
      Math.sin(camera.yaw),
      0,
      Math.cos(camera.yaw)
    ).normalize();
    const right = new THREE.Vector3(
      Math.cos(camera.yaw),
      0,
      -Math.sin(camera.yaw)
    ).normalize();

    if (movement.forward) moveDir.addScaledVector(forward, 1);
    if (movement.backward) moveDir.addScaledVector(forward, -1);
    if (movement.right) moveDir.addScaledVector(right, 1);
    if (movement.left) moveDir.addScaledVector(right, -1);

    moveDir.normalize();
    
    const speed = movement.sprint
      ? window.LastLine.Config.PLAYER_SPRINT_SPEED
      : window.LastLine.Config.PLAYER_SPEED;

    this.velocity.x = moveDir.x * speed;
    this.velocity.z = moveDir.z * speed;

    // Gravity
    this.checkGround(scene);
    if (!this.onGround) {
      this.velocity.y -= window.LastLine.Config.GRAVITY * dt;
    }

    // Jump
    if (movement.jump && this.onGround) {
      this.velocity.y = window.LastLine.Config.PLAYER_JUMP_FORCE;
      this.onGround = false;
    }

    // Apply velocity
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    // Clamp to map
    const mapSize = window.LastLine.Config.MAP_SIZE;
    this.position.x = window.LastLine.Math.clamp(this.position.x, -mapSize / 2, mapSize / 2);
    this.position.z = window.LastLine.Math.clamp(this.position.z, -mapSize / 2, mapSize / 2);
    this.position.y = Math.max(this.position.y, window.LastLine.Config.GROUND_HEIGHT);

    // Crouch
    this.isCrouching = movement.sprint ? false : this.isCrouching;

    // Melee
    if (movement.melee && performance.now() - this.lastMeleeTime > window.LastLine.Config.MELEE_COOLDOWN * 1000) {
      this.meleeAttack(enemies);
      this.lastMeleeTime = performance.now();
    }
  }

  meleeAttack(enemies) {
    const range = window.LastLine.Config.MELEE_RANGE;
    enemies.forEach(enemy => {
      if (window.LastLine.Math.distance(this.position, enemy.position) < range) {
        enemy.takeDamage(window.LastLine.Config.MELEE_DAMAGE);
      }
    });
  }

  shoot(enemies) {
    const weapon = window.LastLine.Config.WEAPONS[this.currentWeapon];
    if (this.magazine[this.currentWeapon] <= 0) return false;

    this.magazine[this.currentWeapon]--;

    // Raycast to find hit enemy
    const raycaster = new THREE.Raycaster();
    const camera = window.LastLine.gameCamera;
    raycaster.setFromCamera({ x: 0, y: 0 }, camera.camera);

    const hit = raycaster.intersectObjects(
      enemies.map(e => e.mesh).filter(m => m),
      true
    );

    if (hit.length > 0) {
      const enemy = enemies.find(e => e.mesh === hit[0].object || e.mesh.children.includes(hit[0].object));
      if (enemy) {
        enemy.takeDamage(weapon.damage);
        return true;
      }
    }

    return false;
  }

  reload() {
    const weapon = window.LastLine.Config.WEAPONS[this.currentWeapon];
    const ammoNeeded = weapon.magazine - this.magazine[this.currentWeapon];
    const ammoAvailable = Math.min(ammoNeeded, this.ammo[this.currentWeapon]);
    this.magazine[this.currentWeapon] += ammoAvailable;
    this.ammo[this.currentWeapon] -= ammoAvailable;
  }
};
