import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";

import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";


export class TextureLessonInstance extends ThreeInstanceBase {
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
    console.log('%ctexture_lesson.ts line:67 this', 'color: #007acc;', this);
  }
}
