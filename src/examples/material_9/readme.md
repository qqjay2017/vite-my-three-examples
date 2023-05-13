## 物理网格材质 MeshPhysicalMaterial

基于物理(PBR)的标准材质

```
MeshStandardMaterial和MeshPhysicalMaterial类是PBR物理材质，可以更好的模拟光照计算，
相比光网格材质MeshPhongMaterial渲染效果更逼真。
```

- 高级光线反射,为非金属提供了更多更灵活的光线反射
- 对 MeshStandardMaterial 的扩展 , 提供了更高级的基于物理(PBR)的渲染属性,能够更好的控制反射率
- clearcoat 具有反光特性,反射率
- transmission 球体的厚薄程度,数值越大,球体越薄
- ior: 1.0, 为非金属材质所设置的折射率，范围由 1.0 到 2.333。

- thickness: 1.0,曲面下体积的厚度
- reflectivity 反射率 由 0.0 到 1.0。默认为 0.5, 相当于折射率 1.5。这模拟了非金属材质的反射率。当 metalness 为 1.0 时，此属性无效
