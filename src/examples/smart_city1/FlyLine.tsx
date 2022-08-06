import { CatmullRomLine } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useFrame, useLoader } from "@react-three/fiber";

export interface IFlyLineProps {
  position:{x:number,y:number,z:number},
  texturePath: string;
  duration: number;
  lineWidth: number;
}

const defaultFlyLineProp: IFlyLineProps = {
  position:{
    x:0,
    y:40,
    z:0
  },
  texturePath: "/textures/z_11.png",
  duration: 2,
  lineWidth: 2,
};

function FlyLine(props: Partial<IFlyLineProps>) {
  const params = {
    ...defaultFlyLineProp,
    ...props,
  };
  const linePoints = useMemo(()=>{
    const position  = params.position;
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, position.y, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z),
    ]
  },[params.position]);

  const texture = useLoader(THREE.TextureLoader, params.texturePath);
  useEffect(()=>{
    texture.repeat.set(1, 2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
  },[texture])
 
  useEffect(() => {
    gsap.to(texture.offset, {
      x: -1,
      duration: params.duration,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <mesh>
      <tubeBufferGeometry
        args={[
          new THREE.CatmullRomCurve3(linePoints),
          100,
          params.lineWidth,
          2,
          false,
        ]}
      ></tubeBufferGeometry>
      <meshBasicMaterial map={texture} transparent={true}></meshBasicMaterial>
    </mesh>
  );
}

export default FlyLine;
