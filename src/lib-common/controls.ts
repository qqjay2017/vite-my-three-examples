import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function getControls(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer
) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0;
  controls.maxDistance = 2500;

  return controls;
}
