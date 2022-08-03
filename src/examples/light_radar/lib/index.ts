import { addLightRadar } from "./mesh";

import { getCamera } from "/@/lib-common/camera";
import { getRenderer } from "/@/lib-common/renderer";
import { getControls } from "/@/lib-common/controls";
import { getScene } from "/@/lib-common/scene";
import { getClock } from "/@/lib-common/clock";
import { getAxesHelper } from "/@/lib-common/helper";
import { addCube } from "../../mesh_base/lib/mesh";
export class LightRadar {
  camera = getCamera({
    x: 60,
    y: 50,
    z: 19,
  });
  renderer = getRenderer();
  controls = getControls(this.camera, this.renderer);
  scene = getScene();

  clock = getClock();

  constructor() {
    this.init();
  }

  init() {
    this.scene.add(getAxesHelper());
    // addCube(this.scene);
    addLightRadar({
      scene: this.scene,
      
      position:{
        x:0,
        z:0
      }
    });
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }

  resizeHandle() {
    console.log(this.camera);
    this.camera.aspect = window.innerWidth / innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
  render() {
    const uTime = this.clock.getElapsedTime();
    this.controls.update();
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
