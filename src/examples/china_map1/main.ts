import * as THREE from "three";
import { GeoJsonRootObject } from "./interface";
import * as d3 from "d3";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

const projection = d3.geoMercator().center([116.5, 38.5]).translate([0, 0]);
const scene = new THREE.Scene();

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
  {
    map,
    outlinePass,
  }: { map: THREE.Object3D; outlinePass?: OutlinePass | null }
) {
  // 获取所有的特征
  const features = jsonData.features;
  features.forEach((feature) => {
    // 创建省份的物体
    const province: any = new THREE.Object3D();

    province.properties = feature.properties.name;
    province.userData = {
      ...province.userData,
      ...feature.properties,
    };
    const coordinates = feature.geometry.coordinates;
    const geometryType = feature.geometry.type;
    if (geometryType == "MultiPolygon") {
      // 多多边形
      coordinates.forEach((item) => {
        item.forEach((coordinate) => {
          const mesh: any = createMesh(coordinate as any);
          mesh.properties = feature.properties.name;
          mesh.userData = {
            ...mesh.userData,
            ...feature.properties,
          };
          province.add(mesh);
          const line = createLine(coordinate);
          province.add(line);
        });
      });
    } else if (geometryType == "Polygon") {
      // 多边形
      coordinates.forEach((coordinate) => {
        const mesh: any = createMesh(coordinate);
        mesh.properties = feature.properties.name;
        mesh.userData = {
          ...mesh.userData,
          ...feature.properties,
        };
        province.add(mesh);
        const line = createLine(coordinate);
        province.add(line);
      });
    }
    outlinePass?.selectedObjects.push(province);

    map.add(province);
  });
}

/**
 * 通过点生成线几何体
 * @param polygon
 */

function createLine(polygon: any[] = []) {
  const lineGeometry = new THREE.BufferGeometry();
  const pointsArray: THREE.Vector3[] = [];
  polygon.forEach((row, i) => {
    const [longitude = 0, latitude = 0] = projection(row as any) || [];
    pointsArray.push(new THREE.Vector3(longitude, -latitude, 5.4));
  });
  lineGeometry.setFromPoints(pointsArray);
  const color = new THREE.Color(Math.random() * 0xffffff);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
  });
  return new THREE.Line(lineGeometry, lineMaterial);
}
