import * as THREE from "three";
export function addGradColor(shader: THREE.Shader, mesh:THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>) {
    mesh.geometry.computeBoundingBox();
    //   console.log(mesh.geometry.boundingBox);
    if(!mesh.geometry.boundingBox){
        return
    }
    let { min, max } = mesh.geometry.boundingBox;
    //   获取物体的高度差
    let uHeight = max.y - min.y;
  
    shader.uniforms.uTopColor = {
      value: new THREE.Color("#D1C4E9"),
    };
    shader.uniforms.uHeight = {
      value: uHeight,
    };
  
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
        #include <common>
        varying vec3 vPosition;
        `
    );
  
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
        #include <begin_vertex>
        vPosition = position;
    `
    );
  
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
        #include <common>
        
        uniform vec3 uTopColor;
        uniform float uHeight;
        varying vec3 vPosition;
  
          `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "//#end#",
      `
        
        vec4 distGradColor = gl_FragColor;
  
        // 设置混合的百分比
        float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
        // 计算出混合颜色
        vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
        gl_FragColor = vec4(gradMixColor,1);
          //#end#
  
        `
    );
  }