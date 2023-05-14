import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Warning_Sign_HighVoltage_001 } from "/@/assets/textures/Warning_Sign_HighVoltage_001";
import { fullscreen } from "/@/assets/textures/fullscreen";
export class MaterialLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;

  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 2);
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_basecolor
    );
    this.texture.colorSpace = THREE.SRGBColorSpace;

    // this.texture.magFilter = THREE.NearestFilter;
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }

    const boxGeometry = new THREE.SphereGeometry(0.5, 16, 64);

    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshStandardMaterial({
        map: this.texture,
      })
    );

    boxMesh.position.set(1, 0, 0);

    const aoTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_ambientOcclusion
    );
    const displacementTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_height
    );
    const normalTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_normal
    );
    const roughnessTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_metallic
    );
    const metalnessTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_metallic
    );
    const boxGeometry1 = new THREE.SphereGeometry(0.5, 16, 64);
    const standardMaterial = new THREE.MeshStandardMaterial({
      map: this.texture,
      envMap: this.cubeTextureLoader?.load([
        fullscreen.left1,
        fullscreen.right1,
        fullscreen.top1,
        fullscreen.bottom1,
        fullscreen.front1,
        fullscreen.back1,
      ]),
      envMapIntensity: 1.0,

      bumpMap: displacementTexture,
      displacementMap: displacementTexture,
      displacementScale: 0,
      normalMap: normalTexture,
      aoMap: aoTexture,
      roughnessMap: roughnessTexture,
      metalnessMap: metalnessTexture,
      metalness: 0,
      roughness: 0,
      // normalScale: new THREE.Vector2(1, 1),
    });

    this.mesh = new THREE.Mesh(boxGeometry1, standardMaterial);

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

    //  .metalness : Float 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，
    gui.add(this.mesh.material as any, "metalness", 0, 1, 0.05);
    // .roughness : Float 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供
    gui.add(this.mesh.material as any, "roughness", 0, 1, 0.05);
    // 环境贴图影响
    gui.add(this.mesh.material as any, "envMapIntensity", 0, 1, 0.05);
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