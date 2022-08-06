import { Canvas } from "@react-three/fiber";
import  { Suspense } from "react";
// import { useControls } from "leva";
import { City2 } from "./City2";
import { Environment, Loader, OrbitControls, } from "@react-three/drei";

function Model() {

 const handleClick = (e:any)=>{
    console.log(e);
 }
  return (
    <>
    <Canvas  camera={{
      fov: 75,
      position: [723, 294, -300],
      far: 50000,
      near: 1,
    }} onClick={handleClick}>
      <Suspense fallback={null}>
      <axesHelper args={[500]} />
        <City2 position={[0, 0, 0]} />
        <OrbitControls autoRotate enableDamping  />

        
       
      </Suspense>
    </Canvas>
    // https://www.npmjs.com/package/@react-three/drei#usegltf
    <Loader />
    </>
  );
}

export default Model;
