window.LastLine = window.LastLine || {};

window.LastLine.Effects = {
  muzzleFlashes: [],
  bloodSplats: [],

  createMuzzleFlash(position, camera) {
    const flash = {
      position: position.clone(),
      intensity: 1.0,
      life: 0.1,
    };
    this.muzzleFlashes.push(flash);
  },

  createBloodSplat(position, scene) {
    const geom = new THREE.SphereGeometry(0.15, 4, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x880000,
      emissive: 0x440000,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(position);
    scene.add(mesh);

    this.bloodSplats.push({
      mesh,
      life: 3.0,
    });
  },

  update(dt) {
    this.muzzleFlashes = this.muzzleFlashes.filter(flash => {
      flash.life -= dt;
      return flash.life > 0;
    });

    this.bloodSplats = this.bloodSplats.filter(splat => {
      splat.life -= dt;
      splat.mesh.material.opacity = splat.life / 3.0;
      return splat.life > 0;
    });
  },
};
