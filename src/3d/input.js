window.LastLine = window.LastLine || {};
window.LastLine.Input = {
  keys: {},
  mouse: { x: 0, y: 0, down: false, deltaX: 0, deltaY: 0 },
  isDown(code) { return !!this.keys[code]; },
  init() {
    document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
    document.addEventListener('mousemove', (e) => {
      this.mouse.deltaX = e.movementX || 0;
      this.mouse.deltaY = e.movementY || 0;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    document.addEventListener('mousedown', () => { this.mouse.down = true; });
    document.addEventListener('mouseup', () => { this.mouse.down = false; });
  }
};