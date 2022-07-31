import { getCamera } from "./camera";
import { getControls } from "./controls";
import { getRenderer } from "./renderer";
import { getScene } from "./scene";

import { addCube } from "./mesh";
import { getAxesHelper } from "./helper";
export class MeshBase {
  camera = getCamera();

  scene = getScene();
  renderer = getRenderer();
  controls = getControls(this.camera, this.renderer);
  constructor() {
    this.init();
  }
  init() {
    this.scene.add(this.camera);

    this.scene.add(getAxesHelper());
    addCube(this.scene);
    window.addEventListener("resize", this.resizeHandle);
  }
  resizeHandle() {
    this.camera.aspect = window.innerWidth / innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  animate() {
    // let time = this.clock.getElapsedTime()
    // console.log(time)
    this.controls.update();
    this.camera.updateProjectionMatrix();
    // 修复this指向
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
