import * as THREE from "three";

export function getRenderer(parameters?:THREE.WebGLRendererParameters | undefined) {
  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true,
    ...parameters
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // renderer.physicallyCorrectLights = true;



  return renderer;
}
