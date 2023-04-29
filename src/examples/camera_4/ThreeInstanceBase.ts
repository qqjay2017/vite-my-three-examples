import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeInstanceBase {
  canvas: HTMLElement | null = null;
  width = window.innerWidth;
  height = window.innerHeight;
  scene: THREE.Scene | null = null;

  watcherCamera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null =
    null;

  renderer: THREE.WebGLRenderer | null = null;
  orbitControls: OrbitControls | null = null;
  dragControls: DragControls | null = null;
  cameraHelper: THREE.CameraHelper | null = null;

  createScene() {}
  createCamera() {}
  createObjects() {}
  createLights() {}
  helpers() {}
  controls() {}
  render() {}
  animate() {}
  fitView() {}
  gui() {}
  init() {}
}
