import React from "react";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEquirectangularHDR } from "./useEquirectangularHDR";

export const LittlestTokyo = () => {
  useEquirectangularHDR();
  const gltf = useGLTF("/model/gltf/LittlestTokyo.glb", true);
  //   const { scene: glftScene } = gltf;
  gltf.scene.position.set(1, 1, 0);
  gltf.scene.scale.set(0.01, 0.01, 0.01);

  //   scene.add(glftScene);
  return <primitive object={gltf.scene} dispose={null} />;
};

useGLTF.preload("/model/gltf/LittlestTokyo.glb");
