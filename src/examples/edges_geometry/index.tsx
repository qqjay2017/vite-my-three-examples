import React, { useEffect, useRef } from "react";
import { EdgesGeometry } from "./lib";

export default () => {
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!domRef.current) {
      return;
    }
    const spread = new EdgesGeometry();
    domRef.current.appendChild(spread.renderer.domElement);
    spread.animate();
  }, []);
  return <div ref={domRef}></div>;
};
