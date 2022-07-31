import React, { useEffect, useRef } from "react";
import { BuffergeometryRawshader } from "./lib";
import { observe } from "/@/utils/observerUtil";

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    let br: BuffergeometryRawshader = new BuffergeometryRawshader();

    const container = containerRef.current;

    container.appendChild(br.renderer.domElement);
    br.animate();
    observe(container, () => {
      br.resizeHandle();
    });
  }, []);
  return <div ref={containerRef}></div>;
};
