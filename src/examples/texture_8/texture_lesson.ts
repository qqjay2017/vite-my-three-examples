import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Wood_Ceiling_Coffers_003 } from "/@/assets/textures/Wood_Ceiling_Coffers_003";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.scene?.add(ambientLight, directionalLight);
  }
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
    if (!this.textureLoader) {
      return;
    }

    const boxGeometry = new THREE.SphereGeometry(4, 16, 32);

    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshBasicMaterial({
        map: this.texture,
      })
    );

    boxMesh.position.set(5, 0, 0);

    const narmalTexture = this.textureLoader.load(
      Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_normal
    );
    const boxGeometry1 = new THREE.SphereGeometry(4, 32, 16);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshPhongMaterial({
        map: this.texture,
        normalMap: narmalTexture,
        // normalScale: new THREE.Vector2(1, 1),
      })
    );

    this.mesh.position.set(-5, 0, 0);
    console.log(
      "%ctexture_lesson.ts line:57  this.mesh",
      "color: #007acc;",
      this.mesh
    );

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
    const params = {
      normalScaleX: 1,
      normalScaleY: 1,
    };
    gui.add(params, "normalScaleX", 0, 1, 0.1).onChange(() => {
      if (!this.mesh) {
        return;
      }

      (this.mesh.material as any).normalScale = new THREE.Vector2(
        params.normalScaleX,
        params.normalScaleY
      );
    });
    gui.add(params, "normalScaleY", 0, 1, 0.1).onChange(() => {
      if (!this.mesh) {
        return;
      }
      (this.mesh.material as any).normalScale = new THREE.Vector2(
        params.normalScaleX,
        params.normalScaleY
      );
    });
    this.guiInstance = gui;
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
