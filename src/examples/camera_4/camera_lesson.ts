import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";
import { ThreeInstanceBaseType } from "/@/lib-common/interface";
import { ThreeInstanceBase } from "./ThreeInstanceBase";

export class CameraLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;

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
    const aspect = 4;
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
