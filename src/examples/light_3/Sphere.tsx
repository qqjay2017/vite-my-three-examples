import { Float } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import * as THREE from "three";

interface SphereProps extends Partial<MeshProps> {
  floatIntensity?: number;
  color?: string;
}
export function Sphere({
  color = "hotpink",
  floatIntensity = 15,
  position = [0, 5, -8],
  scale = 1,
}: SphereProps) {
  return (
    <Float floatIntensity={floatIntensity}>
      <mesh castShadow position={position} scale={scale}>
        <sphereGeometry />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </Float>
  );
}
