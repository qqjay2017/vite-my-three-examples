export interface GeoJsonRootObject {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: (number[] | number)[][][];
}

export interface Properties {
  adcode: number | string;
  name: string;
  center?: number[];
  centroid?: number[];
  childrenNum?: number;
  level?: string;
  parent?: Parent;
  subFeatureIndex?: number;
  acroutes?: number[];
  adchar?: string;
}

export interface Parent {
  adcode: number;
}
