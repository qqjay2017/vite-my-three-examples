import React, { Suspense, useRef, useState } from "react";
import { Canvas, MeshProps, useFrame, useLoader } from "@react-three/fiber";

import { useControls } from "leva";
import { Perf } from "r3f-perf";
import {
  CameraControls,
  PerformanceMonitor,
  Sky,
  SoftShadows,
} from "@react-three/drei";
import { Light } from "./Light";
import { Sphere } from "./Sphere";

import { RoomModel } from "./room";

export default () => {
  const { debug, enabled, samples, intensity, ...config } = useControls({
    debug: true,
    enabled: true,
    size: { value: 35, min: 0, max: 100, step: 0.1 },
    focus: { value: 0.5, min: 0, max: 2, step: 0.1 },
    samples: { value: 16, min: 1, max: 40, step: 1 },
    intensity: 0.4,
  });
  const [bad, set] = useState(false);

  return (
    <Suspense fallback={<span>loading...</span>}>
      <Canvas shadows camera={{ position: [5, 2, 10], fov: 50 }}>
        <Perf position="top-left" />
        <PerformanceMonitor
          onDecline={() => {
            console.log("onDecline", "onDecline");
            set(true);
          }}
        />
        {enabled && (
          <SoftShadows
            {...config}
            samples={bad ? Math.min(6, samples) : samples}
          />
        )}
        <CameraControls makeDefault />
        <color attach="background" args={["#d0d0d0"]} />
        <fog attach="fog" args={["#d0d0d0", 8, 35]} />
        <ambientLight intensity={intensity} />
        <Light />

        <RoomModel scale={0.5} position={[0, -1, 0]} />

        <Sphere />
        <Sphere position={[2, 4, -8]} scale={0.9} />
        <Sphere position={[-2, 2, -8]} scale={0.8} />
        <Sky inclination={0.52} />
      </Canvas>
    </Suspense>
  );
};
