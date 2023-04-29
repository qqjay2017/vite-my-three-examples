import { useEffect } from "react";
import { CameraLessonInstance } from "./camera_lesson";

export default () => {
  useEffect(() => {
    const cameraLessonInstance = new CameraLessonInstance();
    cameraLessonInstance.init();
  }, []);
  return (
    <div>
      <canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        id="c"
      />
    </div>
  );
};
