attribute float size;
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
}