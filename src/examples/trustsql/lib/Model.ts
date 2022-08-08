import * as THREE from "three";
const u = `attribute float size;
  attribute vec2 random;
  attribute vec3 position0;
  attribute vec3 position1;
  attribute vec3 position2;
  // 运动轨迹 0 ~ 2.0
  uniform float val;
  // 散开粒子数量 与 模型粒子数量 的比。0 ~ 1，模型粒子数越多，值越小
  uniform float prob;
  // 帧渲染时间，不断变大
  uniform float time;
  uniform float explode;
  uniform float gather;
  uniform int status;
  // 透明度
  varying float opacity;
  
  void explodeModel() {
      // 位置控制
       float value = explode;
         // 粒子延迟出发位置
         
       float delay = random.x * 0.4;
          // 运动终点位置
       float to = 1.0;
        // 动画长度
         float duration = to - delay;
          // 取两个 delay 的中间值
           value = clamp(value, delay, to);
                   // 变化比例
             float rate = (value - delay) / duration;
                      // 计算中间位置
         vec3 vPos = mix(position0, position1, rate);
                          // 渲染位置
         gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1.0 );
          // 渲染粒子大小
           gl_PointSize = max((500.0 - gl_Position.z) / 1000.0 * 8.0, 2.0);
            // 粒子运动时的透明度变化
              opacity = step(-399.0, vPos.y) * max((500.0 - gl_Position.z) / 1000.0 * 1.0, 0.8);
            }
            
            void gatherModel() {
               // 位置控制
                float value = gather;
                  // 粒子延迟出发位置
                    float delay = random.x * 0.4;
                      // 运动终点位置
                        float to = 1.0;
                         // 动画长度
                          float duration = to - delay;
                           // 取两个 delay 的中间值
                            value = clamp(value, delay, to);
                              // 变化比例
                                float rate = (value - delay) / duration;
                                 // 计算中间位置
                                   vec3 vPos = mix(position1, position, rate);
                                     // 渲染位置
                                      gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1.0 );
                                       // 渲染粒子大小
                                        float ps0 = max((500.0 - gl_Position.z) / 1000.0 * 8.0, 2.0);
                                          float ps1 = max((500.0 - gl_Position.z) / 1000.0 * 8.0, 4.0);
                                           gl_PointSize = mix(ps0, ps1, rate);
                                             // 粒子运动时的透明度变化
                                             opacity = step(-399.0, vPos.y) * max((500.0 - gl_Position.z) / 1000.0 * 1.0, 0.8);
                                            }
                                            
                                            void model() {
                                               // 位置控制
                                                 float value = val;
                                                   // 粒子延迟出发位置
                                                     float delay = random.x * 0.4;
                                            
                                            // 运动终点位置
                                             float to = 2.0;
                                              // 动画长度
                                                float duration = to - delay;
                                                  // 取两个 delay 的中间值
                                                    value = clamp(value, delay, to);
                                                     // 变化比例
                                                       float rate = (value - delay) / duration;
                                                        // 计算中间位置
                                                          vec3 vPos = mix(position, position2, rate);
                                                          
                                                          float PI = radians(180.0); // π
                                                            vPos.y = vPos.y + step(-399.0, vPos.y) * sin((rate/1.0) * PI) * 100.0;
                                                            
                                                            // 渲染位置
                                                            
                                                            gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1.0 );
                                                             // 渲染粒子大小: rate 为 0 时，取 size 的值，大于 0 时取 min(...) 的值
                                                               float type = step(rate, 0.00001);
                                                                gl_PointSize = type * size + (1.0 - type) * min(size * max(1.0, (vPos.z / 85.0 - 1.0)), 8.0);
                                                                
                                                                // 用于闪烁的透明度，闪烁10s一次循环，透明度 0.2 ~ 1.0渐变
                                                                
                                                                float t = mod(time, 10000.0) / 10000.0;
                                                                  float randomOpacity = mix(0.2, 1.0, min(10.0 - abs(10.0 - 20.0 * abs(random.x - t)), 1.0));
                                                                   // 控制显示粒子数量的透明度
                                                                     float probOpacity = (random.y > prob) ? max((0.2 - rate) * 5.0, 0.0) : 1.0;
                                                                    // 远处粒子模糊透明度
                                                                      float distanOpacity = clamp(gl_Position.z / 100.0 + 2.5, 0.1, 1.0);
                                                                     // 粒子切换运动透明度
                                                                       float moveOpacity = 1.0 - rate;
                                                                       // 取透明度最小值
                                                                       opacity = min(moveOpacity, min(probOpacity, min(randomOpacity, distanOpacity)));
                                                                         opacity = step(-399.0, vPos.y) * opacity;
                                                                        }
                                                                        
                                                                        void main() {
                                                                            if(status == 1){
                                                                                  explodeModel();
                                                                                  } else if (status == 2){
                                                                                        gatherModel();
                                                                                        } else {
                                                                                              model();
                                                                                              }
}`;
const f =
  `
  uniform vec3 color;
  uniform sampler2D cubeTexture;
  varying float opacity;
  void main() {
      // 设置透明度
        gl_FragColor = vec4(color, opacity);
          // 设置贴图
            vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
              gl_FragColor = vec4(255.0,0,0,1);
            }`;

