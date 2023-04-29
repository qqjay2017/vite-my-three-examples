import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import { ThreeInstanceBase } from "./ThreeInstanceBase";

export class CameraLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  thumbnailCamera: THREE.OrthographicCamera | null = null;

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
    // 设置显示相机前方高为4的内容
    const frustumSize = 4;
    const aspect = this.width / this.height;
    const pCamera = new THREE.OrthographicCamera(
      -aspect * frustumSize,
      aspect * frustumSize,
      frustumSize,
      -frustumSize,
      0.1,
      1000
    );
    pCamera.position.set(1, 1, 2);
    pCamera.lookAt(this.scene.position);
    this.watcherCamera = pCamera;
    this.scene.add(pCamera);
    const thumbnailAspect = 150 / 200;
    const thumbnailCamera = new THREE.OrthographicCamera(
      -thumbnailAspect * frustumSize,
      thumbnailAspect * frustumSize,
      frustumSize,
      -frustumSize,
      0.1,
      1000
    );

    thumbnailCamera.position.set(1, 1, 2);
    thumbnailCamera.lookAt(this.scene.position);
    this.thumbnailCamera = thumbnailCamera;
    this.scene.add(thumbnailCamera);
  }

  controls(): void {
    if (!this.watcherCamera || !this.canvas) return;
    // 轨道控制器
    const orbitControls = new OrbitControls(this.watcherCamera, this.canvas);
    orbitControls.enableDamping = true;

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

  render(): void {
    if (!this.canvas || !this.scene || !this.watcherCamera) return;
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      // 开启裁剪检测
      this.renderer.setScissorTest(true);
    }

    // this.renderer.render(this.scene, this.watcherCamera);
    // 全局裁剪
    const clipScene = () => {
      if (!this.renderer || !this.scene || !this.watcherCamera) {
        return;
      }
      this.renderer.setScissor(0, 0, this.width, this.height);

      this.renderer.setClearColor(0x999999, 0.5);
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
      // setSize 源码里面会调 setViewport
      this.renderer.setSize(this.width, this.height);
      this.renderer.render(this.scene, this.watcherCamera);
    };
    clipScene();
    // 缩略图裁剪
    const clipThumbnail = () => {
      if (
        !this.renderer ||
        !this.scene ||
        !this.thumbnailCamera ||
        !this.watcherCamera
      ) {
        return;
      }

      // 更新位置
      this.thumbnailCamera.position.copy(this.watcherCamera.position);
      // 更新四元数
      this.thumbnailCamera.quaternion.copy(this.watcherCamera.quaternion);
      this.thumbnailCamera.zoom = this.watcherCamera.zoom;
      this.thumbnailCamera.updateProjectionMatrix();

      const w = this.width - 380 - 10;

      this.renderer.setScissor(w, 10, 150, 200);
      this.renderer.setViewport(w, 10, 150, 200);
      this.renderer.setClearColor(0x000000);
      this.renderer.render(this.scene, this.thumbnailCamera);
    };
    clipThumbnail();
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
  fitView(): void {
    const _that = this;
    window.addEventListener(
      "resize",
      () => {
        if (_that.watcherCamera) {
          if (_that.watcherCamera instanceof THREE.PerspectiveCamera) {
            _that.watcherCamera.aspect = window.innerWidth / window.innerHeight;
          }
          if (_that.watcherCamera instanceof THREE.OrthographicCamera) {
            const frustumSize = 4;
            const aspect = window.innerWidth / window.innerHeight;

            _that.watcherCamera.left = -aspect * frustumSize;
            _that.watcherCamera.right = aspect * frustumSize;
            _that.watcherCamera.top = frustumSize;
            _that.watcherCamera.bottom = -frustumSize;
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

  init(): void {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.animate();
    this.fitView();
  }
}
