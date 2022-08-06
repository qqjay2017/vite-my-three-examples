import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
// import { useControls } from "leva";
import { City2 } from "./City2";
import { Environment, OrbitControls, } from "@react-three/drei";
function Model() {

 const handleClick = (e:any)=>{
    console.log(e);
 }
  return (
    <Canvas  camera={{
      fov: 75,
      position: [723, 294, -300],
      far: 50000,
      near: 1,
    }} onClick={handleClick}>
      <Suspense fallback={null}>
      <axesHelper args={[500]} />
        <City2 position={[0, 0, 0]} />
        <OrbitControls enableDamping  />

        <Environment preset="sunset" />
       
      </Suspense>
    </Canvas>
  );
}

export default Model;
