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
  lastPicker: any | null = null;
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
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
    _that.watcherCamera.updateMatrixWorld();
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
    const that = this;
    function onPointerMove(event: any) {
      that.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      that.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // 获取鼠标点击的位置

      that.raycaster.setFromCamera(that.pointer, that.watcherCamera!);
      const intersects = that.raycaster.intersectObjects(that.map.children);
      if (intersects.length > 0) {
        if (that.lastPicker) {
          that.lastPicker.material.color.copy(
            that.lastPicker.material.oldColor
          ); //恢复原来的颜色
        }
        that.lastPicker = intersects[0].object;
        that.lastPicker.material.oldColor =
          that.lastPicker.material.color.clone(); // 记录原来的颜色
        that.lastPicker.material.color.set(0xffffff); // 设置成白色
      } else {
        if (that.lastPicker) {
          that.lastPicker.material.color.copy(
            that.lastPicker.material.oldColor
          );
        }
      }
    }

    window.addEventListener("click", onPointerMove);
    window.addEventListener("mousemove", onPointerMove);
  }
  createCamera() {
    if (!this.scene) {
      return;
    }
    const perspectiveCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    perspectiveCamera.position.set(0, 0, 40);
    perspectiveCamera.lookAt(0, 0, 0);
    this.scene.add(perspectiveCamera);
    this.watcherCamera = perspectiveCamera;
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
