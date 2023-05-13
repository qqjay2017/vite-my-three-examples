import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as THREE from "three";

import { ThreeInstanceBase } from "../camera_4/ThreeInstanceBase";
import { Wood_Ceiling_Coffers_003 } from "/@/assets/textures/Wood_Ceiling_Coffers_003";

export class TextureLessonInstance extends ThreeInstanceBase {
  mesh: THREE.Mesh | null = null;
  texture: THREE.Texture | null = null;
  loadTextures() {
    // 3. 使用LoadingManager加载
    if (!this.loadingManager || !this.textureLoader) {
      return;
    }

    this.texture = this.textureLoader.load(
      Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_basecolor
    );
  }

  createObjects(): void {
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1);

    this.mesh = new THREE.Mesh(
      cylinderGeometry,
      new THREE.MeshLambertMaterial({
        color: 0xffffff * Math.random(),
        map: this.texture,
      })
    );

    this.scene?.add(this.mesh);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    // 不同的面,不同的贴图
    const boxtMaterial = boxGeometry.groups.map((g, index) => {
      return new THREE.MeshStandardMaterial({
        // color: 0xffffff * Math.random(),
        // 颜色贴图
        map: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_basecolor
        ),
        // 主要用于模拟真实的阴影效果
        aoMap: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_ambientOcclusion
        ),
        // 凹凸贴图  黑色和白色值映射到与光照相关的感知深度, 该技术几乎被淘汰,如果定义了发现贴图,则将忽略该贴图
        bumpMap: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_height
        ),
        // 凹凸高度,默认为1
        bumpScale: 2,
        // 置换贴图(位移贴图),可以改变物体的集合形状,能实现很多bump和normal无法实现的效果,尤其是模型对象的轮廓表现
        displacementMap: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_height
        ),
        // 位移贴图对网格的影响程度  ,黑色为无位移 ,白色是最大位移
        displacementScale: 1,
        // 法线贴图 rgb值会影响每个像素片段的曲面发现,并更改颜色照亮的方式,法线贴图不会改变曲面的实际形状
        normalMap: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_normal
        ),
        // 法线贴图对材质的影响程度, 0-1 , 默认是 THREE.Vector2(1,1)
        normalScale: new THREE.Vector2(1, 1),
        // 光滑度贴图
        roughnessMap: this.textureLoader?.load(
          Wood_Ceiling_Coffers_003.Wood_Ceiling_Coffers_003_roughness
        ),
        // 材质的粗糙程度 0.0表示光滑的镜面反射,1.0表示完全漫反射, 默认值1.0
        roughness: 1.0,
      });
    });

    const boxMesh = new THREE.Mesh(boxGeometry, boxtMaterial);

    boxMesh.position.set(3, 0, 0);

    this.scene?.add(this.mesh, boxMesh);
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
    this.createLoadingManager();
    this.loadTextures();
    this.createObjects();

    this.createCamera();
    this.helpers();
    this.render();
    this.controls();
    this.animate();
    this.fitView();
  }
}
