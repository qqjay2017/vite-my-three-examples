import React from "react";
import { RouteObject } from "react-router-dom";
import loadable from "@loadable/component";
const dynamicViewsModules = import.meta.glob("../../examples/**/index.tsx");
export function genExampleRoutes(needElement = true): RouteObject[] {
  const routes = [];

  for (const [key, value] of Object.entries(dynamicViewsModules)) {
    const pathMath = key.match(/\/examples\/(.*)\/index\.tsx$/);
    if (pathMath && pathMath.length && pathMath[1]) {
      let route: any;

      if (needElement) {
        const Element = loadable(value as any);
        route = {
          path: pathMath[1],
          exact: true,
          element: <Element />,
        };
      } else {
        route = {
          path: pathMath[1],
        };
      }
      routes.push(route);
    }
  }
  return routes;
}
