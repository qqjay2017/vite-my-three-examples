import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

export interface addLightRadarFnProps {
  scene?: THREE.Scene;

  duration?: number;
  id?: string;

  radius?: number;
  position?: {
    x: number;
    z: number;
  };
  color?: number | string;
}
const defaultParams = {
  duration: 1,
  radius: 30,

  position: { x: 0, z: 0 },
  color: 0x00ffff,

  id: genId(),
};
export function addLightRadar(_params: addLightRadarFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene, id, position, color, radius } = params;

  const planeGeometry = new THREE.PlaneGeometry(radius, radius);

  const uTimeKey = `uTime_${id}`;
  const uColorKey = `uColor_${id}`;
  const vPositionKey = `vPosition_${id}`;
  const vUvKey = `vUv_${id}`;
  const newUvKey = `newUv_${id}`;
  const alphaKey = `alpha_${id}`;
  const strengthKey = `strength_${id}`;
  const angleKey = `angle_${id}`;
  const rotate2dKey = `rotate2d_${id}`;

  const lightRadarShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      [uTimeKey]: {
        value: 0,
      },
      [uColorKey]: {
        value: new THREE.Color(color),
      },
    },

    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `
        
varying vec3 ${vPositionKey};
varying vec2 ${vUvKey};




void main(){
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    ${vPositionKey} = position;
    ${vUvKey} = uv;
   
}
    
    `,
    fragmentShader: `

    varying vec3 ${vPositionKey};
    varying vec2 ${vUvKey};
    uniform vec3 ${uColorKey};
    uniform float ${uTimeKey};


mat2 ${rotate2dKey}(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }

void main(){

  vec2 ${newUvKey} = ${rotate2dKey}(${uTimeKey}*6.28) * (${vUvKey}-0.5);
  ${newUvKey} += 0.5;
  float ${alphaKey} =  1.0 - step(0.5,distance(${newUvKey},vec2(0.5)));
  
  float ${angleKey} = atan(${newUvKey}.x-0.5,${newUvKey}.y-0.5);
  float ${strengthKey} = (${angleKey}+3.14)/6.28;
  gl_FragColor =vec4(${uColorKey},${alphaKey}*${strengthKey});
    
}
    
    `,
  });
  const lightRadarMesh = new THREE.Mesh(
    planeGeometry,
    lightRadarShaderMaterial
  );
  lightRadarMesh.position.set(params.position.x, 1, params.position.z);
  lightRadarMesh.rotation.x = -Math.PI / 2;
  gsap.to(lightRadarShaderMaterial.uniforms[uTimeKey], {
    value: 1,
    duration: params.duration,
    repeat: -1,
    ease: "none",
  });

  scene && scene.add(lightRadarMesh);

  return {
    planeGeometry,
    lightRadarShaderMaterial,
    lightRadarMesh,
  };
}
