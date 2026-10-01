window.addEventListener('DOMContentLoaded', () => {
  window.LastLine.Input.init();
  const game = new window.LastLine.Game();
  const startBtn = document.getElementById('menu');
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !game.gameRunning) {
      game.startGame();
    }
    if (e.code === 'Escape' && game.gameRunning) {
      game.gameRunning = false;
      document.getElementById('menu').style.display = 'flex';
    }
  });
  let lastTime = performance.now();
  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    game.update(dt);
    game.render();
    requestAnimationFrame(gameLoop);
  }
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (game.camera) {
      game.camera.camera.aspect = w / h;
      game.camera.camera.updateProjectionMatrix();
    }
    game.renderer.setSize(w, h);
  });
  requestAnimationFrame(gameLoop);
});