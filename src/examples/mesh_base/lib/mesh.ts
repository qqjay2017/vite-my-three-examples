import * as THREE from "three";

export function addCube(scene: THREE.Scene) {
  // const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  const sphere = new THREE.SphereGeometry(5, 10, 100);
  const cubeMaterial = new THREE.MeshStandardMaterial({ 
    // color: 0x00ff00, 
    roughness:0.1,
    // transparent:true,
    metalness:0.8,
  });
  const cube = new THREE.Mesh(sphere, cubeMaterial);
  cube.position.set(0, 0, 0);
  scene.add(cube);
  return cube;
}
