import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera: THREE.Camera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  clock: THREE.Clock,
  orbitControls: OrbitControls,
  mesh:THREE.Mesh
  ;
export default () => {
  const init = () => {
    const canvas = document.getElementById("canvas")!;
    if (!canvas) {
      return;
    }

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const groups = boxGeometry.groups;
    // 6个面不同的颜色
    const groupBasicMaterial = groups.map(
      (s) =>
        new THREE.MeshLambertMaterial({
          color: 0xffffff * Math.random(),
        })
    );

    // const meshBasicMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffffff * Math.random(),
    // });
    // const meshBasicMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xffffff * Math.random(),
    // });
     mesh = new THREE.Mesh(boxGeometry, groupBasicMaterial);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    // 辅助
    const axesHelper = new THREE.AxesHelper();
    const gridHelper = new THREE.GridHelper();
    scene.add(axesHelper,gridHelper);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(ambientLight, directionalLight);
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(2, 2, 3);
    camera.lookAt(mesh.position);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

       // 创建轨道控制器
    orbitControls = new OrbitControls(camera, canvas);

    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  const render = () => {
    const elapsedTime = clock.getElapsedTime()
   const flag = Math.round(elapsedTime*10)%2==0;
    //  mesh.rotation.z +=elapsedTime/1000;
    // x轴cos运动  y轴sin运动
    console.log(Math.cos(elapsedTime)+Math.sin(elapsedTime));
    mesh.position.set(Math.cos(elapsedTime),Math.sin(elapsedTime),0)

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
