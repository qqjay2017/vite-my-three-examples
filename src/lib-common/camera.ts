import * as THREE from "three";
export function getCamera({ x = 0, y = 0, z = 2 } = {}) {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  // camera.position.set(14, 16, 10);
  if (z) {
    camera.position.z = z;
  }
  if (x) {
    camera.position.x = x;
  }
  if (y) {
    camera.position.y = y;
  }

  return camera;
}
