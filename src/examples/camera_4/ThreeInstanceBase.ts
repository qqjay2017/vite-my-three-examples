import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeInstanceBase {
  canvas: HTMLElement | null = null;
  width = window.innerWidth;
  height = window.innerHeight;
  scene: THREE.Scene | null = null;

  watcherCamera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null =
    null;

  renderer: THREE.WebGLRenderer | null = null;
  orbitControls: OrbitControls | null = null;
  dragControls: DragControls | null = null;
  cameraHelper: THREE.CameraHelper | null = null;
  loadingManager: THREE.LoadingManager | null = null;
  textureLoader: THREE.TextureLoader | null = null;

  createScene() {
    this.scene = new THREE.Scene();
    const canvas = document.getElementById("c")!;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = canvas;
  }
  createLoadingManager(): void {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Started loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };
    manager.onLoad = function () {
      console.log("Loading complete!");
    };
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };
    manager.onError = function (url) {
      console.log("There was an error loading " + url);
    };
    this.loadingManager = manager;
    this.textureLoader = new THREE.TextureLoader(manager);
  }
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    this.scene?.add(ambientLight, directionalLight);
  }
  createCamera() {
    if (!this.scene) {
      return;
    }
    const perspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    perspectiveCamera.position.set(12, 12, 14);
    perspectiveCamera.lookAt(this.scene.position);
    this.scene.add(perspectiveCamera);
    this.watcherCamera = perspectiveCamera;
  }
  createObjects() {}

  helpers(): void {
    if (!this.scene) {
      return;
    }
    const axesHelper = new THREE.AxesHelper(40);
    this.scene.add(axesHelper);
    const gridHelp = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);
    this.scene.add(gridHelp);
  }

  render(): void {
    if (!this.canvas || !this.scene || !this.watcherCamera) return;
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
      this.renderer.setSize(this.width, this.height);
    }
    this.renderer.render(this.scene, this.watcherCamera);
  }
  animate(): void {
    const _that = this;
    if (!_that.scene || !_that.watcherCamera) {
      return;
    }
    _that.orbitControls?.update();
    _that.cameraHelper?.update();
    _that.renderer?.render(_that.scene, _that.watcherCamera);
    requestAnimationFrame(() => {
      _that.animate();
    });
  }
  fitView(): void {
    const _that = this;
    window.addEventListener(
      "resize",
      () => {
        if (_that.watcherCamera) {
          if (_that.watcherCamera instanceof THREE.PerspectiveCamera) {
            _that.watcherCamera.aspect = window.innerWidth / window.innerHeight;
          }

          _that.watcherCamera.updateProjectionMatrix();
        }
        if (_that.renderer) {
          _that.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        _that.width = window.innerWidth;
        _that.height = window.innerHeight;
      },
      false
    );
  }
  controls(): void {
    if (!this.watcherCamera || !this.canvas) return;
    // 轨道控制器
    const orbitControls = new OrbitControls(this.watcherCamera, this.canvas);
    orbitControls.enableDamping = true;

    this.orbitControls = orbitControls;
  }
  gui() {}
  init() {}
}
