import {
  Environment,
  OrthographicCamera,
  PerspectiveCamera,
  View,
  useHelper,
} from "@react-three/drei";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useRefs from "react-use-refs";
import "./index.css";
const CameraPerspective = () => {
  let SCREEN_WIDTH = window.innerWidth;
  let SCREEN_HEIGHT = window.innerHeight;
  let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null!);
  useHelper(perspectiveCameraRef, THREE.CameraHelper);
  const { viewport } = useThree();
  console.log(viewport, "viewport viewport");
  return (
    <perspectiveCamera
      ref={perspectiveCameraRef}
      aspect={0.5 * aspect}
      fov={50}
      near={1}
      far={10000}
      rotation={[0, 0, Math.PI]}
    ></perspectiveCamera>
  );
};

const CameraOrtho = () => {
  const frustumSize = 600;
  let SCREEN_WIDTH = window.innerWidth;
  let SCREEN_HEIGHT = window.innerHeight;
  let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null!);
  useHelper(orthographicCameraRef, THREE.CameraHelper);
  const { viewport } = useThree();
  console.log(viewport, "viewport viewport22");
  return (
    <orthographicCamera
      ref={orthographicCameraRef}
      args={[
        (0.5 * frustumSize * aspect) / -2,
        (0.5 * frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        150,
        1000,
      ]}
      rotation={[0, 0, Math.PI]}
    ></orthographicCamera>
  );
};

const Mesh = ({ isCameraPerspective }: { isCameraPerspective?: boolean }) => {
  const ref1 = useRef<THREE.Mesh>(null!);
  const ref2 = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(({ clock }, delta, frame) => {
    const r = Date.now() * 0.0005;
    ref1.current.position.x = 700 * Math.cos(r);
    ref1.current.position.y = 700 * Math.sin(r);
    ref1.current.position.z = 700 * Math.sin(r);
    ref2.current.position.x = 70 * Math.cos(2 * r);
    ref2.current.position.z = 70 * Math.sin(r);
    groupRef.current.lookAt(ref1.current.position);
    // perspectiveCamera.current.lookAt(ref1.current.position);
  });

  return (
    <>
      <group ref={groupRef}>
        <CameraPerspective />
        <CameraOrtho />
        <mesh position={[0, 0, 150]}>
          <sphereGeometry args={[5, 16, 8]} />
          <meshBasicMaterial color={0x0000ff} wireframe />
        </mesh>
      </group>
      <mesh position={[0, 0, 0]} ref={ref1}>
        <sphereGeometry args={[100, 16, 8]} />
        <meshBasicMaterial color={0xffffff} wireframe={false} />
        <mesh position={[0, 150, 0]} ref={ref2}>
          <sphereGeometry args={[50, 16, 8]} />
          <meshBasicMaterial color={0x00ff00} wireframe={false} />
        </mesh>
      </mesh>
    </>
  );
};

export default () => {
  const [ref, view1, view2] = useRefs<any>([null, null, null]);
  const bufferPoints = useMemo(() => {
    const p = new Array(30000)
      .fill(0)
      .map((v) => THREE.MathUtils.randFloatSpread(2000));
    return new THREE.BufferAttribute(new Float32Array(p), 3);
  }, []);
  const [isCameraPerspective, setIsCameraPerspective] = useState(true);

  return (
    <div id="container" ref={ref}>
      <Canvas className="canvas" eventSource={ref}>
        <Mesh isCameraPerspective={isCameraPerspective} />
        <points>
          <bufferGeometry>
            <bufferAttribute attach={"attributes-position"} {...bufferPoints} />
          </bufferGeometry>
          <pointsMaterial color={0x888888}></pointsMaterial>
        </points>
      </Canvas>
    </div>
  );
};
