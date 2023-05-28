import { CameraControls, Center, Environment } from "@react-three/drei";
import { Shadows } from "./Shadows";
import { Ground } from "./Ground";
import { Suzi } from "./Suzi";
import { useRef } from "react";
import { button, folder, useControls } from "leva";

export const Scene = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const cameraControlsRef = useRef<CameraControls>(null!);
  const {
    minDistance,
    enabled,
    verticalDragToForward,
    dollyToCursor,
    infinityDolly,
  } = useControls({
    minDistance: { value: 0 },
    setLookAt: folder(
      {
        vec4: { value: [1, 2, 3], label: "position" },
        vec5: { value: [1, 1, 0], label: "target" },
        "setLookAt(…position, …target)": button((get) => {
          const vec4: [number, number, number] = get("setLookAt.vec4");
          const vec5: [number, number, number] = get("setLookAt.vec5");
          return cameraControlsRef.current?.setLookAt(...vec4, ...vec5, true);
        }),
      },
      { collapsed: true }
    ),

    saveState: button(() => cameraControlsRef.current?.saveState()),
    reset: button(() => cameraControlsRef.current?.reset(true)),
    enabled: { value: true, label: "controls on" },
    verticalDragToForward: {
      value: false,
      label: "vert. drag to move forward",
    },
    dollyToCursor: { value: false, label: "dolly to cursor" },
    infinityDolly: { value: false, label: "infinity dolly" },
  });
  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <Suzi ref={meshRef} rotation={[-0.63, 0, 0]} />
        </Center>
        <Ground />
        <Shadows />
        <CameraControls
          ref={cameraControlsRef}
          minDistance={minDistance}
          enabled={enabled}
          verticalDragToForward={verticalDragToForward}
          dollyToCursor={dollyToCursor}
          infinityDolly={infinityDolly}
        />

        <Environment preset="city" />
      </group>
    </>
  );
};
