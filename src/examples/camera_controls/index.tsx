import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export default () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }}>
      <Scene />
    </Canvas>
  );
};
