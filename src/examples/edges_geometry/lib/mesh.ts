import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

// https://threejs.org/docs/index.html?q=edge#api/zh/geometries/EdgesGeometry
export interface AddSpreadFnProps {
  id?:string;
  scene:THREE.Scene;
}
const defaultParams = {

  id: genId(),
};
export function addEdgesGeometry(_params: AddSpreadFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene } = params;
// 物体生成边缘线
const geometry = new THREE.BoxGeometry( 50, 50, 50 );
const edges = new THREE.EdgesGeometry( geometry );
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

  scene && scene.add(line);

  return {
    geometry,
    edges,
    line,
  };
}
