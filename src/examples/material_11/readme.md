## 阴影材质 ShadowMaterial

此材质可以接收阴影,

阴影产生机制:

1. 让物体产生阴影

```js
boxMesh.castShadow = true;
```

2. 平面接收阴影

```js
planeShadow.receiveShadow = true;
```

3. 光线产生阴影

```js
directionalLight.castShadow = true;
```

3. renderer 开启阴影渲染

```js
this.renderer.shadowMap.enabled = true;
```
