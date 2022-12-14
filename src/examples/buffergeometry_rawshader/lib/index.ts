import { addBufferGeometry } from "./mesh";

import { getCamera } from "/@/lib-common/camera";
import { getRenderer } from "/@/lib-common/renderer";
import { getControls } from "/@/lib-common/controls";
import { getScene } from "/@/lib-common/scene";
import { getClock } from "/@/lib-common/clock";
import { getAxesHelper } from "/@/lib-common/helper";
export class BuffergeometryRawshader {
  camera = getCamera();
  renderer = getRenderer();
  controls = getControls(this.camera, this.renderer);
  scene = getScene();

  clock = getClock();

  constructor() {
    this.init();
  }

  init() {
    this.scene.add(getAxesHelper());
    addBufferGeometry(this.scene);
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }

  resizeHandle() {
    this.camera.aspect = window.innerWidth / innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
  render() {
    const time = this.clock.getElapsedTime();

    const object: any = this.scene.children.find((c) => c.type === "Mesh");

    if (object) {
      object.rotation.y = time * 0.5;
      object.material.uniforms.time.value = time * 0.5;
    }
    this.controls.update();
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
