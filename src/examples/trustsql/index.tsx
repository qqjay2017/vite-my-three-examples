import React, { useEffect, useRef } from 'react';
import { WebGl } from './lib/webgl';



export default ()=>{
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const webGl = new WebGl()
    webGl.init()
    divRef.current?.appendChild(webGl.renderer.domElement)
    webGl.animate()
  },[])


  return <div ref={divRef}></div>
}
