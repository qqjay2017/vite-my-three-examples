import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { GeoJsonRootObject } from "./interface";
import { operationData } from "./main";

export class China3dMap extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  material: THREE.MeshLambertMaterial | null = null;
  directionalLight: THREE.DirectionalLight | null = null;
  map = new THREE.Object3D();
  fileLoader = new THREE.FileLoader();
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    this.directionalLight = directionalLight;
    this.scene?.add(ambientLight, directionalLight);
  }
  loadTextures() {}

  createObjects(): void {
    if (!this.textureLoader) {
      return;
    }
    const that = this;
    this.fileLoader.load("./geojson/100000_full.json", function (data) {
      const jsonData: GeoJsonRootObject = JSON.parse(data as string);

      operationData(jsonData, {
        map: that.map,
      });
      //   that.map.position.set(200, 200, 0);
      that.scene?.add(that.map);
    });

    this.scene?.add(this.map);
    this.map.position.set(0, 0, 0);
    that.watcherCamera?.lookAt(that.map.position);
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

    materialFolder
      .addColor(
        {
          color: 0x1890ff,
        },
        "color"
      )
      .onChange((val) => {
        _that.material &&
          _that.material.color &&
          (_that.material.color = new THREE.Color(val));
      });
    materialFolder.add(this.material, "wireframe");

    if (_that.directionalLight?.position) {
      const lightFolder = gui.addFolder("光照");
      lightFolder.add(_that.directionalLight.position, "x", -10, 10, 0.1);
      lightFolder.add(_that.directionalLight.position, "y", -10, 10, 0.1);
      lightFolder.add(_that.directionalLight, "intensity", 0, 1, 0.05);
    }
    this.guiInstance = gui;
  }
  addClickListener() {
    window.addEventListener("click", () => {});
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
    this.addClickListener();
  }
}
