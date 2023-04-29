import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import { ThreeInstanceBase } from "./ThreeInstanceBase";

const size = 4;
// interface CameraLessonInstance
//   extends ThreeInstanceBaseType<THREE.OrthographicCamera> {
//   mesh: THREE.Mesh | null;
//   watcherCamera: THREE.PerspectiveCamera | null;
//   orthographicCamera: THREE.OrthographicCamera | null;
// }
// export const cameraLessonInstance: CameraLessonInstance = {
//   canvas: null,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   scene: null,
//   mesh: null,
//   camera: null,
//   orthographicCamera: null,
//   renderer: null,
//   orbitControls: null,
//   cameraHelper: null,
//   watcherCamera: null,
//   init() {
//     this.createScene();
//     this.createLights();
//     this.createObjects();
//     this.createCamera();
//     this.helpers();
//     this.render();
//     this.controls();

//     this.animate();
//     this.fitView();
//   },
//   createScene() {
//     this.scene = new THREE.Scene();
//     const canvas = document.getElementById("c")!;
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     this.canvas = canvas;
//   },
//   createLights() {
//     const ambientLight = new THREE.AmbientLight(0xffffff);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     this.scene?.add(ambientLight, directionalLight);
//   },

//   createCamera() {
//     if (!this.scene) return;
//     const size = 14;
//     const aspect = this.width / this.height;
//     const orthographicCamera = new THREE.OrthographicCamera(
//       -size,
//       size,
//       size,
//       -size,
//       0.0001,
//       10
//     );
//     orthographicCamera.position.set(1, 0.5, 2);
//     orthographicCamera.lookAt(this.scene.position);
//     this.orthographicCamera = orthographicCamera;
//     this.scene.add(orthographicCamera);
//     this.watcherCamera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.001,
//       1000
//     );
//     this.watcherCamera.position.set(6, 6, 16);
//     this.watcherCamera.lookAt(this.scene.position);
//     this.scene.add(this.watcherCamera);
//     this.camera = this.watcherCamera;
//   },

//   createObjects() {
//     const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
//     // MeshLambertMaterial 表面粗糙的材质，可以起镜面反射作用. 不适用于金属、玻璃等物体
//     const faces = boxGeometry.groups.map(
//       (g) =>
//         new THREE.MeshLambertMaterial({
//           color: 0xffffff * Math.random(),
//         })
//     );
//     this.mesh = new THREE.Mesh(boxGeometry, faces);
//     console.log(
//       "%ccamera_lesson.ts line:86  this.mesh",
//       "color: #007acc;",
//       this.mesh
//     );
//     this.mesh.geometry.computeBoundingBox();
//     console.log(
//       "%ccamera_lesson.ts line:88  this.mesh.geometry",
//       "color: #007acc;",
//       this.mesh.geometry
//     );
//     this.scene?.add(this.mesh);
//   },
//   helpers() {
//     if (!this.scene) {
//       return;
//     }

//     const axesHelper = new THREE.AxesHelper(40);
//     this.scene.add(axesHelper);
//     const gridHelp = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);
//     this.scene.add(gridHelp);
//   },
//   render() {
//     if (!this.canvas || !this.scene || !this.camera) return;
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas!,
//       antialias: true,
//     });
//     this.renderer.setPixelRatio(window.devicePixelRatio || 1);
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.render(this.scene, this.camera);
//   },
//   controls() {
//     if (!this.camera || !this.canvas) return;
//     // 轨道控制器
//     const orbitControls = new OrbitControls(this.camera, this.canvas);
//     orbitControls.enableDamping = true;
//     console.log(orbitControls, "orbitControls");
//     this.orbitControls = orbitControls;
//     if (this.mesh) {
//       // 拖拽控制器
//       const dragControls = new DragControls(
//         [this.mesh],
//         this.camera,
//         this.canvas
//       );
//       dragControls.addEventListener("dragstart", () => {
//         orbitControls.enabled = false;
//       });
//       dragControls.addEventListener("dragend", () => {
//         orbitControls.enabled = true;
//       });
//     }
//   },
//   animate() {
//     const _that = this;
//     if (!_that.scene || !_that.camera) {
//       return;
//     }
//     _that.orbitControls?.update();
//     _that.cameraHelper?.update();
//     _that.renderer?.render(_that.scene, _that.camera);

//     requestAnimationFrame(() => {
//       _that.animate();
//     });
//   },
//   fitView() {
//     window.addEventListener(
//       "resize",
//       () => {
//         if (this.camera) {
//           // this.camera.aspect = window.innerWidth / window.innerHeight;
//           this.camera.updateProjectionMatrix();
//         }
//         if (this.renderer) {
//           this.renderer.setSize(window.innerWidth, window.innerHeight);
//         }
//       },
//       false
//     );
//   },
//   gui() {},
// };

export class CameraLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  createScene(): void {
    this.scene = new THREE.Scene();
    const canvas = document.getElementById("c")!;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = canvas;
  }
  createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene?.add(ambientLight, directionalLight);
  }
  createObjects(): void {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    this.mesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshLambertMaterial({
        color: 0xffffff * Math.random(),
      })
    );

    this.mesh.geometry.computeBoundingBox();

    this.scene?.add(this.mesh);
  }
  createCamera(): void {
    if (!this.scene) {
      return;
    }
    const aspect = this.width / this.height;
    const pCamera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      aspect,
      -aspect,
      0.1,
      1000
    );
    pCamera.position.set(1, 1, 2);
    pCamera.lookAt(this.scene.position);
    this.watcherCamera = pCamera;
    this.scene.add(pCamera);
  }
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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.watcherCamera);
  }
  controls(): void {
    if (!this.watcherCamera || !this.canvas) return;
    // 轨道控制器
    const orbitControls = new OrbitControls(this.watcherCamera, this.canvas);
    orbitControls.enableDamping = true;
    console.log(orbitControls, "orbitControls");
    this.orbitControls = orbitControls;
    if (this.mesh) {
      // 拖拽控制器
      const dragControls = new DragControls(
        [this.mesh],
        this.watcherCamera,
        this.canvas
      );
      dragControls.addEventListener("dragstart", () => {
        orbitControls.enabled = false;
      });
      dragControls.addEventListener("dragend", () => {
        orbitControls.enabled = true;
      });
      this.dragControls = dragControls;
    }
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
          // this.camera.aspect = window.innerWidth / window.innerHeight;
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
  init(): void {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.animate();
  }
}
