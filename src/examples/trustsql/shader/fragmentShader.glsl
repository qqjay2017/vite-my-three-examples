 uniform vec3 color;
  uniform sampler2D cubeTexture;
  varying float opacity;
  void main() {
      // 设置透明度
     gl_FragColor = vec4(color, opacity);
          // 设置贴图
      vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
     gl_FragColor = gl_FragColor * texture2D(cubeTexture, uv);
}