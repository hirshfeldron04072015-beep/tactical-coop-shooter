window.LastLine = window.LastLine || {};
window.LastLine.UI = {
  updateHUD(player, enemies, wave, waveSpawnDelay) {
    const healthPercent = (player.health / player.maxHealth) * 100;
    const healthFill = document.getElementById('healthFill');
    if (healthFill) {
      healthFill.style.width = healthPercent + '%';
      healthFill.style.background = player.health > 50 ? 'linear-gradient(90deg, #0f0 0%, #0f0 70%, #0a0 100%)' : player.health > 25 ? 'linear-gradient(90deg, #ff9900 0%, #ffcc00 100%)' : 'linear-gradient(90deg, #f00 0%, #cc0000 100%)';
    }
    const healthText = document.getElementById('healthText');
    if (healthText) healthText.textContent = Math.floor(player.health) + '/' + player.maxHealth;
    document.getElementById('levelDisplay').textContent = player.level;
    document.getElementById('killsDisplay').textContent = player.kills;
    document.getElementById('ammoCount').textContent = player.ammo;
    document.getElementById('waveDisplay').textContent = wave;
    document.getElementById('waveNum').textContent = wave;
    document.getElementById('enemyCount').textContent = enemies.length;
    const ammoPercent = (player.ammo / player.maxAmmo) * 100;
    const ammoBarFill = document.getElementById('ammoBarFill');
    if (ammoBarFill) {
      ammoBarFill.style.width = ammoPercent + '%';
      ammoBarFill.style.background = player.ammo > 100 ? 'linear-gradient(90deg, #ff9900, #ffcc00)' : player.ammo > 50 ? 'linear-gradient(90deg, #ffcc00, #ff9900)' : 'linear-gradient(90deg, #f00, #cc0000)';
    }
    const nextWaveTime = Math.ceil(waveSpawnDelay / 60);
    const nextWaveEl = document.getElementById('nextWaveTime');
    if (nextWaveEl) nextWaveEl.textContent = Math.max(0, nextWaveTime);
  },
  updateRadar(player, enemies) {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 160, 160);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, 160, 160);
    ctx.strokeStyle = 'rgba(15, 200, 100, 0.3)';
    ctx.beginPath();
    ctx.arc(80, 80, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(80, 80, 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(80, 80, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f00';
    const scale = 0.5;
    for (const enemy of enemies) {
      const dx = (enemy.position.x - player.position.x) * scale;
      const dy = (enemy.position.z - player.position.z) * scale;
      const x = 80 + dx;
      const y = 80 + dy;
      if (x > 0 && x < 160 && y > 0 && y < 160) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  showGameOver(player) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalStats').innerHTML = `
      <div class="stat-line">▪ Level: ${player.level}</div>
      <div class="stat-line">▪ Kills: ${player.kills}</div>
      <div class="stat-line">▪ Damage Dealt: ${Math.floor(player.damageDealt)}</div>
      <div class="stat-line">▪ Time Alive: ${Math.floor(player.timeAlive)}s</div>
    `;
  },
  hideMenu() {
    document.getElementById('menu').style.display = 'none';
  }
};