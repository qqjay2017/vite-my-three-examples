import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import * as dat from "dat.gui";

const size = 4;
interface CameraLessonInstance
  extends ThreeInstanceBaseType<THREE.OrthographicCamera> {
  mesh: THREE.Mesh | null;
  watcherCamera: THREE.PerspectiveCamera | null;
  orthographicCamera: THREE.OrthographicCamera | null;
  intersectsBox: () => boolean;
}
export const cameraLessonInstance: CameraLessonInstance = {
  canvas: null,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: null,
  mesh: null,
  camera: null,
  orthographicCamera: null,
  renderer: null,
  orbitControls: null,
  cameraHelper: null,
  watcherCamera: null,
  init() {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.gui?.();
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

  createCamera() {
    if (!this.scene) return;
    const size = 14;
    // this.camera = new THREE.PerspectiveCamera(-size, size, size / 2,-size/2,);
    // 正交相机
    const orthographicCamera = new THREE.OrthographicCamera(
      -size,
      size,
      size,
      -size,
      0.0001,
      10
    );
    orthographicCamera.position.set(1, 0.5, 2);
    orthographicCamera.lookAt(this.scene.position);
    this.orthographicCamera = orthographicCamera;
    this.scene.add(orthographicCamera);
    this.watcherCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.watcherCamera.position.set(6, 6, 16);
    this.watcherCamera.lookAt(this.scene.position);
    this.scene.add(this.watcherCamera);
    this.camera = this.watcherCamera;
    this.intersectsBox();
  },
  intersectsBox() {
    const intersectsCamera = this.orthographicCamera;
    if (!this.scene || !this.camera || !intersectsCamera) return false;

    if (this.mesh && this.mesh.geometry && this.mesh.geometry.boundingBox) {
      const frustum = new THREE.Frustum();

      intersectsCamera.updateProjectionMatrix();
      // multiplyMatrices a 投影变换矩阵  b
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          intersectsCamera.projectionMatrix,
          intersectsCamera.matrixWorldInverse
        )
      );
      // 检测物体是否在相机内
      const flag = frustum.intersectsBox(this.mesh.geometry.boundingBox);
      console.log("%ccamera_lesson.ts line:91 flag", "color: #007acc;", flag);
      return flag;
    }
    return false;
  },
  createObjects() {
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    // MeshLambertMaterial 表面粗糙的材质，可以起镜面反射作用. 不适用于金属、玻璃等物体
    const faces = boxGeometry.groups.map(
      (g) =>
        new THREE.MeshLambertMaterial({
          color: 0xffffff * Math.random(),
        })
    );
    this.mesh = new THREE.Mesh(boxGeometry, faces);
    console.log(
      "%ccamera_lesson.ts line:86  this.mesh",
      "color: #007acc;",
      this.mesh
    );
    this.mesh.geometry.computeBoundingBox();
    console.log(
      "%ccamera_lesson.ts line:88  this.mesh.geometry",
      "color: #007acc;",
      this.mesh.geometry
    );
    this.scene?.add(this.mesh);
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
    console.log(orbitControls, "orbitControls");
    this.orbitControls = orbitControls;
    if (this.mesh) {
      // 拖拽控制器
      const dragControls = new DragControls(
        [this.mesh],
        this.camera,
        this.canvas
      );
      dragControls.addEventListener("dragstart", () => {
        orbitControls.enabled = false;
      });
      dragControls.addEventListener("dragend", () => {
        orbitControls.enabled = true;
      });
    }
  },
  animate() {
    const _that = this;
    if (!_that.scene || !_that.camera) {
      return;
    }
    _that.orbitControls?.update();
    _that.cameraHelper?.update();
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
    if (!_that.camera || !_that.canvas || !this.orthographicCamera) {
      return;
    }

    const gui = new dat.GUI();

    if (_that.orbitControls) {
      gui.add(_that.orbitControls, "enabled");
      // 阻尼系数
      gui.add(_that.orbitControls, "dampingFactor", 0.01, 1, 0.01);
      // 启用/禁用相机平移
      gui.add(_that.orbitControls, "enablePan");
      // 相机平移的速度
      gui.add(_that.orbitControls, "panSpeed", 1, 10, 1);
      // 绕着目标自动转
      gui.add(_that.orbitControls, "autoRotate");
      // 自动转 的速度
      gui.add(_that.orbitControls, "autoRotateSpeed", 1, 10, 1);
      // 缩放
      gui.add(_that.orbitControls, "enableZoom");
      // 缩放的速度
      gui.add(_that.orbitControls, "zoomSpeed", 1, 10, 1);
    }

    // document.getElementById("root")!.appendChild(gui.domElement);
  },
};
