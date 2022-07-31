import React, { useEffect } from "react";
import { BuffergeometryRawshader } from "./lib";

export default () => {
  useEffect(() => {
    const meshBase = new BuffergeometryRawshader();
    const container = document.getElementById("BuffergeometryRawshader");
    if (container) {
      if (container.hasChildNodes()) {
        container.removeChild(container.firstChild!);
      }
    }
    container?.appendChild(meshBase.renderer.domElement);
    meshBase.animate();
  }, []);
  return <div id="BuffergeometryRawshader"></div>;
};
