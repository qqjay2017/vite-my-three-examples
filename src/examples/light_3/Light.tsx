import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import * as THREE from "three";

export function Light() {
  const hemisphereLightRef = useRef<THREE.HemisphereLight>(null!);

  useHelper(hemisphereLightRef, THREE.HemisphereLightHelper, 5);

  // skyColor : Integer, groundColor : Integer, intensity : Float
  return (
    <hemisphereLight
      dispose={null}
      castShadow
      ref={hemisphereLightRef}
      args={[0x00ffff, 0xffff55, 0.2]}
      position={[0, 3, 0]}
    />
  );
}
