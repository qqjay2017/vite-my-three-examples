import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

// https://threejs.org/docs/index.html?q=spr#api/zh/objects/Sprite
// 精灵图,一直朝着摄影机的方向
export interface AddSpriteWaringGeometryFnProps {
  id?:string;
  scene:THREE.Scene;
  url?:string;
  onClick?:()=>void;
}
const defaultParams = {
  url:'./images/warning.png',
  id: genId(),
};
export function addSpriteWaringGeometry(_params: AddSpriteWaringGeometryFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene ,url} = params;

  const map = new THREE.TextureLoader().load( url );
  const material = new THREE.SpriteMaterial( { map: map } );
  
  const sprite = new THREE.Sprite( material );
  // sprite.scale.set(100,100,100);
  // sprite.scale.set(200, 200, 1)
  sprite.position.set(2,2,0)
  scene && scene.add(sprite);



  return {
    map,
    material,
    sprite,
  };
}
