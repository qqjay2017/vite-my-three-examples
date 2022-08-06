import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
// import { useControls } from "leva";
import { City2 } from "./City2";
import { Environment, Loader, OrbitControls, Sky } from "@react-three/drei";

function Model() {
  const handleClick = (e: any) => {
    console.log(e);
  };
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          position: [680, 250, -200],
          far: 50000,
          near: 1,
        }}
        shadows

        onClick={handleClick}
      >
        <Suspense fallback={null}>
          
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={2} />
          <City2 position={[0, 0, 0]} />
          <OrbitControls autoRotate enableDamping enableZoom={false}  maxPolarAngle={Math.PI/2.3} />
        </Suspense>
      </Canvas>
      
      <Loader />
    </>
  );
}

export default Model;
