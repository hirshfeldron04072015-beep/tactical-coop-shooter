window.LastLine = window.LastLine || {};
window.LastLine.Game = class {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(window.LastLine.CONFIG.COLORS.SKY);
    this.scene.fog = new THREE.Fog(window.LastLine.CONFIG.COLORS.SKY, 300, 1000);
    this.camera = null;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('gameCanvas') });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.player = new window.LastLine.Player(this.scene);
    this.enemies = [];
    this.weapon = new window.LastLine.Weapon(this.scene);
    this.gameTimer = 0;
    this.waveCount = 0;
    this.waveSpawnDelay = 100;
    this.gameRunning = false;
    this.pointerLocked = false;
    this.initScene();
  }
  initScene() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(200, 200, 200);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    const groundGeo = new THREE.PlaneGeometry(500, 500);
    const groundMat = new THREE.MeshStandardMaterial({ color: window.LastLine.CONFIG.COLORS.GROUND });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ color: window.LastLine.CONFIG.COLORS.SKY, side: THREE.BackSide });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }
  startGame() {
    this.gameRunning = true;
    this.camera = new window.LastLine.Camera(this.player);
    this.scene.add(this.camera.yawObject);
    this.gameTimer = 0;
    this.waveCount = 0;
    this.player.health = this.player.maxHealth;
    this.player.ammo = this.player.maxAmmo;
    this.player.kills = 0;
    this.player.damageDealt = 0;
    this.enemies = [];
    this.waveSpawnDelay = 0;
    window.LastLine.UI.hideMenu();
    if (document.pointerLockElement === null) {
      document.getElementById('gameCanvas').requestPointerLock = document.getElementById('gameCanvas').requestPointerLock || document.getElementById('gameCanvas').mozRequestPointerLock;
      if (document.getElementById('gameCanvas').requestPointerLock) {
        document.getElementById('gameCanvas').requestPointerLock();
      }
    }
  }
  spawnWave() {
    const M = window.LastLine.Math;
    const count = Math.min(3 + this.waveCount, 20);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = M.rand(80, 150);
      const x = this.player.position.x + Math.cos(angle) * distance;
      const z = this.player.position.z + Math.sin(angle) * distance;
      const pos = new THREE.Vector3(x, 0, z);
      this.enemies.push(new window.LastLine.Enemy(this.scene, pos, 1 + this.waveCount * 0.5));
    }
    this.waveCount += 1;
  }
  update(dt) {
    if (!this.gameRunning) return;
    this.gameTimer += dt;
    this.player.timeAlive = this.gameTimer;
    const Input = window.LastLine.Input;
    this.player.update(dt, Input);
    if (this.camera) this.camera.update();
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update(this.player, dt);
      const M = window.LastLine.Math;
      const dist = M.dist3D(this.enemies[i].position, this.player.position);
      if (dist < 2) {
        if (this.player.takeDamage(this.enemies[i].damage * dt)) {
          this.gameRunning = false;
          window.LastLine.UI.showGameOver(this.player);
        }
        window.LastLine.Effects.flashScreen(0.1);
      }
    }
    if (Input.mouse.down) {
      const direction = this.camera.getDirection();
      this.weapon.fire(this.camera.camera.position, direction, 25, 200);
      this.player.ammo -= 1;
      if (this.player.ammo < 0) this.player.ammo = 0;
    }
    this.weapon.update(dt, this.enemies);
    for (const bullet of this.weapon.bullets) {
      this.player.damageDealt += 0.5;
    }
    this.waveSpawnDelay -= 1;
    if (this.waveSpawnDelay <= 0) {
      this.spawnWave();
      this.waveSpawnDelay = 200;
    }
    window.LastLine.UI.updateHUD(this.player, this.enemies, this.waveCount, this.waveSpawnDelay);
    window.LastLine.UI.updateRadar(this.player, this.enemies);
  }
  render() {
    if (this.camera) {
      this.renderer.render(this.scene, this.camera.camera);
    }
  }
};