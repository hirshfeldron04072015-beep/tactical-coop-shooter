window.LastLine = window.LastLine || {};
window.LastLine.Effects = {
  createExplosion(scene, position) {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 4, 4), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
    particle.position.copy(position);
    particle.castShadow = true;
    scene.add(particle);
    let life = 0.3;
    const update = () => {
      life -= 0.016;
      particle.scale.multiplyScalar(0.98);
      particle.material.opacity = life / 0.3;
      if (life > 0) requestAnimationFrame(update);
      else scene.remove(particle);
    };
    update();
  },
  flashScreen(intensity = 0.5) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: ${intensity}; pointer-events: none;`;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.remove(); }, 100);
  }
};