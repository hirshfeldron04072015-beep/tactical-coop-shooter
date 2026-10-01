window.LastLine = window.LastLine || {};

window.LastLine.Game = class {
  constructor() {
    this.gameRunning = false;
    this.paused = false;

    // Three.js setup
    const canvas = document.getElementById('gameCanvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(window.LastLine.Config.SKY_COLOR, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(window.LastLine.Config.SKY_COLOR);

    // Lighting
    const ambientLight = new THREE.AmbientLight(window.LastLine.Config.AMBIENT_LIGHT, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(window.LastLine.Config.DIRECTIONAL_LIGHT, 1);
    directionalLight.position.set(100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -250;
    directionalLight.shadow.camera.right = 250;
    directionalLight.shadow.camera.top = 250;
    directionalLight.shadow.camera.bottom = -250;
    this.scene.add(directionalLight);

    // Create ground
    this.createGround();
    this.createEnvironment();

    // Game objects
    this.camera = new window.LastLine.Camera();
    this.player = null;
    this.enemies = [];
    this.squadmates = [];
    this.weapon = new window.LastLine.Weapon();
    this.ui = new window.LastLine.UI();
    this.effects = window.LastLine.Effects;

    // Game state
    this.currentWave = 0;
    this.nextWaveTime = 20;
    this.gameTime = 0;
    this.inDropPhase = true;
    this.dropTime = 0;
  }

  createGround() {
    const mapSize = window.LastLine.Config.MAP_SIZE;
    const geometry = new THREE.PlaneGeometry(mapSize, mapSize);
    const material = new THREE.MeshStandardMaterial({
      color: window.LastLine.Config.GROUND_COLOR,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createEnvironment() {
    // Add some cover structures
    const mapSize = window.LastLine.Config.MAP_SIZE;
    const positions = [
      { x: -50, z: -50 },
      { x: 50, z: -50 },
      { x: -50, z: 50 },
      { x: 50, z: 50 },
      { x: 0, z: -80 },
      { x: 0, z: 80 },
      { x: -80, z: 0 },
      { x: 80, z: 0 },
    ];

    positions.forEach(pos => {
      // Concrete blocks
      const geometry = new THREE.BoxGeometry(8, 3, 8);
      const material = new THREE.MeshStandardMaterial({
        color: 0x444455,
        roughness: 0.9,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, 1.5, pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  startGame() {
    this.gameRunning = true;
    this.paused = false;
    this.inDropPhase = true;
    this.dropTime = 3; // 3 seconds for helicopter drop and parachute
    this.gameTime = 0;
    this.currentWave = 0;

    // Spawn player above ground (helicopter position)
    this.player = new window.LastLine.Player(this.scene, { x: 0, y: 50, z: -100 });
    window.LastLine.gameCamera = this.camera;
    window.LastLine.gamePlayer = this.player;

    // Spawn squadmates
    this.spawnSquadmates();
    this.startNextWave();
  }

  spawnSquadmates() {
    const positions = [
      { x: 5, y: 50, z: -95 },
      { x: -5, y: 50, z: -95 },
    ];
    this.squadmates = positions.map(pos => {
      const mate = new window.LastLine.Player(this.scene, pos);
      mate.isSquadmate = true;
      return mate;
    });
  }

  startNextWave() {
    this.currentWave++;
    if (this.currentWave > window.LastLine.Config.WAVES.length) {
      this.endGame(true);
      return;
    }

    const waveConfig = window.LastLine.Config.WAVES[this.currentWave - 1];
    this.nextWaveTime = 20; // Time before next wave

    // Spawn enemies
    for (let i = 0; i < waveConfig.enemies; i++) {
      this.spawnEnemy(waveConfig.type, waveConfig.difficulty);
    }
  }

  spawnEnemy(type, difficulty) {
    const angle = Math.random() * Math.PI * 2;
    const dist = window.LastLine.Config.ENEMY_SPAWN_DISTANCE;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist + 50;
    const enemy = new window.LastLine.Enemy(this.scene, { x, y: 0, z }, type);
    enemy.health *= difficulty;
    enemy.maxHealth = enemy.health;
    this.enemies.push(enemy);
  }

  update(dt) {
    if (!this.gameRunning) return;

    this.gameTime += dt;

    // Drop phase (parachute landing)
    if (this.inDropPhase) {
      this.dropTime -= dt;
      if (this.dropTime > 0) {
        // Move player down smoothly
        this.player.position.y -= dt * 15; // Descent speed
        this.player.position.y = Math.max(this.player.position.y, 0);
      } else {
        this.inDropPhase = false;
        this.player.position.y = 0; // Ensure player is on ground
        this.squadmates.forEach(mate => {
          mate.position.y = 0;
        });
      }
    }

    // Update player
    this.camera.update(this.player, dt);
    this.player.update(this.camera, dt, this.scene, this.enemies);

    // Update squadmates
    this.squadmates.forEach(mate => {
      mate.position.y = 0; // Keep on ground
    });

    // Handle input
    const input = window.LastLine.Input;
    if (input.isPressed('KeyR')) {
      this.player.reload();
    }
    if (input.pointerLocked && input.keys[0]) { // Mouse click (approximation)
      this.weapon.fire(this.player, this.enemies);
    }

    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(dt, this.player, this.enemies, this.scene);
    });

    // Remove dead enemies
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.health <= 0) {
        enemy.remove(this.scene);
        this.ui.kills++;
        return false;
      }
      return true;
    });

    // Wave management
    if (this.enemies.length === 0) {
      this.nextWaveTime -= dt;
      if (this.nextWaveTime <= 0) {
        this.startNextWave();
      }
    }

    // Check player death
    if (this.player.health <= 0) {
      this.endGame(false);
    }

    // Update UI
    this.ui.update(this.player, this.currentWave, this.enemies);
    this.ui.updateRadar(this.player, this.enemies, this.squadmates);
    this.effects.update(dt);
  }

  render() {
    if (!this.gameRunning) return;
    this.renderer.render(this.scene, this.camera.camera);
  }

  endGame(won) {
    this.gameRunning = false;
    this.ui.showGameOver({
      kills: this.ui.kills,
      level: this.ui.level,
      wave: this.currentWave,
      time: this.gameTime,
    });
  }
};
