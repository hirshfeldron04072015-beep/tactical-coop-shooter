window.LastLine = window.LastLine || {};

window.LastLine.Weapon = {
  getWeaponData(slot, name) {
    return window.LastLine.WEAPONS[slot] ? window.LastLine.WEAPONS[slot][name] : null;
  },
  canUnlock(player, slot, name) {
    const data = this.getWeaponData(slot, name);
    if (!data) return false;
    const C = window.LastLine.CONFIG;
    return data.unlockKey <= player.keys || Object.values(C.STARTER_LOADOUT).includes(name);
  }
};