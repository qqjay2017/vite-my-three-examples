import React, { useRef, useState } from "react";
import { Canvas, MeshProps, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import {
  CameraControls,
  Environment,
  PerformanceMonitor,
  Sky,
  SoftShadows,
} from "@react-three/drei";
import { Light } from "./Light";
import { Sphere } from "./Sphere";
import { ShadowPlane } from "./ShadowPlane";
function Box(props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null!);

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame(() => {
    ref.current.rotation.x += 0.01;
  });
  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "#fff"} />
    </mesh>
  );
}

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
    <Canvas shadows camera={{ position: [5, 2, 10], fov: 50 }}>
      <Perf position="top-left" />
      <PerformanceMonitor onDecline={() => set(true)} />
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
      <ShadowPlane />

      <Box position={[-1, 1, 1]} />
      <Box position={[1, 1, 1]} />
      <Sphere />
      <Sphere position={[2, 4, -8]} scale={0.9} />
      <Sphere position={[-2, 2, -8]} scale={0.8} />
      <Sky inclination={0.52} />
    </Canvas>
  );
};
