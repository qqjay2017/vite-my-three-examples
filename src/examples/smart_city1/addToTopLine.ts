import * as THREE from 'three'
import gsap from 'gsap'
export function addToTopLine(shader:THREE.Shader) {
    //   扩散的时间
    shader.uniforms.uToTopTime = { value: 0 };
    //   设置条带的宽度
    shader.uniforms.uToTopWidth = { value: 40 };
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
            #include <common>
      
            
            uniform float uToTopTime;
            uniform float uToTopWidth;
            `
    );
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
          float ToTopMix = -(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;
      
          if(ToTopMix>0.0){
              gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1,1),ToTopMix /uToTopWidth);
              
          }
      
          //#end#
          `
    );
  
    gsap.to(shader.uniforms.uToTopTime, {
      value: 500,
      duration: 3,
      ease: "none",
      repeat: -1,
    });
  }