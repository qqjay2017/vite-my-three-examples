import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

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
  duration: 4,
  spreadWidth: 10,
  radius: 100,
  id: genId(),
  distancePos: "xy",
};
export function addLightSpreadLine(_params: AddSpreadFnProps) {
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


    shader.uniforms[uSpreadTimeKey] = {
      value: -200,
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

  uniform float ${uSpreadWidthKey};
  uniform float ${uSpreadTimeKey};

  varying vec3 ${vPositionKey};
  `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `


// 扩散范围  如果要斜着走: vPositionKey.z 改成 vPositionKey.y, 左右两个都改 
float lightLineMix${id} = -( ${vPositionKey}.x+ ${vPositionKey}.z- ${uSpreadTimeKey}) * ( ${vPositionKey}.x+ ${vPositionKey}.z - ${uSpreadTimeKey}) + ${uSpreadWidthKey};
if(lightLineMix${id} > 0.0){
  // 0-1的混合
  gl_FragColor = mix( gl_FragColor , vec4(1.0,1.0,1.0,1.0), lightLineMix${id} / ${uSpreadWidthKey});
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


  scene && scene.add(planeMesh);

  return {
    plane,
    planeMaterial,
    planeMesh,
  };
}
