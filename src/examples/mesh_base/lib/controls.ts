import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { camera } from "./camera";
import { renderer } from "./renderer";

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0;
controls.maxDistance = 2500;
