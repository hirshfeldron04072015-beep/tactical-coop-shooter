window.LastLine = window.LastLine || {};

window.LastLine.Input = {
  keys: {},
  mouse: { x: 0, y: 0, delta: { x: 0, y: 0 } },
  pointerLocked: false,

  init() {
    document.addEventListener('keydown', (e) => {
      window.LastLine.Input.keys[e.code] = true;
    });
    document.addEventListener('keyup', (e) => {
      window.LastLine.Input.keys[e.code] = false;
    });
    document.addEventListener('mousemove', (e) => {
      if (window.LastLine.Input.pointerLocked) {
        window.LastLine.Input.mouse.delta.x = e.movementX;
        window.LastLine.Input.mouse.delta.y = e.movementY;
      }
      window.LastLine.Input.mouse.x = e.clientX;
      window.LastLine.Input.mouse.y = e.clientY;
    });
    document.addEventListener('click', () => {
      if (!window.LastLine.Input.pointerLocked) {
        document.body.requestPointerLock();
      }
    });
  },

  isPressed: (code) => window.LastLine.Input.keys[code] || false,

  getMovementInput: () => ({
    forward: window.LastLine.Input.isPressed('KeyW') || window.LastLine.Input.isPressed('ArrowUp'),
    backward: window.LastLine.Input.isPressed('KeyS') || window.LastLine.Input.isPressed('ArrowDown'),
    left: window.LastLine.Input.isPressed('KeyA') || window.LastLine.Input.isPressed('ArrowLeft'),
    right: window.LastLine.Input.isPressed('KeyD') || window.LastLine.Input.isPressed('ArrowRight'),
    sprint: window.LastLine.Input.isPressed('ShiftLeft') || window.LastLine.Input.isPressed('ShiftRight'),
    jump: window.LastLine.Input.isPressed('Space'),
    melee: window.LastLine.Input.isPressed('KeyF'),
  }),
};
