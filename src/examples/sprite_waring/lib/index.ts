import { addSpriteWaringGeometry } from "./mesh";
import * as THREE from 'three'
import { getCamera } from "/@/lib-common/camera";
import { getRenderer } from "/@/lib-common/renderer";
import { getControls } from "/@/lib-common/controls";
import { getScene } from "/@/lib-common/scene";
import { getClock } from "/@/lib-common/clock";
import { getAxesHelper } from "/@/lib-common/helper";
export class SpriteWaring {
  camera = getCamera({
    x: 22,
    y: 17,
    z: 13,
  });
  renderer = getRenderer();
  raycaster = new THREE.Raycaster();
  controls = getControls(this.camera, this.renderer);
  scene = getScene();

  clock = getClock();

  constructor() {
    this.init();
  }

  init() {
    this.scene.add(getAxesHelper());
  const {sprite} =   addSpriteWaringGeometry({
      scene: this.scene,
    });
    window.addEventListener("resize", this.resizeHandle.bind(this));
      // 创建射线
   


    window.addEventListener('click',(event)=>{
    const mouse = new THREE.Vector2();
    // 鼠标点击位置
    console.log(this.renderer.domElement.width,'this.renderer.domElement.width');
    mouse.x = ( event.clientX /window.innerWidth) * 2 ;
    mouse.y = - (( event.clientY / window.innerHeight) * 2 );
    console.log(mouse,'mouse');
    this.raycaster.setFromCamera(mouse,this.camera)
    const intersects = this.raycaster.intersectObject(sprite)
    if(intersects && intersects.length>0){
      alert('点击了图标')
    }
  })

  }

  resizeHandle() {
    console.log(this.camera);
    this.camera.aspect = window.innerWidth / innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
  render() {
    const uTime = this.clock.getElapsedTime();
    this.controls.update();
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
