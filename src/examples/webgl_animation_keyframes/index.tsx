import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useLoader } from "@react-three/fiber";

import * as THREE from "three";
import { LittlestTokyo } from "./LittlestTokyo";
import { Suspense } from "react";
import { Perf } from "r3f-perf";
// import { Loader } from "@react-three/drei";
export default () => {
  // const pmremGenerator = new THREE.PMREMGenerator(gl)

  return (
    <div id="container">
      <Suspense fallback={null}>
        <Canvas
          // scene={{
          //   background: new THREE.Color(0xbfe3dd),
          // }}
          camera={{
            fov: 40,
            near: 1,
            far: 100,
            position: [5, 2, 8],
          }}
        >
          <Perf position="top-right" />
          <OrbitControls target={[0, 0.5, 0]} enablePan={false} enableDamping />
          <Suspense fallback={null}>
            <LittlestTokyo />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};
