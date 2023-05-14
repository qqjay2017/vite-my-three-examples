import { useLoader } from "@react-three/fiber";
import React from "react";
import { TextureLoader, DoubleSide } from "three";

import { floor_tiles_06 } from "/@/assets/textures/floor_tiles_06";

interface IShadowPlaneProps {
  size?: number;
}
export const ShadowPlane = ({ size = 30 }: IShadowPlaneProps) => {
  const floorMap: any = useLoader(
    TextureLoader,
    floor_tiles_06.floor_tiles_06_diff_2k
  );
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <mesh>
        <planeGeometry args={[size, size, size]} />
        <meshStandardMaterial map={floorMap} side={DoubleSide} />
      </mesh>
      <mesh receiveShadow>
        <planeGeometry args={[size, size, size]} />
        <shadowMaterial polygonOffset polygonOffsetFactor={-1} />
      </mesh>
    </group>
  );
};
