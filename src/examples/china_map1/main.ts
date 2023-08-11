import * as THREE from "three";
import { GeoJsonRootObject } from "./interface";
import * as d3 from "d3";

import { getControls } from "/@/lib-common/controls";
const projection = d3.geoMercator().center([116.5, 38.5]).translate([0, 0]);
const scene = new THREE.Scene();
const map = new THREE.Object3D();
// 辅助
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 物体

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(directionalLight);
scene.add(ambientLight);
// 渲染器

function createMesh(polygon: (number | number[])[][]) {
  // 做一个平面
  const shape = new THREE.Shape();
  polygon.forEach((row, i) => {
    // 经纬度转换
    const [longitude = 0, latitude = 0] = projection(row as any) || [];
    if (i == 0) {
      shape.moveTo(longitude, -latitude);
    }
    shape.lineTo(longitude, -latitude);
  });
  // 平面挤出物体

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 5 });
  // 创建随机颜色
  const color = new THREE.Color(Math.random() * 0xffffff);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
  });
  return new THREE.Mesh(geometry, material);
}

export function operationData(
  jsonData: GeoJsonRootObject,
  { map }: { map: THREE.Object3D }
) {
  // 获取所有的特征
  const features = jsonData.features;
  features.forEach((feature) => {
    // 创建省份的物体
    const province: any = new THREE.Object3D();

    province.properties = feature.properties.name;
    const coordinates = feature.geometry.coordinates;
    const geometryType = feature.geometry.type;
    if (geometryType == "MultiPolygon") {
      // 多多边形
      coordinates.forEach((item) => {
        item.forEach((coordinate) => {
          const mesh: any = createMesh(coordinate as any);
          mesh.properties = feature.properties.name;
          province.add(mesh);
        });
      });
    } else if (geometryType == "Polygon") {
      // 多边形
      coordinates.forEach((coordinate) => {
        const mesh: any = createMesh(coordinate);
        mesh.properties = feature.properties.name;
        province.add(mesh);
      });
    }

    map.add(province);
  });
}
