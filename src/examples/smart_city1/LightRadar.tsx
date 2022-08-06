import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from 'gsap'
export interface ILightRadarProps {
  radius: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: number | string;
  duration: number;
}

const defaultProps: ILightRadarProps = {
  radius: 20,
  position: {
    x: 50,
    y: 50,
    z: 50,
  },
  color: 0xff0000,
  duration:2
};

function LightRadar(props: Partial<ILightRadarProps>) {
  const params = {
    ...defaultProps,
    ...props,
  };
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null!)
  useEffect(()=>{
    gsap.to(shaderMaterialRef.current.uniforms.uTime, {
        value: 1,
        duration: params.duration,
        repeat: -1,
        ease: "none",
      });
  },[])
  return (
    <mesh
      position={[params.position.x, params.position.y, params.position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeBufferGeometry
        args={[params.radius, params.radius]}
      ></planeBufferGeometry>
      <shaderMaterial
      ref={shaderMaterialRef}
        uniforms={{
          uColor: { value: new THREE.Color(params.color) },
          uTime: {
            value: 0,
          },
        }}
        transparent={true}
        side={THREE.DoubleSide}
        vertexShader={`
varying vec3 vPosition;
varying vec2 vUv;

void main(){
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;
    vPosition = position;
    vUv = uv;
    
}
         `}
        fragmentShader={`
varying vec3 vPosition;
varying vec2 vUv;
uniform vec3 uColor;
uniform float uTime;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main(){
    
    vec2 newUv = rotate2d(uTime*6.28) * (vUv-0.5);
    newUv += 0.5;
    float alpha =  1.0 - step(0.5,distance(newUv,vec2(0.5)));
    
    float angle = atan(newUv.x-0.5,newUv.y-0.5);
    float strength = (angle+3.14)/6.28;
    gl_FragColor =vec4(uColor,alpha*strength);

    
    
}
        
        `}
      ></shaderMaterial>
    </mesh>
  );
}

export default LightRadar;
