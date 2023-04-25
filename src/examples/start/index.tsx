import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera: THREE.Camera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  clock: THREE.Clock,
  orbitControls: OrbitControls;
export default () => {
  const init = () => {
    const canvas = document.getElementById("canvas")!;
    if (!canvas) {
      return;
    }

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    const meshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff * Math.random(),
    });
    const mesh = new THREE.Mesh(boxGeometry, meshBasicMaterial);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(2, 2, 3);
    camera.lookAt(mesh.position);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      canvas,
    });

    // 辅助
    orbitControls = new OrbitControls(camera, canvas);

    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  const render = () => {
    const uTime = clock.getElapsedTime();

    //   camera.rotateX = Math.PI

    // camera.lookAt(scene.position);
    orbitControls.update();

    renderer.render(scene, camera);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    render();
  };

  useEffect(() => {
    init();
    animate();
  }, []);
  return (
    <div>
      <canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        id="canvas"
      />
    </div>
  );
};
