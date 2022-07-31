import { addBufferGeometry } from "./mesh";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class BuffergeometryRawshader {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // // 背景色透明
    // alpha: false,
  });
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  scene = new THREE.Scene();

  clock = new THREE.Clock();

  mesh: THREE.Mesh | null = null;
  constructor() {
    this.init();
  }

  init() {
    this.initCamera();
    this.initControls();
    this.initRender();
    this.initScene();
    // this.scene.add(this.camera);

    // this.scene.add(axesHelper);

    this.mesh = addBufferGeometry(this.scene);
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }
  initCamera() {
    this.camera.position.z = 2;
  }
  initControls() {
    this.controls.enableDamping = true;
    //  this.controls.minDistance = 0;
    //   this.controls.maxDistance = 2500;
  }
  initRender() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.physicallyCorrectLights = true;
  }
  initScene() {
    this.scene.background = new THREE.Color(0x101010);
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
    const time = this.clock.getElapsedTime();

    const object: any = this.scene.children.find((c) => c.type === "Mesh");
    // console.log(object, "object");
    if (object) {
      object.rotation.y = time * 0.5;
      object.material.uniforms.time.value = time * 0.5;
    }
    this.controls.update();
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.mesh?.remove();
    this.scene.remove();

    this.renderer.dispose();
  }
}
