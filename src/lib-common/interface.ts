import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//  | THREE.Camera

export interface ThreeInstanceBaseType<C = THREE.OrthographicCamera> {
  canvas: HTMLElement | null;
  width: number;
  height: number;
  scene: THREE.Scene | null;
  camera: C | null;
  renderer: THREE.WebGLRenderer | null;
  orbitControls: OrbitControls | null;
  init: () => void;
  createScene: () => void;
  createLights: () => void;
  createObjects: () => void;
  helpers: () => void;
  createCamera: () => void;
  render: () => void;
  controls: () => void;
  animate: () => void;
  fitView: () => void;
}
