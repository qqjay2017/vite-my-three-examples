import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg`
    );
    // 宽和高必须是2的倍数
    this.texture.repeat.set(2, 2);
    // 默认值ClampToEdgeWrapping ,会拉升
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    // 阵列模式 重复两次
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    // 镜像模式 以中间为分界线
    this.texture.wrapS = THREE.MirroredRepeatWrapping;
    this.texture.wrapT = THREE.MirroredRepeatWrapping;
    // 纹理偏离
    // this.texture.offset = new THREE.Vector2(0.5, 0);
    // 纹理旋转
    this.texture.rotation = Math.PI / 15;
    // 纹理的中心点(旋转中心)
    this.texture.center.set(0.5, 0.5);
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }

    const boxGeometry = new THREE.BoxGeometry(4, 4, 4);

    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshStandardMaterial({
        map: this.texture,
      })
    );

    boxMesh.position.set(5, 0, 0);
    const aoTexture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_ambientOcclusion.jpg`
    );
    const displacementTexture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png`
    );
    const normalTexture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg`
    );
    const roughnessTexture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg`
    );
    const metalnessTexture = this.textureLoader.load(
      `/@/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg`
    );
    const boxGeometry1 = new THREE.BoxGeometry(4, 4, 4);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshStandardMaterial({
        map: this.texture,
        bumpMap: displacementTexture,
        displacementMap: displacementTexture,
        displacementScale: 0,
        normalMap: normalTexture,
        aoMap: aoTexture,
        roughnessMap: roughnessTexture,
        metalnessMap: metalnessTexture,
        metalness: 0,
        roughness: 1,
        // normalScale: new THREE.Vector2(1, 1),
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
    if (!this.mesh || !this.texture) {
      return;
    }
    const _that = this;
    const gui = new dat.GUI();

    gui.add(this.texture.repeat, "x", 0, 10, 0.1).name("repeatX");
    gui.add(this.texture.repeat, "y", 0, 10, 0.1).name("repeatY");
    gui
      .add(this.texture, "wrapS", {
        ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
        RepeatWrapping: THREE.RepeatWrapping,
        MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
      })
      .onChange((val) => {
        if (!_that.mesh || !_that.texture) {
          return;
        }
        _that.texture.wrapS = val;
        _that.texture.needsUpdate = true;
      })
      .name("wrapS");
    gui
      .add(this.texture, "wrapT", {
        ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
        RepeatWrapping: THREE.RepeatWrapping,
        MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
      })
      .onChange((val) => {
        if (!_that.mesh || !_that.texture) {
          return;
        }
        _that.texture.wrapT = val;
        _that.texture.needsUpdate = true;
      })
      .name("wrapS");

    gui.add(this.texture.offset, "x", 0, 1, 0.1).name("offsetX");
    gui.add(this.texture.offset, "y", 0, 1, 0.1).name("offsetY");
    gui.add(this.texture.center, "y", 0, 1, 0.1).name("centerY");
    gui.add(this.texture.center, "y", 0, 1, 0.1).name("centerY");
    gui.add(this.texture, "rotation", -Math.PI, Math.PI, 0.01).name("rotation");
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
