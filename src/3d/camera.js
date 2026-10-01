window.LastLine = window.LastLine || {};

window.LastLine.Camera = class {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      window.LastLine.Config.FOV,
      window.innerWidth / window.innerHeight,
      window.LastLine.Config.NEAR,
      window.LastLine.Config.FAR
    );
    this.camera.position.set(0, 5, 0);
    this.pitch = 0;
    this.yaw = 0;
    this.crouching = false;
  }

  update(player, dt) {
    const input = window.LastLine.Input;
    if (input.pointerLocked) {
      this.yaw -= input.mouse.delta.x * 0.003;
      this.pitch -= input.mouse.delta.y * 0.003;
      this.pitch = window.LastLine.Math.clamp(this.pitch, -Math.PI / 2, Math.PI / 2);
      input.mouse.delta.x = 0;
      input.mouse.delta.y = 0;
    }

    const targetHeight = player.isCrouching ? window.LastLine.Config.PLAYER_CROUCH_HEIGHT : window.LastLine.Config.PLAYER_HEIGHT;
    this.camera.position.copy(player.position);
    this.camera.position.y += targetHeight * 0.9;
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
};
