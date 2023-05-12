## 标准材质 MeshStandardMaterial

基于物理(PBR)的标准材质

```
MeshStandardMaterial和MeshPhysicalMaterial类是PBR物理材质，可以更好的模拟光照计算，
相比光网格材质MeshPhongMaterial渲染效果更逼真。
```

- 更精确更逼真的结果
- 代价是计算成本高
- 为获取最佳效果,使用时应始终制定 environgmentMap
- 计算作色部分和 MeshPhongMaterial 一样
- 具体案例看 texture_10
-
