import * as THREE from "three";
export function getCamera() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    50000
  );
  camera.position.set(14, 16, 10);
  return camera;
}
