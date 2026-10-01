window.addEventListener('DOMContentLoaded', () => {
  window.LastLine.Input.init();
  window.gameStarted = false;
  const game = new window.LastLine.Game();
  const menu = document.getElementById('menu');
  const playBtn = document.getElementById('playBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const aboutBtn = document.getElementById('aboutBtn');

  const startGame = () => {
    window.gameStarted = true;
    game.startGame();
    if (menu) menu.style.display = 'none';
  };

  if (playBtn) {
    playBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      startGame();
    });
    playBtn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      event.stopPropagation();
      startGame();
    }, { passive: false });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      alert('Settings coming soon.');
    });
  }

  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      alert('Last Line v3.2 - Tactical Shooter');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !window.gameStarted) {
      e.preventDefault();
      startGame();
    }
    if (e.code === 'Escape' && game.gameRunning) {
      e.preventDefault();
      window.gameStarted = false;
      game.gameRunning = false;
      if (menu) menu.style.display = 'flex';
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

  // Mouse click detection for shooting
  document.addEventListener('click', () => {
    if (!window.gameStarted || !game.gameRunning) return;
    window.LastLine.Input.keys[0] = true;
    setTimeout(() => {
      window.LastLine.Input.keys[0] = false;
    }, 50);
  });

  document.addEventListener('pointerlockchange', () => {
    window.LastLine.Input.pointerLocked = document.pointerLockElement !== null;
  }, false);

  document.addEventListener('mozpointerlockchange', () => {
    window.LastLine.Input.pointerLocked = document.mozPointerLockElement !== null;
  }, false);

  requestAnimationFrame(gameLoop);
});
