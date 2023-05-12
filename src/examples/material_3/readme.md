## 网帽材质 MeshMatcapMaterial

MeshMatcapMaterial

在场景没有光源的情况下,模拟出物体被光照的效果,该纹理是将光源 材质信息直接在建模软件中烘焙在纹理图片上,

渲染时不需要额外的计算,性能提升明显

MeshMatcapMaterial 没有 aoMap 属性,但有 matcap 属性

不对灯光做出反应,它会投影阴影到接受阴影的物体上

单不会产生自身阴影 或者是接受阴影

由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，
其编码了材质的颜色与明暗。由于 mapcap 图像文件编码了烘焙过的光照，因此 MeshMatcapMaterial 不对灯光作出反应。
