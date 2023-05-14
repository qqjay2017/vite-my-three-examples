import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Warning_Sign_HighVoltage_001 } from "/@/assets/textures/Warning_Sign_HighVoltage_001";
import { fullscreen } from "/@/assets/textures/fullscreen";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { floor_tiles_06 } from "/@/assets/textures/floor_tiles_06";
import { large_sandstone_blocks } from "/@/assets/textures/large_sandstone_blocks";

export class MaterialLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  wallTexture: THREE.Texture | null = null;
  hdrLoading = new RGBELoader();
  sanHdrTexture: THREE.DataTexture | null = null;
  directionalLight: THREE.DirectionalLight | null = null;

  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-3, 3, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 1.5;
    directionalLight.shadow.mapSize.x = 1024;
    directionalLight.shadow.mapSize.y = 1024;
    this.directionalLight = directionalLight;
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader || !this.scene) {
      return;
    }
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.texture = this.textureLoader.load(
      floor_tiles_06.floor_tiles_06_diff_2k
    );
    this.wallTexture = this.textureLoader.load(
      large_sandstone_blocks.large_sandstone_blocks_diff_2k
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
        color: 0x1890ff,
      })
    );
    boxMesh.castShadow = true;

    boxMesh.position.set(-1, 0, 1);
    const ShadowMaterial1 = new THREE.ShadowMaterial({
      // 阴影的透明度
      opacity: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),

      new THREE.MeshBasicMaterial({
        map: this.texture,
      })
    );
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),

      new THREE.MeshBasicMaterial({
        map: this.wallTexture,
      })
    );

    const planeShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      ShadowMaterial1
      // new THREE.MeshBasicMaterial({
      //   side: THREE.DoubleSide,
      // })
    );
    const wallSahdow = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      ShadowMaterial1
    );
    planeShadow.receiveShadow = true;
    wallSahdow.receiveShadow = true;
    planeShadow.rotation.x = -Math.PI / 2;
    planeShadow.position.y = -0.8;
    planeShadow.position.z = 3;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.8;
    floor.position.z = 3;
    this.mesh = boxMesh;

    this.scene?.add(boxMesh, planeShadow, floor, wall, wallSahdow);
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

    if (this.directionalLight?.position) {
      const lightFolder = gui.addFolder("光照");
      lightFolder.add(this.directionalLight.position, "x", -10, 10, 0.1);
      lightFolder.add(this.directionalLight.position, "y", -10, 10, 0.1);
      lightFolder.add(this.directionalLight.position, "z", -10, 10, 0.1);
      lightFolder.add(this.directionalLight, "intensity", 0, 1, 0.05);
    }

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
