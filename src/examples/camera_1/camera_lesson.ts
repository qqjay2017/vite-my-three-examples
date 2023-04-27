import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import * as dat from "dat.gui";

const size = 4;
interface CameraLessonInstance
  extends ThreeInstanceBaseType<THREE.OrthographicCamera> {
  mesh: THREE.Mesh | null;
  watcherCamera: THREE.PerspectiveCamera | null;
  orthographicCamera: THREE.OrthographicCamera | null;
  intersectsBox:()=>boolean;
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
    this.intersectsBox()
   
  },
  intersectsBox(){
    const intersectsCamera = this.orthographicCamera;
    if (!this.scene||! this.camera||!intersectsCamera) return false;
 
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
    const flag =   frustum.intersectsBox(this.mesh.geometry.boundingBox);
    console.log('%ccamera_lesson.ts line:91 flag', 'color: #007acc;', flag);
    return flag;
    }
    return false
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
    if (this.orthographicCamera) {
      this.cameraHelper = new THREE.CameraHelper(this.orthographicCamera);
      this.scene.add(this.cameraHelper);
    }
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
    if (!_that.camera || !_that.canvas||!this.orthographicCamera) {
      return;
    }

    const gui = new dat.GUI();
    const guiCamera = this.orthographicCamera;
    const params = {
      // 触发按钮事件(切换相机)
      switchCamera() {
        if (!guiCamera|| !_that.canvas) {
          return;
        }
        // 销毁旧的轨道控制器
        _that.orbitControls?.dispose();
        // TODO 切换相机类型还不行111

        if (_that.camera?.type === "OrthographicCamera") {
          _that.camera = _that.watcherCamera;
        } else {
          _that.camera = _that.orthographicCamera;
        }
        // 新的的轨道控制器
        _that.orbitControls = new OrbitControls(
          _that.camera as any,
          _that.canvas!
        );
      },
    };
    gui.add(_that.camera.position, "x").min(-10).max(10).step(0.01);
    gui
      .add(_that.camera, "zoom")
      .min(0.1)
      .max(4)
      .step(0.1)
      .onChange(() => {
        _that.camera?.updateProjectionMatrix();
        _that.cameraHelper?.update();
      });
    gui
      .add(guiCamera, "near")
      .min(0.001)
      .max(20)
      .step(0.01)
      .onChange((val) => {
        guiCamera.near = val;
        guiCamera?.updateProjectionMatrix();
       const flag = this.intersectsBox();
      });
    gui
      .add(_that.camera, "far")
      .min(0.1)
      .max(40)
      .step(0.1)
      .onChange(() => {
        _that.camera?.updateProjectionMatrix();
        _that.cameraHelper?.update();
      });
    gui.add(params, "switchCamera");
    // document.getElementById("root")!.appendChild(gui.domElement);
  },
};
