import { camera } from "./camera";
import { controls } from "./controls";
import { renderer } from "./renderer";
import { scene } from "./scene";
import { axesHelper } from "./helper";
import { addBufferGeometry } from "./mesh";
import { clock } from "./clock";

export class BuffergeometryRawshader {
  camera = camera;
  controls = controls;
  scene = scene;
  clock = clock;
  renderer = renderer;
  constructor() {
    this.init();
  }
  init() {
    // this.scene.add(this.camera);

    // this.scene.add(axesHelper);

    addBufferGeometry(this.scene);
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }
  resizeHandle() {
    this.camera.aspect = window.innerWidth / innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  animate() {
    // let time = this.clock.getElapsedTime()
    //
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    // this.controls.update();
    // this.camera.updateProjectionMatrix();
    // // 修复this指向

    // this.renderer.render(this.scene, this.camera);
  }
  render() {
    const time = clock.getElapsedTime();

    const object: any = this.scene.children.find((c) => c.type === "Mesh");
    console.log(object, "object");
    if (object) {
      object.rotation.y = time * 0.5;
      object.material.uniforms.time.value = time * 0.5;
    }
    this.controls.update();
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
