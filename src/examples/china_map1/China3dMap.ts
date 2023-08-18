import * as THREE from "three";
import * as dat from "dat.gui";
import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { GeoJsonRootObject } from "./interface";
import { operationData } from "./main";

// 后期合成
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

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
    _that.cameraHelper?.update();
    _that.activeIntersects();
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
  activeIntersects() {
    const that = this;
    if (!that.pointer.x && !that.pointer.y) {
      return;
    }

    that.raycaster.setFromCamera(that.pointer, that.watcherCamera!);
    const intersects = that.raycaster.intersectObjects(that.map.children);
    if (intersects.length > 0) {
      if (that.lastPicker) {
        that.lastPicker.material.color.copy(that.lastPicker.material.oldColor); //恢复原来的颜色
      }
      that.lastPicker = intersects[0].object;
      that.lastPicker.material.oldColor =
        that.lastPicker.material.color.clone(); // 记录原来的颜色
      that.lastPicker.material.color.set(0xffffff); // 设置成白色
    } else {
      if (that.lastPicker) {
        that.lastPicker.material.color.copy(that.lastPicker.material.oldColor);
      }
    }
  }
  addClickListener() {
    const that = this;
    function onPointerMove(event: any) {
      // 修复因为左边菜单栏,要减掉220,如果是全屏的,就不用减
      // https://blog.csdn.net/mo911108/article/details/120158624
      that.pointer.x = ((event.clientX - 220) / window.innerWidth) * 2 - 1;
      that.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
      1000
    );
    perspectiveCamera.position.set(0, 0, 40);
    perspectiveCamera.lookAt(0, 0, 0);
    this.scene.add(perspectiveCamera);
    this.watcherCamera = perspectiveCamera;
  }
  // 添加后期合成
  addPostprocessing() {
    if (!this.renderer || !this.scene || !this.watcherCamera) {
      return;
    }
    const composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.watcherCamera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth - 220, window.innerHeight),
      this.scene,
      this.watcherCamera
    );
    composer.addPass(outlinePass);
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
    this.addPostprocessing();
    this.animate();
    this.fitView();
    this.gui();
    // 添加交互
    this.addClickListener();
  }
}
