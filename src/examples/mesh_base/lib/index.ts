import { camera } from "./camera";
import { controls } from "./controls";
import { renderer } from "./renderer";
import { scene } from "./scene";
import { axesHelper } from "./helper";
import { addCube } from "./mesh";

export class MeshBase {
  camera = camera;
  controls = controls;
  scene = scene;
  renderer = renderer;
  constructor() {
    this.init();
  }
  init() {
    this.scene.add(this.camera);

    this.scene.add(axesHelper);
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
