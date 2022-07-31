import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";
import * as dat from "dat.gui";
const gui = new dat.GUI();
export interface AddSpreadFnProps {
  scene?: THREE.Scene;
  topColor?: string | number;
  bottomColor?: string | number;
  duration?: number;
  id?: string;
  //   distancePos?: "xy" | "xz" | "yz";
}
const defaultParams = {
  duration: 2,
  topColor: "#aaaeff",
  bottomColor: 0x0c0e6f,
  id: genId(),
};
export function addHeightGradientCube(_params: AddSpreadFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene, duration, id } = params;
  // debugger;
  const box = new THREE.BoxGeometry(30, 30, 30);

  const boxMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(params.bottomColor),
    side: THREE.DoubleSide,
  });
  const boxMesh = new THREE.Mesh(box, boxMaterial);
  const uTopColorKey = `uTopColor_${id}`;
  const uHeightKey = `uHeightKey_${id}`;
  const vPositionKey = `vPosition_${id}`;
  boxMesh.geometry.computeBoundingBox();
  const min = boxMesh.geometry.boundingBox?.min;
  const max = boxMesh.geometry.boundingBox?.max;
  const uHeight = max && min ? max.y - min.y : 0;
  boxMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",

      `#include <dithering_fragment>
     
         //#end#
         `
    );

    shader.uniforms[uTopColorKey] = {
      value: new THREE.Color(params.topColor),
    };
    shader.uniforms[uHeightKey] = {
      value: uHeight,
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
  uniform vec3 ${uTopColorKey};
  uniform float ${uHeightKey};

  varying vec3 ${vPositionKey};
  `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
      vec4 distGradColor${id} =  gl_FragColor;
      // 设置混合的百分比
      float gradMix${id} = (${vPositionKey}.y +  (${uHeightKey} / 2.0)) / ${uHeightKey};
      // 计算混合颜色
      vec3 gradMixColor${id} =  mix(distGradColor${id}.xyz , ${uTopColorKey} , gradMix${id});
      gl_FragColor = vec4( gradMixColor${id} , 1.0);

  //#end#
  `
    );
    // gsap.to(shader.uniforms[uSpreadTimeKey], {
    //   value: params.radius,
    //   duration: duration,
    //   ease: "none",
    //   repeat: -1,
    // });
  };

  scene && scene.add(boxMesh);

  return {
    box,
    boxMaterial,
    boxMesh,
  };
}
