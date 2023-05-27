import React from "react";

import { useGLTF } from "@react-three/drei";

export const LittlestTokyo = () => {
  const { scene } = useGLTF("/model/gltf/LittlestTokyo.glb", true);

  return (
    <group>
      <scene position={[1, 1, 0]} scale={[0.01, 0.01, 0.01]}></scene>
    </group>
  );
};
