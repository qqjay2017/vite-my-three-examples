import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
interface CameraLessonInstance
  extends ThreeInstanceBaseType<THREE.OrthographicCamera> {
  mesh: THREE.Mesh | null;
}
export const cameraLessonInstance: CameraLessonInstance = {
  canvas: null,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: null,
  mesh: null,
  camera: null,
  renderer: null,
  orbitControls: null,
  init() {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.animate();
    this.fitView();
  },
  createScene() {
    this.scene = new THREE.Scene();
    const canvas = document.getElementById("c")!;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas = canvas;
  },
  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene?.add(ambientLight, directionalLight);
  },
  createObjects() {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    // MeshLambertMaterial 表面粗糙的材质，可以起镜面反射作用. 不适用于金属、玻璃等物体
    const faces = boxGeometry.groups.map(
      (g) =>
        new THREE.MeshLambertMaterial({
          color: 0xffffff * Math.random(),
        })
    );
    this.mesh = new THREE.Mesh(boxGeometry, faces);
    this.scene?.add(this.mesh);
  },
  helpers() {
    const axesHelper = new THREE.AxesHelper(40);
    this.scene?.add(axesHelper);
    const gridHelp = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);
    this.scene?.add(gridHelp);
  },
  createCamera() {
    if (!this.scene) return;
    const size = 4;
    // this.camera = new THREE.PerspectiveCamera(-size, size, size / 2,-size/2,);
    // 正交相机
    this.camera = new THREE.OrthographicCamera(
      -size,
      size,
      size / 2,
      -size / 2,
      0.0001,
      100
    );
    this.camera.position.set(1, 0.5, 2);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
  },
  render() {
    if (!this.canvas || !this.scene || !this.camera) return;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas!,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera);
  },
  controls() {
    if (!this.camera || !this.canvas) return;
    const orbitControls = new OrbitControls(this.camera, this.canvas);
    orbitControls.enableDamping = true;
    this.orbitControls = orbitControls;
  },
  animate() {
    const _that = this;
    if (!_that.scene || !_that.camera) {
      return;
    }
    _that.orbitControls?.update();
    _that.renderer?.render(_that.scene, _that.camera);

    requestAnimationFrame(() => {
      _that.animate();
    });
  },
  fitView() {
    window.addEventListener(
      "resize",
      () => {
        if (this.camera) {
          // this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
      },
      false
    );
  },
};
