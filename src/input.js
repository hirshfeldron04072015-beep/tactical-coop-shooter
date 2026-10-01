window.LastLine = window.LastLine || {};

window.LastLine.Input = {
  keys: {},
  mouse: { x: 640, y: 360, down: false },
  setKey(code, value) {
    this.keys[code] = value;
  },
  isDown(code) {
    return !!this.keys[code];
  },
  updateMouseFromEvent(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    this.mouse.x = (event.clientX - rect.left) * scaleX;
    this.mouse.y = (event.clientY - rect.top) * scaleY;
  }
};

window.addEventListener("keydown", (event) => {
  window.LastLine.Input.setKey(event.code, true);
});

window.addEventListener("keyup", (event) => {
  window.LastLine.Input.setKey(event.code, false);
});

document.addEventListener("mousemove", (event) => {
  if (!window.LastLine.canvas) return;
  window.LastLine.Input.updateMouseFromEvent(event, window.LastLine.canvas);
});

document.addEventListener("mousedown", () => {
  window.LastLine.Input.mouse.down = true;
});

document.addEventListener("mouseup", () => {
  window.LastLine.Input.mouse.down = false;
});