import { useGLTF } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { forwardRef } from "react";

export const Suzi = forwardRef<THREE.Mesh, Partial<MeshProps>>((props, ref) => {
  const gltf: any = useGLTF(
    "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf"
  );
  const { nodes } = gltf;
  return (
    <>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        {...props}
      >
        <meshStandardMaterial color="#9d4b4b" />
      </mesh>
    </>
  );
});
