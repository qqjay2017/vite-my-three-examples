import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

export const useEquirectangularHDR = () => {
  const { gl, scene } = useThree();
  scene.background = new THREE.Color(0xbfe3dd);
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  return {};
};
