import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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
      `/@/assets/textures/fullscreen/1.left.jpg`,
      `/@/assets/textures/fullscreen/1.right.jpg`,
      `/@/assets/textures/fullscreen/1.top.jpg`,
      `/@/assets/textures/fullscreen/1.bottom.jpg`,
      `/@/assets/textures/fullscreen/1.front.jpg`,
      `/@/assets/textures/fullscreen/1.back.jpg`,
    ]);
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
    const boxGeometry1 = new THREE.SphereGeometry(4, 64, 32);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshStandardMaterial({
        envMap: envTexture,
        map: this.texture,
        bumpMap: displacementTexture,
        displacementMap: displacementTexture,
        displacementScale: 0,
        normalMap: normalTexture,
        aoMap: aoTexture,
        roughnessMap: roughnessTexture,
        metalnessMap: metalnessTexture,
        metalness: 1,
        roughness: 0.1,
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
    if (!this.mesh) {
      return;
    }
    const gui = new dat.GUI();
    //  .metalness : Float 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，
    gui.add(this.mesh.material as any, "metalness", 0, 1, 0.05);
    // .roughness : Float 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供
    gui.add(this.mesh.material as any, "roughness", 0, 1, 0.05);
    // 环境贴图的强度
    gui.add(this.mesh.material as any, "envMapIntensity", 0, 2, 0.05);
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
