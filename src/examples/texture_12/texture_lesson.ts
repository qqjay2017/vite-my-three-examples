import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { earthTexture } from "/@/assets/textures/earth/earthTexture";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(3, 3, 3);
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(earthTexture.earth_atmos_2048);
  }

  createObjects(): void {
    if (!this.textureLoader || !this.cubeTextureLoader) {
      return;
    }

    const boxGeometry = new THREE.SphereGeometry(4, 64, 32);

    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshStandardMaterial({
        map: this.texture,
      })
    );

    boxMesh.position.set(5, 0, 0);

    const envTexture = this.cubeTextureLoader.load([
      earthTexture.left,
      earthTexture.right,
      earthTexture.top,
      earthTexture.bottom,
      earthTexture.front,
      earthTexture.back,
    ]);

    const normalTexture = this.textureLoader.load(
      earthTexture.earth_normal_2048
    );
    const specularTexture = this.textureLoader.load(
      earthTexture.earth_specular_2048
    );

    const boxGeometry1 = new THREE.SphereGeometry(4, 64, 32);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshPhongMaterial({
        // envMap: envTexture,
        map: this.texture,

        // normalMap: normalTexture,

        specularMap: specularTexture,

        // 材质的高光颜色。默认值为0x111111（深灰色）的颜色Color。 这定义了材质的光泽度和光泽的颜色。
        specular: new THREE.Color(0x00ffff),

        // .specular高亮的程度，越高的值越闪亮。默认值为 30。
        shininess: 30,
      })
    );

    this.mesh.position.set(-5, 0, 0);

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

    // 环境贴图的强度
    gui.add(this.mesh.material as any, "shininess", 0, 100, 1);
    gui.addColor(this.mesh.material as any, "specular");
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
