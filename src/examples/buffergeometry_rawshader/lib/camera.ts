import * as THREE from "three";
export const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  100
);
// camera.position.set(14, 16, 10);
camera.position.z = 2;
