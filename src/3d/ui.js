window.LastLine = window.LastLine || {};

window.LastLine.UI = class {
  constructor() {
    this.kills = 0;
    this.level = 1;
    this.wave = 1;
    this.parachuteActive = false;
  }

  update(player, wave, enemies) {
    // Health
    const healthPercent = (player.health / player.maxHealth) * 100;
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    if (healthFill) healthFill.style.width = healthPercent + '%';
    if (healthText) healthText.textContent = `${Math.ceil(player.health)}/${player.maxHealth}`;

    // Ammo
    const weapon = window.LastLine.Config.WEAPONS[player.currentWeapon];
    const ammoCount = document.getElementById('ammoCount');
    const weaponName = document.getElementById('weaponName');
    const ammoBarFill = document.getElementById('ammoBarFill');
    if (ammoCount) ammoCount.textContent = player.magazine[player.currentWeapon];
    if (weaponName) weaponName.textContent = weapon.name;
    if (ammoBarFill) {
      const ammoPercent = (player.magazine[player.currentWeapon] / weapon.magazine) * 100;
      ammoBarFill.style.width = ammoPercent + '%';
    }

    // Wave info
    if (document.getElementById('waveNum')) document.getElementById('waveNum').textContent = wave;
    if (document.getElementById('enemyCount')) document.getElementById('enemyCount').textContent = enemies.length;
    if (document.getElementById('killsDisplay')) document.getElementById('killsDisplay').textContent = this.kills;
    if (document.getElementById('levelDisplay')) document.getElementById('levelDisplay').textContent = this.level;
  }

  updateRadar(player, enemies, squadmates) {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const scale = size / (window.LastLine.Config.MAP_SIZE);

    // Clear
    ctx.fillStyle = 'rgba(15, 25, 10, 0.8)';
    ctx.fillRect(0, 0, size, size);

    // Grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const pos = (i / 4) * size;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Center circle (player)
    const centerX = size / 2;
    const centerY = size / 2;
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Enemies
    ctx.fillStyle = '#f44';
    enemies.forEach(enemy => {
      const relPos = enemy.position.clone().sub(player.position);
      const radarX = centerX + relPos.x * scale;
      const radarY = centerY + relPos.z * scale;
      ctx.beginPath();
      ctx.arc(radarX, radarY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Squad mates
    ctx.fillStyle = '#0ff';
    squadmates.forEach(mate => {
      const relPos = mate.position.clone().sub(player.position);
      const radarX = centerX + relPos.x * scale;
      const radarY = centerY + relPos.z * scale;
      ctx.beginPath();
      ctx.arc(radarX, radarY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  showGameOver(stats) {
    const gameOverDiv = document.getElementById('gameOver');
    const finalStats = document.getElementById('finalStats');
    if (gameOverDiv && finalStats) {
      finalStats.innerHTML = `
        <p>Kills: <span style="color: #0f0;">${stats.kills}</span></p>
        <p>Level: <span style="color: #0ff;">${stats.level}</span></p>
        <p>Wave: <span style="color: #ff9900;">${stats.wave}</span></p>
        <p>Time: <span style="color: #0f0;">${Math.floor(stats.time)}s</span></p>
      `;
      gameOverDiv.style.display = 'block';
    }
  }
};
