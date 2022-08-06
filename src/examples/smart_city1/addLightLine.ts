import * as THREE from 'three'
import gsap from 'gsap'
export function addLightLine(shader:THREE.Shader) {
    //   扩散的时间
    shader.uniforms.uLightLineTime = { value: -1500 };
    //   设置条带的宽度
    shader.uniforms.uLightLineWidth = { value: 200 };
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
          #include <common>
    
          
          uniform float uLightLineTime;
          uniform float uLightLineWidth;
          `
    );
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
        float LightLineMix = -(vPosition.x+vPosition.z-uLightLineTime)*(vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;
    
        if(LightLineMix>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(0.8,1.0,1.0,1),LightLineMix /uLightLineWidth);
            
        }
    
        //#end#
        `
    );
  
    gsap.to(shader.uniforms.uLightLineTime, {
      value: 1500,
      duration: 5,
      ease: "none",
      repeat: -1,
    });
  }