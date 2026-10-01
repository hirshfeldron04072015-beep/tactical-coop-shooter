window.LastLine = window.LastLine || {};
window.LastLine.UI = {
  updateHUD(player) {
    const healthPercent = (player.health / player.maxHealth) * 100;
    document.getElementById('healthFill').style.width = healthPercent + '%';
    document.getElementById('healthFill').style.background = player.health > 50 ? '#0f0' : player.health > 25 ? '#ff9900' : '#f00';
    document.getElementById('ammoCount').textContent = player.ammo;
    document.getElementById('magCount').textContent = Math.ceil(player.ammo / 30);
  },
  updateRadar(player, enemies) {
    const canvas = document.getElementById('radarCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 150, 150);
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(0, 0, 150, 150);
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(75, 75, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f00';
    const scale = 2;
    for (const enemy of enemies) {
      const dx = (enemy.position.x - player.position.x) * scale;
      const dy = (enemy.position.z - player.position.z) * scale;
      const x = 75 + dx;
      const y = 75 + dy;
      if (x > 0 && x < 150 && y > 0 && y < 150) {
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
      Level: ${player.level}<br>
      Kills: ${player.kills}<br>
      Damage Dealt: ${Math.floor(player.damageDealt)}<br>
      Time Alive: ${Math.floor(player.timeAlive)}s
    `;
  },
  hideMenu() {
    document.getElementById('menu').style.display = 'none';
  }
};