export class Model {
  val = 1000;
  pointSize = 4;
  pointCount = 5000;
  showPointCount = 500;
  materialColor = 0xffffff;
  modelGroup = new THREE.Group();
  particleSystem: THREE.Points = null!;
  surfaceMaterial: THREE.MeshLambertMaterial = null!;
  isBallModel = !1;
  surfaceOpacity = 0;
  degreeX = 0;
  degreeY = 0;
  movedDegreeX = 0;
  movedDegreeY = 0;
  statusValue = 1;
  rotateType = !1;
  rotateCount = -1.78;
  rotateTime = 5000;
  scene: THREE.Scene = null!;
  width: number = 0;
  height = 0;
  particleModel: THREE.Group = null!;
  surfaceModels: THREE.Group = null!;
  bufferSize: Float32Array = new Float32Array(5e3);
  bufferRandom: Float32Array = new Float32Array(5e3 * 2);
  bufferLeavePos: Float32Array = new Float32Array(5e3 * 3);
  shaderMaterial: THREE.ShaderMaterial = null!;
  constructor({ scene }: { scene: THREE.Scene }) {
    this.scene = scene;
    this.width = 500;
    this.height = 500;
  }

  init() {
    const uniforms = {
      color: {
        type: "v3",
        value: new THREE.Color(this.materialColor),
      },
      cubeTexture: {
        type: "t",
        value: this.getCubeTexture(),
      },
      val: {
        value: this.val,
      },
      prob: { value: 3 },
      time: { value: 999999 },
      explode: { value: 0 },
      gather: { value: 0 },
      status: { value: 2 },
    };
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: u,
      fragmentShader: f,
      // depthTest: !0,
      transparent: true,
    });
    let i = new Float32Array(3 * this.pointCount);
    let n = new Float32Array(3 * this.pointCount);
    for (let index = 0; index < this.pointCount; index++) {
      this.bufferSize[index] = this.pointSize;
      this.bufferRandom[2 * index + 1] = Math.random();
      const s = THREE.MathUtils.randFloat(-2500, 2500);
      const l = THREE.MathUtils.randFloat(-2500, 2500);
      this.bufferLeavePos[3 * index] = s;
      this.bufferLeavePos[3 * index + 1] = -400;
      this.bufferLeavePos[3 * index + 2] = l;
      i[3 * index] = s;
      i[3 * index + 1] = -400;
      i[3 * index + 2] = l;
      n[3 * index] = s;
      n[3 * index + 1] = -400;
      n[3 * index + 2] = l;
      if (index < 900) {
        i[3 * index] = -300;
        i[3 * index + 1] = 0;
        i[3 * index + 2] = 0;
        n[3 * index] = THREE.MathUtils.randFloat(-200 - index, 200 + index);
        n[3 * index + 1] = THREE.MathUtils.randFloat(-250 - index, 250 + index);
        n[3 * index + 2] = THREE.MathUtils.randFloat(-200 - index, 200 + index);
      }
    }
    const h = this.getBufferGeometry({
      bufferRandom: this.bufferRandom,
      bufferSize: this.bufferSize,
      bufferLeavePos: this.bufferLeavePos,
    });
    h.setAttribute("position0", new THREE.BufferAttribute(i, 3));
    h.setAttribute("position1", new THREE.BufferAttribute(n, 3));
    this.particleSystem = new THREE.Points(h, this.shaderMaterial);
    this.modelGroup.add(this.particleSystem);
    this.scene.add(this.particleSystem);
    this.surfaceMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(4623586),
      opacity: this.surfaceOpacity,
      depthTest: !1,
      transparent: !0,
      side: THREE.DoubleSide,
    });
    const cube = new THREE.BoxGeometry(5, 5, 5);
    const cubeMesh = new THREE.Mesh(
      cube,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(cubeMesh);
    const p = new THREE.PointLight(16777215, 0.4, 1e3);
    p.position.set(0, 200, 500);
    this.scene.add(p);
    const c = new THREE.PointLight(16777215, 0.2, 1e3);
    c.position.set(0, -200, 500);
    this.scene.add(c);
    const v = new THREE.Object3D();
    v.position.set(0, 0, 0);

    const m = new THREE.SpotLight(16777215, 2, 1e3, Math.PI / 8, 0.2);
    m.position.set(0, 0, 600);
    m.target = v;
    const y = new THREE.Group();
    y.add(m, v);
    this.scene.add(y);
    const g = new THREE.Object3D();
    g.position.set(0, 0, 0);

    const b = new THREE.SpotLight(16777215, 2, 1e3, Math.PI / 8, 0.2);
    b.position.set(0, 0, 600);
    b.target = g;
    const w = new THREE.Group();
    w.add(b, g);
    this.scene.add(w);
  }
  enter() {}
  getBufferGeometry({
    bufferSize,
    bufferRandom,
    bufferLeavePos,
  }: {
    bufferSize: Float32Array;
    bufferRandom: Float32Array;
    bufferLeavePos: Float32Array;
  }): THREE.BufferGeometry {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(bufferSize, 1)
    );
    bufferGeometry.setAttribute(
      "random",
      new THREE.BufferAttribute(bufferRandom, 2)
    );
    bufferGeometry.setAttribute(
      "position2",
      new THREE.BufferAttribute(bufferLeavePos, 3)
    );
    return bufferGeometry;
  }
  setModelByIndex() {}
  getPos() {}
  getParticleSystem() {}
  deleteBall() {}
  setBallModel() {}
  setModel() {}
  spread() {}
  pTween() {}
  getModelByName() {}
  getCubeTexture() {
    return new THREE.TextureLoader().load("/textures/box.png");
  }
  onMouseMove() {}
  onResize() {}
  onRequestAnimationFrame() {}
}
