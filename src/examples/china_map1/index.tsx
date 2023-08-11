import { useEffect, useRef } from "react";

import { China3dMap } from "./China3dMap";

export default () => {
  const domElementWrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const china3dMap = new China3dMap();
    china3dMap.init();
    return () => {
      china3dMap.dispose();
    };
  }, []);
  return (
    <div ref={domElementWrap}>
      <canvas
        id="c"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></canvas>
    </div>
  );
};
