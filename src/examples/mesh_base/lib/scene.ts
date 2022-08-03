import * as THREE from "three";

export function getScene() {
  const scene = new THREE.Scene();
  const textureCubeLoader = new THREE.CubeTextureLoader()
  // 设置默认路径
  // textureCubeLoader.setPath()
 const textureCube =  textureCubeLoader.load([
    './textures/env/1.jpg',
    './textures/env/2.jpg',
    './textures/env/3.jpg',
    './textures/env/4.jpg',
    './textures/env/5.jpg',
    './textures/env/6.jpg',
 
  ])
  scene.environment = textureCube;
  scene.background = textureCube;
  return scene;
}
