import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

export interface AddHeightGradientCubeFnProps {
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
export function addHeightGradientCube(_params: AddHeightGradientCubeFnProps) {
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

export interface AddHeightGradientCylinderFnProps {
  scene?: THREE.Scene;
  
  color?: string | number;
  duration?: number;
  radius?:number;
  length?:number;
  position?:{
    x:number;
    y:number;
    z:number;
  },
  id?: string;
  //   distancePos?: "xy" | "xz" | "yz";
}

const defaultGradientCylinderParams = {
  duration: 1,
  radius:50,
  length:2,
  position: {
    x:30,
    y:1,
    z:0
  },
  color: 0xff0000,
  id: genId(),
};

export function addHeightGradientCylinder(
  _params: AddHeightGradientCylinderFnProps
) {
  const params = {
    ...defaultGradientCylinderParams,
    ..._params,
  };
  const { id ,scene , radius,position,duration} = params;

  const uHeightKey = `uHeightKey_${id}`;
  const vPositionKey = `vPosition_${id}`;
  const uColorKey = `uColor_${id}`;
  const cylinder = new THREE.CylinderGeometry(radius, radius, 30, 100,1, true);
  const cylinderMaterial = new THREE.ShaderMaterial({
   
    transparent:true,
    side: THREE.DoubleSide,
    vertexShader:`

    precision mediump float;
		precision mediump int;

    varying vec3 ${vPositionKey};
	

      void main()	{
        // 下发到片元着色器
				${vPositionKey} = position;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

    `,
    fragmentShader:`
    precision mediump float;
    precision mediump int;
    varying vec3 ${vPositionKey};

    uniform float ${uHeightKey};
    uniform vec3 ${uColorKey};


    void main()	{

      // 设置混合的百分比
      float gradMix${id} = (${vPositionKey}.y +  (${uHeightKey} / 2.0)) / ${uHeightKey};
      gl_FragColor = vec4( ${uColorKey} ,1.0- gradMix${id});

    }

    
    `
  });
  const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
  cylinderMesh.position.set(position.x,position.y,position.z)
  cylinderMesh.geometry.computeBoundingBox()
  let boundingBox = cylinderMesh.geometry.boundingBox;
  const uHeight = (boundingBox?.max.y  || 0)- (boundingBox?.min.y ||0)

cylinderMaterial.uniforms[uHeightKey]= {
  value :uHeight
}
cylinderMaterial.uniforms[uColorKey]= {
  value :new THREE.Color(params.color)
}
  scene && scene.add(cylinderMesh);


  gsap.to(cylinderMesh.scale,{
    
    x:length,
    z:length,
    duration:duration,
    repeat:-1,
    yoyo:true
  })
  
}
