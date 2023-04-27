import * as THREE from "three";

export function getRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    // // 背景色透明
    // alpha: false,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // renderer.physicallyCorrectLights = true;
  return renderer;
}
