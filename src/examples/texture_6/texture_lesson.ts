import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(
      `/@/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg`
    );
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshBasicMaterial({
        map: this.texture,
      })
    );

    boxMesh.position.set(1, 0, 0);

    const bumpTexture = this.textureLoader.load(
      `/@/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png`
    );
    const boxGeometry1 = new THREE.BoxGeometry(1, 1, 1);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshLambertMaterial({
        map: this.texture,
        bumpMap: bumpTexture,
        bumpScale: 2,
      })
    );

    this.mesh.position.set(-1, 0, 0);

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
  gui() {
    if (!this.mesh) {
      return;
    }
    const gui = new dat.GUI();
    gui.add(this.mesh.material as any, "bumpScale", 0, 13, 0.1);
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
    this.gui();
  }
}
