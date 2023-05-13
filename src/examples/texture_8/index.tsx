import { useEffect } from "react";
import { TextureLessonInstance } from "./texture_lesson";

export default () => {
  useEffect(() => {
    const cameraLessonInstance = new TextureLessonInstance();
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
