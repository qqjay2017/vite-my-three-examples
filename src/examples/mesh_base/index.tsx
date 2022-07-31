import React, { useEffect } from "react";
import { MeshBase } from "./lib";

export default () => {
  useEffect(() => {
    const meshBase = new MeshBase();
    document
      .getElementById("MeshBase")
      ?.appendChild(meshBase.renderer.domElement);
    meshBase.animate();
  }, []);
  return <div id="MeshBase"></div>;
};
