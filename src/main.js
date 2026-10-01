window.LastLine = window.LastLine || {};

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  window.LastLine.canvas = canvas;
  window.LastLine.ctx = ctx;
  const Input = window.LastLine.Input;
  const game = new window.LastLine.Game();
  window.addEventListener("keydown", (event) => {
    if (game.state === "menu" && event.code === "Digit3") {
      game.startGame();
    } else if (game.state === "lobby" && event.code === "ArrowUp") {
      game.selectedMapIdx = Math.max(0, game.selectedMapIdx - 1);
      game.mapName = window.LastLine.CONFIG.MAPS[game.selectedMapIdx].name;
      game.difficulty = window.LastLine.CONFIG.MAPS[game.selectedMapIdx].difficulty;
    } else if (game.state === "lobby" && event.code === "ArrowDown") {
      game.selectedMapIdx = Math.min(window.LastLine.CONFIG.MAPS.length - 1, game.selectedMapIdx + 1);
      game.mapName = window.LastLine.CONFIG.MAPS[game.selectedMapIdx].name;
      game.difficulty = window.LastLine.CONFIG.MAPS[game.selectedMapIdx].difficulty;
    } else if (game.state === "lobby" && event.code === "Enter") {
      game.startGame();
    } else if (game.state === "menu" && event.code === "Digit1") {
      game.state = "lobby";
    } else if (game.state === "gameOver" && event.code === "KeyR") {
      game.startGame();
    } else if (game.state === "gameOver" && event.code === "Escape") {
      game.state = "menu";
    } else if (game.state === "playing" && event.code === "Escape") {
      game.state = "menu";
    }
  });
  let lastTime = 0;
  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.033);
    lastTime = now;
    game.update(dt);
    game.draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
});