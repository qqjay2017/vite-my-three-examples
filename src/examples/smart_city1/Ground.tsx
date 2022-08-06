import React from "react";
import { PlaneProps, usePlane } from "@react-three/cannon";
import grass from "/@/assets/grass.jpg";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
function GroundMaterial(props: PlaneProps) {
//   const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const texture = useTexture(grass);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
   
      <meshStandardMaterial
        map={texture}
        map-repeat={[50, 50]}
        color="green"
      />
   
  );
}

export default GroundMaterial;
