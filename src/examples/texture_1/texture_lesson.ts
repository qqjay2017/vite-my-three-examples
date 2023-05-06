import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";

import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  loadTextures() {
    // 1. 使用 Image() 加载
    // const img = new Image();
    // const texture = new THREE.Texture(img);

    // img.onload = function () {
    //   console.log(
    //     "%ctexture_lesson.ts line:16 texture",
    //     "color: #007acc;",
    //     texture
    //   );
    //   texture.needsUpdate = true;
    // };
    // img.onerror = function () {
    //   console.log("Error loading texture.");
    // };
    // img.setAttribute("crossOrigin", "anonymous");
    // img.src =
    //   "/@/assets/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg";

    // 2. 使用TextureLoader 加载
    // const textureLoader = new THREE.TextureLoader();

    // this.texture = textureLoader.setCrossOrigin("anonymous").load(
    //   `/@/assets/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg`,
    //   (texture) => {},
    //   (e) => {
    //     console.log("%ctexture_lesson.ts line:39 e", "color: #007acc;", e);
    //   },
    //   (e) => {}
    // );

    // 3. 使用LoadingManager加载
    if (!this.loadingManager) {
      return;
    }

    const loader = new THREE.TextureLoader(this.loadingManager);
    this.texture = loader.load(
      `/@/assets/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg`
    );
  }

  createObjects(): void {
    const boxGeometry = new THREE.CylinderGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({
      // color: 0xffffff * Math.random(),
      map: this.texture,
    });
    this.mesh = new THREE.Mesh(boxGeometry, material);

    this.scene?.add(this.mesh);
  }

  animate(): void {
    const _that = this;
    if (!_that.scene || !_that.watcherCamera) {
      return;
    }
    _that.orbitControls?.update();
    _that.cameraHelper?.update();
    _that.render();
    requestAnimationFrame(() => {
      _that.animate();
    });
  }

  init(): void {
    this.createScene();
    this.createLights();
    this.createLoadingManager();
    this.loadTextures();
    this.createObjects();

    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.animate();
    this.fitView();
  }
}
