window.LastLine = window.LastLine || {};
window.LastLine.Camera = class {
  constructor(player) {
    this.player = player;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 1.7, 0);
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.add(this.pitchObject);
    this.pitchObject.add(this.camera);
    this.sensitivity = 0.002;
  }
  update() {
    const Input = window.LastLine.Input;
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.rotateY(-Input.mouse.deltaX * this.sensitivity);
    this.euler.rotateX(-Input.mouse.deltaY * this.sensitivity);
    const M = window.LastLine.Math;
    this.euler.x = M.clamp(this.euler.x, -Math.PI / 2, Math.PI / 2);
    this.camera.quaternion.setFromEuler(this.euler);
    this.yawObject.position.copy(this.player.position);
    this.yawObject.position.y += 1.7;
  }
  getDirection() {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }
};