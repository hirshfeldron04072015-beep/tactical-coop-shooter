window.LastLine = window.LastLine || {};

window.LastLine.MissionManager = class {
  constructor() {
    this.currentMission = 0;
    this.progress = 0;
    this.started = false;
  }

  init() {
    this.currentMission = 0;
    this.progress = 0;
    this.started = true;
  }

  getCurrentMission() {
    const C = window.LastLine.CONFIG;
    return C.MISSIONS[this.currentMission] || null;
  }

  checkComplete() {
    const mission = this.getCurrentMission();
    if (!mission) return false;
    if (mission.type === "kills") return this.progress >= mission.target;
    return false;
  }

  complete(game, onReward) {
    const mission = this.getCurrentMission();
    if (!mission) return;
    game.player.keys += mission.rewardKeys;
    game.player.addXP(mission.rewardXp);
    if (onReward) onReward(mission);
    this.currentMission += 1;
    this.progress = 0;
    this.started = this.currentMission < window.LastLine.CONFIG.MISSIONS.length;
  }
};