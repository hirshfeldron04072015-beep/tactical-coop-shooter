window.LastLine = window.LastLine || {};

window.LastLine.Config = {
  // Graphics
  RENDER_DISTANCE: 500,
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,

  // Player
  PLAYER_HEIGHT: 1.7,
  PLAYER_SPEED: 20,
  PLAYER_SPRINT_SPEED: 30,
  PLAYER_JUMP_FORCE: 15,
  PLAYER_MAX_HEALTH: 100,
  PLAYER_CROUCH_HEIGHT: 0.8,
  GRAVITY: 30,

  // Combat
  MELEE_RANGE: 2,
  MELEE_DAMAGE: 25,
  MELEE_COOLDOWN: 0.6,

  // Weapons
  WEAPONS: {
    PISTOL: {
      name: 'M9 Tactical',
      damage: 15,
      rpm: 450,
      accuracy: 0.8,
      range: 100,
      magazine: 15,
      ammo: 150,
      fireRate: 0.133,
      spread: 0.15,
      recoil: 0.8,
    },
    RIFLE: {
      name: 'AR-15 Carbine',
      damage: 22,
      rpm: 750,
      accuracy: 0.7,
      range: 200,
      magazine: 30,
      ammo: 300,
      fireRate: 0.08,
      spread: 0.25,
      recoil: 1.2,
    },
    SHOTGUN: {
      name: 'Tactical Shotgun',
      damage: 50,
      rpm: 60,
      accuracy: 0.4,
      range: 30,
      magazine: 8,
      ammo: 40,
      fireRate: 1.0,
      spread: 0.6,
      recoil: 2.5,
    },
  },

  // Enemies
  ENEMY_SPEED: 12,
  ENEMY_ATTACK_RANGE: 20,
  ENEMY_ATTACK_DAMAGE: 10,
  ENEMY_ATTACK_COOLDOWN: 1.5,
  ENEMY_HEALTH: 30,
  ENEMY_DETECTION_RANGE: 150,
  ENEMY_SPAWN_DISTANCE: 80,

  // Waves
  WAVES: [
    { enemies: 3, type: 'basic', difficulty: 0.8 },
    { enemies: 5, type: 'mixed', difficulty: 1.0 },
    { enemies: 8, type: 'aggressive', difficulty: 1.2 },
    { enemies: 12, type: 'aggressive', difficulty: 1.5 },
    { enemies: 15, type: 'elite', difficulty: 2.0 },
  ],

  // Map
  MAP_SIZE: 300,
  GROUND_HEIGHT: 0,
  SKY_COLOR: 0x0a0a1a,
  GROUND_COLOR: 0x1a2a1a,
  AMBIENT_LIGHT: 0x444466,
  DIRECTIONAL_LIGHT: 0xffffff,
};
