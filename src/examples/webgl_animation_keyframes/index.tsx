import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useLoader } from "@react-three/fiber";

import * as THREE from "three";
import { LittlestTokyo } from "./LittlestTokyo";

export default () => {
  // const pmremGenerator = new THREE.PMREMGenerator(gl)

  return (
    <div id="container">
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
        <OrbitControls target={[0, 0.5, 0]} enablePan={false} enableDamping />
        <LittlestTokyo />
      </Canvas>
    </div>
  );
};
