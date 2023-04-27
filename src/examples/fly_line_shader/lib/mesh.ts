import gsap from "gsap";
import * as THREE from "three";
import { genId } from "/@/utils/genId";

export interface AddSpreadFnProps {
  scene?: THREE.Scene;
 
  duration?: number;
  id?: string;
  pointLength?: number;
  position?: {
    x: number;
    z: number;
  };
  color?: number | string;
}
const defaultParams = {
  duration:2,
  pointLength:1000,
  position: { x: 20, z: 0 },
  color: 0x00ffff,

  id: genId(),
};
export function addFlyLine(_params: AddSpreadFnProps) {
  const params = {
    ...defaultParams,
    ..._params,
  };
  const { scene, id, position, color ,pointLength} = params;
  // 根据点生成曲线
  let linePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(position.x / 2, 4, position.z / 2),
    new THREE.Vector3(position.x, 0, position.z),
    // new THREE.Vector3(0, 0, 0),
    // new THREE.Vector3(10, 10,0),
    // new THREE.Vector3(20, 0, 0),
 
   
   
  ];
  // 创建曲线
  const lineCurve = new THREE.CatmullRomCurve3(linePoints,true);
  const points = lineCurve.getPoints(pointLength);

  const flyLineGeometry = new THREE.TubeGeometry().setFromPoints(points);
  // 给每一个顶点设置属性
  const aSizeArray = new Float32Array(pointLength);
  for (let i = 0; i < pointLength; i++) {
    aSizeArray[i] = i;
  }

  const aSizeKey = `aSize_${id}`
  flyLineGeometry.setAttribute(aSizeKey, new THREE.BufferAttribute(aSizeArray, 1));

const uTimeKey = `uTime_${id}`
const uColorKey = `uColor_${id}`
const uLengthKey = `uLength_${id}`
const vSizeKey = `vSize_${id}`
  const flyLineShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      [uTimeKey]: {
        value: 0,
      },
      [uColorKey]: {
        value: new THREE.Color(color),
      },
      [uLengthKey]: {
        value: pointLength,
      },
    },
    transparent: true,
    // 关闭深度叠加检测
    depthWrite: false,
    blending:THREE.AdditiveBlending,
    vertexShader:`
        
attribute float ${aSizeKey};

uniform float ${uTimeKey};
uniform vec3 ${uColorKey};
uniform float ${uLengthKey};

varying float ${vSizeKey};

void main(){
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    ${vSizeKey} = (${aSizeKey} - ${uTimeKey});
    if(${vSizeKey} < 0.0){
      ${vSizeKey} = ${vSizeKey} + ${uLengthKey} ;
    }


    ${vSizeKey} = (${vSizeKey} -500.0)* 0.2;

    gl_PointSize = -${vSizeKey} / viewPosition.z;
}
    
    `,
    fragmentShader:`

varying float ${vSizeKey};
uniform vec3 ${uColorKey};

void main(){

    float distanceToCenter${id} = distance( gl_PointCoord , vec2( 0.5 , 0.5 ) );
    // 强弱程度
    float strength${id} = 1.0 - (distanceToCenter${id} * 2.0);

    if(${vSizeKey} <= 0.0){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
    }else {
        gl_FragColor = vec4(${uColorKey}, strength${id});
    }
    
}
    
    `
  });
  const flyMeshMesh = new THREE.Points(flyLineGeometry, flyLineShaderMaterial);

  gsap.to(flyLineShaderMaterial.uniforms[uTimeKey], {
    value: pointLength ,
    duration: params.duration,
    repeat: -1,
    ease: "none",
  });

  scene && scene.add(flyMeshMesh);

  return {
    flyLineGeometry,
    flyLineShaderMaterial,
    flyMeshMesh,
  };
}
