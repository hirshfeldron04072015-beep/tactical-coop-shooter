window.LastLine = window.LastLine || {};

window.LastLine.UI = {
  drawMenu() {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    Draw.background();
    Draw.text("LAST LINE", C.WIDTH / 2, 110, C.COLORS.WHITE, 48, "bold", "center");
    Draw.text("Tactical Coop Shooter", C.WIDTH / 2, 150, C.COLORS.LIGHT, 20, "normal", "center");
    const lines = [
      "1. Create Party",
      "2. Join Party",
      "3. Start Solo",
      "",
      "CONTROLS:",
      "WASD move",
      "Mouse aim",
      "Left click / Space shoot",
      "Shift secondary fire",
      "F melee",
      "Q utility"
    ];
    let y = 220;
    for (const line of lines) {
      if (line === "") { y += 15; continue; }
      Draw.text(line, 260, y, C.COLORS.LIGHT, 18);
      y += 30;
    }
  },

  drawLobby(selectedMapIdx) {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    Draw.background();
    Draw.text("LOBBY", C.WIDTH / 2, 80, C.COLORS.WHITE, 42, "bold", "center");
    for (let i = 0; i < C.MAPS.length; i++) {
      const map = C.MAPS[i];
      const selected = i === selectedMapIdx;
      const color = selected ? C.COLORS.GREEN : C.COLORS.LIGHT;
      const prefix = selected ? "> " : "  ";
      Draw.text(`${prefix}${i + 1}. ${map.name}`, 220, 220 + i * 35, color, 20);
    }
    Draw.text("UP/DOWN select map | ENTER deploy", C.WIDTH / 2, 660, C.COLORS.YELLOW, 16, "normal", "center");
  },

  drawGame(game) {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    Draw.background();
    for (const b of game.bullets) b.draw();
    for (const p of game.pickups) p.draw();
    for (const e of game.enemies) e.draw();
    for (const p of game.particles) p.draw();
    game.player.draw();
    Draw.text(`HP: ${Math.floor(game.player.health)}/${game.player.maxHealth}`, 20, 25, C.COLORS.WHITE, 18);
    Draw.text(`LV ${game.player.level} • XP ${game.player.xp}/${window.LastLine.MathUtils.getLevelThreshold(game.player.level)}`, 20, 50, C.COLORS.WHITE, 18);
    Draw.text(`Keys: ${game.player.keys} | Kills: ${game.player.kills}`, 20, 75, C.COLORS.YELLOW, 18);
    Draw.text(`Map: ${game.mapName}`, C.WIDTH - 260, 25, C.COLORS.LIGHT, 18);
    Draw.text(`Wave: ${game.wave}`, C.WIDTH - 260, 50, C.COLORS.LIGHT, 18);
    Draw.text(`Enemies: ${game.enemies.length}`, C.WIDTH - 260, 75, C.COLORS.LIGHT, 18);
    if (game.currentMissionIdx < C.MISSIONS.length) {
      const m = C.MISSIONS[game.currentMissionIdx];
      Draw.text(`Mission: ${m.title}`, 20, C.HEIGHT - 90, C.COLORS.ORANGE, 18, "bold");
      Draw.text(`Progress: ${game.missionProgress}/${m.target}`, 20, C.HEIGHT - 60, C.COLORS.LIGHT, 18);
    }
    if (game.message) {
      Draw.text(game.message, C.WIDTH / 2, C.HEIGHT - 30, C.COLORS.YELLOW, 16, "normal", "center");
    }
  },

  drawGameOver(game) {
    const Draw = window.LastLine.Draw;
    const C = window.LastLine.CONFIG;
    Draw.background();
    Draw.text("MISSION FAILED", C.WIDTH / 2, 180, C.COLORS.RED, 48, "bold", "center");
    Draw.text(`Wave: ${game.wave}`, C.WIDTH / 2, 260, C.COLORS.WHITE, 24, "normal", "center");
    Draw.text(`Level: ${game.player.level}`, C.WIDTH / 2, 300, C.COLORS.WHITE, 24, "normal", "center");
    Draw.text(`Kills: ${game.player.kills}`, C.WIDTH / 2, 340, C.COLORS.WHITE, 24, "normal", "center");
    Draw.text(`Time: ${Math.floor(game.gameTimer)}s`, C.WIDTH / 2, 380, C.COLORS.WHITE, 24, "normal", "center");
    Draw.text("Press R to restart or Esc to menu", C.WIDTH / 2, 520, C.COLORS.LIGHT, 16, "normal", "center");
  }
};