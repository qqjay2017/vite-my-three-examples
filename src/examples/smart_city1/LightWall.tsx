import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from 'gsap'
export interface ILightWallProps {
  radius: number;
  length: number;
  duration: number;
  height:number,
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: number | string;
}
const defaultParams: ILightWallProps = {
  radius: 20,
  length: 20,
  height:80,
  position: {
    x: 0,
    y: 20,
    z: 0,
  },
  duration: 1,
  color: 0xff0000,
};
function LightWall(props: Partial<ILightWallProps>) {
  const params: ILightWallProps = {
    ...defaultParams,
    ...props,
  };
  const meshRef = useRef<THREE.Mesh>(null!)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null!)
  useEffect(()=>{
    meshRef.current.geometry.computeBoundingBox()
    
    if(!meshRef.current.geometry.boundingBox){
        return
    }
    let { min, max } = meshRef.current.geometry.boundingBox;
    let uHeight = max.y - min.y;
    shaderMaterialRef.current.uniforms.uHeight = {
        value:100
    }
    gsap.to(meshRef.current.scale,{
        x:params.length,
        z:params.length,
        duration:params.duration,
        repeat: -1,
      yoyo: true,
    })
  },[])
  return (
    <mesh 
        ref={meshRef}
    position={[params.position.x, params.position.y, params.position.z]}>
      <cylinderBufferGeometry
        args={[params.radius, params.radius, params.height, 32, 1, true]}
      ></cylinderBufferGeometry>
      <shaderMaterial
      uniforms={{
        uHeight:{
            value:0
        }
      }}
        ref={shaderMaterialRef}
        transparent={true}
        side={THREE.DoubleSide}
        vertexShader={`
        varying vec3 vPosition;

        void main(){
            vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
            gl_Position = projectionMatrix * viewPosition;
            vPosition = position;
            
        }
        
        `}
        fragmentShader={`
        varying vec3 vPosition;
        uniform float uHeight;
        void main(){
            // 设置混合的百分比
                float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
              gl_FragColor = vec4(1,1,0,1.0-gradMix);
            
        }
            
            
            `}
      ></shaderMaterial>
    </mesh>
  );
}

export default LightWall;
