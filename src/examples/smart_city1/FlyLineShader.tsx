import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";


export interface IFlyLineProps {
  position:{x:number,y:number,z:number},
  texturePath: string;
  duration: number;
  lineWidth: number;
  color:number|string;
  count:number;
}

const defaultFlyLineProp: IFlyLineProps = {
  position:{
    x:0,
    y:40,
    z:40
  },
  texturePath: "/textures/z_11.png",
  duration: 2,
  lineWidth: 3,
  color:0x00ffff,
  count:1000
};


function FlyLineShader(props:Partial<IFlyLineProps>) {
  const bufferGeometryRef = React.useRef<THREE.BufferGeometry>(null!);
  const shaderMaterialRef = React.useRef<THREE.ShaderMaterial>(null!);
  const params:IFlyLineProps = {
 ...defaultFlyLineProp,
 ...props
  }
  const pointsInfo = useMemo(()=>{
    const position =  params.position
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x /2, position.y, position.z/2),
      new THREE.Vector3(position.x, 0, position.z),
    ];
    const lineCurve = new THREE.CatmullRomCurve3(linePoints);
    const points = lineCurve.getPoints(params.count);
    const aSizeArray = new Float32Array(params.count);
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i;
    }
    return {
      linePoints,
      points,
      aSizeArray
    }
  },[params.position,params.count]);
  useEffect(() => {
    bufferGeometryRef.current.setFromPoints(pointsInfo.points);
    bufferGeometryRef.current.setAttribute(
      "aSize",
      new THREE.BufferAttribute(pointsInfo.aSizeArray, 1)
    );
    gsap.to(shaderMaterialRef.current.uniforms.uTime, {
      value: params.count,
      duration: params.duration,
      repeat: -1,
      ease: "none",
    });
  }, []);
  return (
    <points>
      <bufferGeometry ref={bufferGeometryRef}></bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        uniforms={{
          uTime: {
            value: 0,
          },
          uColor: {
            value: new THREE.Color(params.color),
          },
          uLength: {
            value: params.count,
          },
        }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
attribute float aSize;

uniform float uTime;
uniform vec3 uColor;
uniform float uLength;

varying float vSize;

void main(){
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;
    vSize = (aSize-uTime);
    if(vSize<0.0){
        vSize = vSize + uLength; 
    }
    vSize = (vSize-${(params.count /2).toFixed(1)})*0.1;
    
    gl_PointSize = -vSize/viewPosition.z;
}

        `}
        fragmentShader={`
varying float vSize;
uniform vec3 uColor;
void main(){
float distanceToCenter = distance(gl_PointCoord,vec2(0.5,0.5));
float strength = 1.0 - (distanceToCenter*2.0);

if(vSize<=0.0){
    gl_FragColor = vec4(1,0,0,0);
}else{
    gl_FragColor = vec4(uColor,strength);
} 
}
    
    `}
      ></shaderMaterial>
    </points>
  );
}

export default FlyLineShader;
