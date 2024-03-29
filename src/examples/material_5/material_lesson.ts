import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Wood_Ceiling_Coffers_003 } from "/@/assets/textures/Wood_Ceiling_Coffers_003";

export class MaterialLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  normalTexture: THREE.Texture | null = null;
  material: THREE.MeshPhongMaterial | null = null;
  directionalLight: THREE.DirectionalLight | null = null;
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    this.directionalLight = directionalLight;
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {
    if (!this.textureLoader) {
      return;
    }
    this.texture = this.textureLoader.load(
      Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_basecolor
    );
    this.normalTexture = this.textureLoader.load(
      Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_normal
    );
  }

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      // normalMap: this.normalTexture,
      side: THREE.DoubleSide,
      specular: 0x00ffff,
    });

    this.material = material;
    // 平面
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    // 球体
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material
    );
    // 立方体
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.2, 16, 32),
      material
    );
    this.mesh.position.set(0, 0, 1);
    box.position.set(0, 0, 2);
    sphere.position.set(-1.5, 0, 3);
    torus.position.set(1.5, 0, 4);

    this.scene?.add(this.mesh, sphere, box, torus);
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
    if (!this.material) {
      return;
    }
    const _that = this;
    const gui = new dat.GUI();
    const materialFolder = gui.addFolder("材质");
    // gui.add(this.texture.repeat, "x", 0, 10, 0.1).name("repeatX");
    materialFolder
      .add(this.material, "side", {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
        TwoPassDoubleSide: THREE.TwoPassDoubleSide,
      })
      .onChange((val) => {
        if (!this.material) {
          return;
        }

        (this.material as any).side = val;
        this.material.needsUpdate = true;

        // this.material
        // _that.texture.wrapS = val;
        // _that.texture.needsUpdate = true;
      })
      .name("side");
    materialFolder.add(this.material, "opacity", 0, 1, 0.1);
    // shininess 高光强度
    materialFolder.add(this.material, "shininess", 0, 100, 0.1);

    if (_that.directionalLight?.position) {
      const lightFolder = gui.addFolder("光照");
      lightFolder.add(_that.directionalLight.position, "x", -10, 10, 0.1);
      lightFolder.add(_that.directionalLight.position, "y", -10, 10, 0.1);
      lightFolder.add(_that.directionalLight, "intensity", 0, 1, 0.05);
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
