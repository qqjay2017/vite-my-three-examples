import * as THREE from "three";

export function getRenderer() {
  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // renderer.physicallyCorrectLights = true;



  return renderer;
}
