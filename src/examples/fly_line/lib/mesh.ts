import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

export interface AddSpreadFnProps {
  scene?: THREE.Scene;
  lineWidth?:number;
  duration?: number;
  id?: string;
  //   distancePos?: "xy" | "xz" | "yz";
}
const defaultParams = {
  duration: 1.5,
  lineWidth:3,
  id: genId(),
};
export function addFlyLine(_params: AddSpreadFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene, duration, id } = params;
// 根据点生成曲线
  let linePoints = [
    new THREE.Vector3(50, 0, 0),
 
  new THREE.Vector3(25, 20, 0),
  new THREE.Vector3(0, 0, 0),
  
];
const lineCurve = new THREE.CatmullRomCurve3(linePoints);
const flyLine = new THREE.TubeBufferGeometry(lineCurve, 100, params.lineWidth, 2, false);
const z11Texture = new THREE.TextureLoader().load("./textures/z_11.png");
z11Texture.repeat.set(1, 2);
// 水平的重复
z11Texture.wrapS = THREE.RepeatWrapping;
// 垂直的重复
z11Texture.wrapT =THREE.MirroredRepeatWrapping

  const flyLineMaterial = new THREE.MeshBasicMaterial({
    map:z11Texture,
    transparent:true
   
  });
  const flyMeshMesh = new THREE.Mesh(flyLine, flyLineMaterial);

  gsap.to(z11Texture.offset, {
    x:-1,
    duration:params.duration,
    repeat:-1,
    ease:'none'
  })
 
  

  scene && scene.add(flyMeshMesh);

  return {
    flyLine,
    flyLineMaterial,
    flyMeshMesh,
  };
}
