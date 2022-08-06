import { extend } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { LightRadar } from "./lib";
import * as THREE from 'three'
export default () => {
  const domRef = useRef<HTMLDivElement>(null);
 useMemo(()=>extend(THREE),[])
  // useEffect(() => {
  //   if (!domRef.current) {
  //     return;
  //   }
  //   const spread = new LightRadar();
  //   domRef.current.appendChild(spread.renderer.domElement);
  //   spread.animate();
  // }, []);
 
  return <div ref={domRef}>
    {
     <mesh />
    }
   
  </div>;
};
