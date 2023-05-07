import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";

import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(`/@/assets/textures/sword.png`);
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }
    const cylinderGeometry = new THREE.BoxGeometry(1, 1, 1);
    const texture1 = this.textureLoader?.load(`/@/assets/textures/sword.png`);
    console.log(
      "%ctexture_lesson.ts line:22 texture1",
      "color: #007acc;",
      texture1
    );

    // magFilter  https://threejs.org/docs/index.html#api/zh/textures/Texture
    // minFilter
    texture1.magFilter = THREE.NearestFilter;
    this.mesh = new THREE.Mesh(
      cylinderGeometry,
      new THREE.MeshLambertMaterial({
        map: texture1,
      })
    );
    this.mesh.position.set(0, 0, 0);

    this.scene?.add(this.mesh);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const texture2 = this.textureLoader?.load(`/@/assets/textures/sword.png`);
    const boxtMaterial = boxGeometry.groups.map((g, index) => {
      return new THREE.MeshStandardMaterial({
        map: texture2,
      });
    });

    const boxMesh = new THREE.Mesh(boxGeometry, boxtMaterial);

    boxMesh.position.set(3, 0, 3);

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
