import { useEffect } from "react";
import { MaterialLessonInstance } from "./material_lesson";

export default () => {
  useEffect(() => {
    const cameraLessonInstance = new MaterialLessonInstance();
    cameraLessonInstance.init();
    return () => {
      cameraLessonInstance.dispose();
    };
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
