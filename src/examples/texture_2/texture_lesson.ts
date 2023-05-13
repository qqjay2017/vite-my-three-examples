import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";

import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Wood_Ceiling_Coffers_003 } from "/@/assets/textures/Wood_Ceiling_Coffers_003";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(
      Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_basecolor
    );
  }

  createObjects(): void {
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1);

    this.mesh = new THREE.Mesh(
      cylinderGeometry,
      new THREE.MeshLambertMaterial({
        color: 0xffffff * Math.random(),
        map: this.texture,
      })
    );

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    // 不同的面,不同的贴图
    const boxtMaterial = new THREE.MeshStandardMaterial({
      // color: 0xffffff * Math.random(),
      map: this.textureLoader?.load(
        Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_basecolor
      ),
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxtMaterial);

    boxMesh.position.set(3, 0, 0);

    this.scene?.add(this.mesh, boxMesh);
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
