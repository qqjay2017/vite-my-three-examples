import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";
import * as dat from "dat.gui";
const gui = new dat.GUI();
export interface AddSpreadFnProps {
  scene?: THREE.Scene;
  center?: {
    x: number;
    y: number;
  };
  spreadWidth?: number;
  radius?: number;
  duration?: number;
  id?: string;
  distancePos?: "xy" | "xz" | "yz";
}
const defaultParams = {
  center: {
    x: 0,
    y: 0,
  },
  duration: 2,
  spreadWidth: 10,
  radius: 50,
  id: genId(),
  distancePos: "xy",
};
export function addSpread(_params: AddSpreadFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene, center, spreadWidth, duration, id } = params;
  // debugger;
  const plane = new THREE.PlaneGeometry(100, 100, 100, 100);

  const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x0c0e6f),
    side: THREE.DoubleSide,
    transparent: true,
  });
  const planeMesh = new THREE.Mesh(plane, planeMaterial);
  const uSpreadCenterKey = `uSpreadCenter_${id}`;
  const vPositionKey = `vPosition_${id}`;
  const uSpreadTimeKey = `uSpreadTime_${id}`;
  const uSpreadWidthKey = `uSpreadWidth_${id}`;
  planeMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",

      `#include <dithering_fragment>
     
         //#end#
         `
    );

    shader.uniforms[uSpreadCenterKey] = {
      value: new THREE.Vector2(center.x, center.y),
    };
    shader.uniforms[uSpreadTimeKey] = {
      value: 0,
    };
    shader.uniforms[uSpreadWidthKey] = {
      value: spreadWidth,
    };
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
      #include <common>
          varying vec3 ${vPositionKey};
    `
    );
    shader.vertexShader = (shader.vertexShader || "").replace(
      "#include <begin_vertex>",
      `
          #include <begin_vertex>

          ${vPositionKey} = position;

          
          `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
  #include <common>
  uniform vec2 ${uSpreadCenterKey};
  uniform float ${uSpreadWidthKey};
  uniform float ${uSpreadTimeKey};

  varying vec3 ${vPositionKey};
  `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
// 算出和中心点的距离 // xz or xy or yz ? 都试下,效果不一样
float spreadRadius${id} = distance( ${vPositionKey}.${params.distancePos} , ${uSpreadCenterKey} ) ;
// 扩散范围
float spreadIndex${id} = -( spreadRadius${id} - ${uSpreadTimeKey}) * ( spreadRadius${id} - ${uSpreadTimeKey}) + ${uSpreadWidthKey};
if(spreadIndex${id} > 0.0){
  // 0-1的混合
  gl_FragColor = mix( gl_FragColor , vec4(1.0,1.0,1.0,1.0), spreadIndex${id} / ${uSpreadWidthKey});
}
  //#end#
  `
    );
    gsap.to(shader.uniforms[uSpreadTimeKey], {
      value: params.radius,
      duration: duration,
      ease: "none",
      repeat: -1,
    });
  };
  // gui.add(params, "distancePos", ["xy", "xz", "yz"]);

  scene && scene.add(planeMesh);

  return {
    plane,
    planeMaterial,
    planeMesh,
  };
}
