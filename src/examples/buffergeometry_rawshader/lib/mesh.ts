import gsap from "gsap";
import * as THREE from "three";

export function addBufferGeometry(scene: THREE.Scene) {
  const vertexCount = 200 * 3;

  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];

  for (let i = 0; i < vertexCount; i++) {
    // adding x,y,z
    positions.push(Math.random() - 0.5);
    positions.push(Math.random() - 0.5);
    positions.push(Math.random() - 0.5);

    // adding r,g,b,a
    colors.push(Math.random() * 255);
    colors.push(Math.random() * 255);
    colors.push(Math.random() * 255);
    colors.push(Math.random() * 255);
  }

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  const colorAttribute = new THREE.Float32BufferAttribute(colors, 4);
  colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("color", colorAttribute);

  // material

  const material = new THREE.RawShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
    },

    vertexShader: `
precision lowp float;
    precision mediump float;
			precision mediump int;

      uniform mat4 modelViewMatrix; // optional
			uniform mat4 projectionMatrix; // optional

      attribute vec3 position;
			attribute vec4 color;

      varying vec3 vPosition;
      varying vec4 vColor;


      void main()	{
        // position下发到片元着色器
				vPosition = position;
        vColor = color;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

    `,
    fragmentShader: `
    precision lowp float;
      precision mediump float;
			precision mediump int;

			uniform float time;

			varying vec3 vPosition;
			varying vec4 vColor;


      void main()	{
         vec4 color = vec4( vColor );
         color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
         
        gl_FragColor = color;
      }

    `,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;

  // gsap.to(mesh.material.uniforms, {
  //   time: 20,
  //   duration: 100,
  //   repeat: -1,
  //   ease: "none",
  // });
  // gsap.to(mesh.rotation, {
  //   y: Math.PI,
  //   duration: 10,
  //   repeat: -1,
  //   ease: "none",
  // });
}
