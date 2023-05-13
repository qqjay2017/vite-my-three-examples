import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import * as dat from "dat.gui";
import { HeartCurve } from "three/examples/jsm/curves/CurveExtras";
const size = 4;
interface CameraLessonInstance
  extends ThreeInstanceBaseType<THREE.OrthographicCamera> {
  mesh: THREE.Mesh | null;
  watcherCamera: THREE.PerspectiveCamera | null;

  curve: HeartCurve | null;

  curveGenerator: (scale?: number | undefined) => void;
  points: THREE.Vector3[];
  count: number;
  moveCamera: () => void;
}
export const cameraLessonInstance: CameraLessonInstance = {
  canvas: null,
  points: [],
  width: window.innerWidth,
  height: window.innerHeight,
  scene: null,
  mesh: null,
  camera: null,

  renderer: null,
  orbitControls: null,
  cameraHelper: null,
  watcherCamera: null,
  curve: null,

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

  createCamera() {
    if (!this.scene) return;
    const size = 14;

    this.watcherCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.watcherCamera.position.set(2, 2, 10);
    this.watcherCamera.lookAt(this.scene.position);
    this.scene.add(this.watcherCamera);
    this.camera = this.watcherCamera;
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
  curveGenerator(scale = 1) {
    this.curve = new HeartCurve(scale);
    const tubeGeometry = new THREE.TubeGeometry(this.curve, 200, 0.5, 8, true);
    const meshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, meshBasicMaterial);
    tubeMesh.rotation.x = -Math.PI / 2;
    const points = this.curve.getPoints(3000);
    this.points = points;
    const index = 0;
    const point = points[index];
    this.camera?.position.set(point.x, point.y, point.z);
    this.scene?.add(tubeMesh);
  },
  helpers() {
    if (!this.scene) {
      return;
    }
    const axesHelper = new THREE.AxesHelper(40);
    this.scene.add(axesHelper);
    const gridHelp = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);
    this.scene.add(gridHelp);
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
    // 轨道控制器
    const orbitControls = new OrbitControls(this.camera, this.canvas);
    orbitControls.enableDamping = true;
    this.orbitControls = orbitControls;
  },
  count: 0,
  moveCamera() {
    const index = this.count % this.points.length;
    const nextPoint =
      this.points[index + 1 >= this.points.length ? 0 : index + 1];
    // const index = this.count;
    const point = this.points[index];
    if (point) {
      // this.camera?.position.set(point.x, point.y, point.z);
      this.camera?.position.set(point.x, 0, -point.y);
    }
    if (nextPoint) {
      // this.camera?.lookAt(nextPoint.x, 0, -nextPoint.y);
    }
    this.count++;
  },
  animate() {
    const _that = this;
    if (!_that.scene || !_that.camera) {
      return;
    }
    _that.orbitControls?.update();
    _that.moveCamera();

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
  gui() {
    const _that = this;

    // gui.add(_that.camera.position, "x").min(-10).max(10).step(0.01);
    // gui
    //   .add(_that.camera, "zoom")
    //   .min(0.1)
    //   .max(4)
    //   .step(0.1)
    //   .onChange(() => {
    //     _that.camera?.updateProjectionMatrix();
    //   });
    // gui
    //   .add(guiCamera, "near")
    //   .min(0.001)
    //   .max(20)
    //   .step(0.01)
    //   .onChange((val) => {
    //     guiCamera.near = val;
    //     guiCamera?.updateProjectionMatrix();
    //     const flag = this.intersectsBox();
    //   });
    // gui
    //   .add(_that.camera, "far")
    //   .min(0.1)
    //   .max(40)
    //   .step(0.1)
    //   .onChange(() => {
    //     _that.camera?.updateProjectionMatrix();
    //   });

    // document.getElementById("root")!.appendChild(gui.domElement);
  },
  init() {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.curveGenerator(1);
    this.helpers();
    this.render();
    this.controls();
    this.gui?.();
    this.animate();
    this.fitView();
  },
};
