import { useEffect } from "react";
import { cameraLessonInstance } from "./camera_lesson";

export default () => {
  useEffect(() => {
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
