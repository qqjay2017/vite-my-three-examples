import * as THREE from 'three'
import gsap from 'gsap'
export function addSpread(shader:THREE.Shader, center = new THREE.Vector2(0, 0)) {
    // 设置扩散的中心点
    shader.uniforms.uSpreadCenter = { value: center };
    //   扩散的时间
    shader.uniforms.uSpreadTime = { value: -2000 };
    //   设置条带的宽度
    shader.uniforms.uSpreadWidth = { value: 40 };
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
        #include <common>
  
        uniform vec2 uSpreadCenter;
        uniform float uSpreadTime;
        uniform float uSpreadWidth;
        `
    );
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
       float spreadRadius = distance(vPosition.xz,uSpreadCenter);
      //  扩散范围的函数
      float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
  
      if(spreadIndex>0.0){
          gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex/uSpreadWidth);
      }
  
      //#end#
      `
    );
  
    gsap.to(shader.uniforms.uSpreadTime, {
      value: 800,
      duration: 3,
      ease: "none",
      repeat: -1,
    });
  }