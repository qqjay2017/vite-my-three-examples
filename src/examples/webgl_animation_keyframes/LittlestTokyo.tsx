import { useGLTF } from "@react-three/drei";

import { useEquirectangularHDR } from "./useEquirectangularHDR";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const LittlestTokyo = () => {
  let mixer: any = null;
  useEquirectangularHDR();
  const { scene, animations } = useGLTF("/model/gltf/LittlestTokyo.glb", true);

  mixer = new THREE.AnimationMixer(scene);

  mixer.clipAction(animations[0]).play();
  useFrame((state, delta) => {
    mixer && mixer.update(delta);
    // console.log(ca);
  });
  return (
    <primitive
      object={scene}
      dispose={null}
      position={[1, 1, 0]}
      scale={[0.01, 0.01, 0.01]}
    />
  );
};

useGLTF.preload("/model/gltf/LittlestTokyo.glb");
