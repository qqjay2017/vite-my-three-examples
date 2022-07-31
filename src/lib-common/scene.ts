import * as THREE from "three";

export function getScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);
  return scene;
}
