window.addEventListener('DOMContentLoaded', () => {
  window.LastLine.Input.init();
  window.gameStarted = false;
  const game = new window.LastLine.Game();
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      window.gameStarted = true;
      game.startGame();
    });
    playBtn.addEventListener('touch', () => {
      window.gameStarted = true;
      game.startGame();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !window.gameStarted) {
      e.preventDefault();
      window.gameStarted = true;
      game.startGame();
    }
    if (e.code === 'Escape' && window.gameStarted) {
      e.preventDefault();
      window.gameStarted = false;
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
  document.addEventListener('pointerlockchange', () => { window.LastLine.pointerLocked = document.pointerLockElement !== null; }, false);
  document.addEventListener('mozpointerlockchange', () => { window.LastLine.pointerLocked = document.mozPointerLockElement !== null; }, false);
});