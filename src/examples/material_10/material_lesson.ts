import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Warning_Sign_HighVoltage_001 } from "/@/assets/textures/Warning_Sign_HighVoltage_001";
import { fullscreen } from "/@/assets/textures/fullscreen";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export class MaterialLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  hdrLoading = new RGBELoader();
  sanHdrTexture: THREE.DataTexture | null = null;

  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 2);
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader || !this.scene) {
      return;
    }

    this.texture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_basecolor
    );
    // this.texture.magFilter = THREE.NearestFilter;
    this.sanHdrTexture = this.hdrLoading.load(
      "/textures/rectangular/san_giuseppe_bridge_2k.hdr",
      () => {
        if (this.scene && this.sanHdrTexture) {
          this.scene.background = this.sanHdrTexture;
          // 反射映射
          this.sanHdrTexture.mapping = THREE.EquirectangularReflectionMapping;
          // 折射映射
          // this.sanHdrTexture.mapping = THREE.EquirectangularRefractionMapping;
          // 为所有物体设置环境贴图
          this.scene.environment = this.sanHdrTexture;
          // 背景模糊
          this.scene.backgroundBlurriness = 0.01;
          // 背景强度
          this.scene.backgroundIntensity = 0.5;
        }
      }
    );
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }

    const boxGeometry = new THREE.SphereGeometry(0.5, 16, 64);
    const metalnessTexture = this.textureLoader.load(
      Warning_Sign_HighVoltage_001.Warning_Sign_HighVoltage_001_metallic
    );
    const boxMesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshStandardMaterial({
        map: this.texture,
        // envMap: this.sanHdrTexture,
        metalnessMap: metalnessTexture,
        metalness: 1,
        roughness: 0,
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

    const boxGeometry1 = new THREE.SphereGeometry(0.5, 16, 64);

    this.mesh = new THREE.Mesh(
      boxGeometry1,
      new THREE.MeshPhysicalMaterial({
        map: this.texture,
        // envMap: this.sanHdrTexture,
        // envMapIntensity: 1.0,
        // bumpMap: displacementTexture,
        // displacementMap: displacementTexture,
        // displacementScale: 0,
        // / normalMap: normalTexture,
        // aoMap: aoTexture,
        // roughnessMap: roughnessTexture,
        // metalnessMap: metalnessTexture,

        emissive: 0x000000,
        roughnessMap: roughnessTexture,

        metalness: 1,
        roughness: 0.1,
        // 独有的特性,

        reflectivity: 1,
        // 具有反光特性 ,放射率
        clearcoat: 0,
        clearcoatRoughness: 0,
        fog: true,

        //         .ior : Float  为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5。
        ior: 1,
        // 曲面下体积的厚度
        thickness: 1,

        // 球体的厚薄程度
        transmission: 1,
        // normalScale: new THREE.Vector2(1, 1),
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

    //  .metalness : Float 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，
    gui.add(this.mesh.material as any, "metalness", 0, 1, 0.05);
    // .roughness : Float 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供
    gui.add(this.mesh.material as any, "roughness", 0, 1, 0.05);
    // 环境贴图影响
    gui.add(this.mesh.material as any, "envMapIntensity", 0, 1, 0.05);
    gui.add(this.mesh.material as any, "clearcoat", 0, 1, 0.05);
    gui.add(this.mesh.material as any, "transmission", 0, 1, 0.05);
    gui.add(this.mesh.material as any, "reflectivity", 0, 1, 0.05);
    gui.add(this.mesh.material as any, "ior", 1, 2.333, 0.05);
    if (this.scene) {
      gui.add(this.scene, "backgroundBlurriness", 0, 1, 0.1);
      gui.add(this.scene, "backgroundIntensity", 0, 1, 0.1);
    }
    if (this.renderer) {
      gui
        .add(this.renderer, "toneMappingExposure", 0, 10, 0.1)
        .onChange((val) => {
          // 色调 的曝光
          this.renderer!.toneMappingExposure = val;

          this.renderer!.toneMapping = THREE.LinearToneMapping;
        });
      // 色调的算法
      gui
        .add(this.renderer, "toneMapping", [
          "NoToneMapping",
          "LinearToneMapping",
          "ReinhardToneMapping",
          "CineonToneMapping",
          "ACESFilmicToneMapping",
        ])
        .onChange((val) => {
          this.renderer!.toneMapping = (THREE as any)[val];
        });
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
