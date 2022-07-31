import React from "react";
import { RouteObject } from "react-router-dom";
import loadable from "@loadable/component";
const dynamicViewsModules = import.meta.glob("../../examples/**/index.tsx");
export function genExampleRoutes(): RouteObject[] {
  const routes = [];
  for (const [key, value] of Object.entries(dynamicViewsModules)) {
    const pathMath = key.match(/\/examples\/(.*)\/index\.tsx$/);
    if (pathMath && pathMath.length && pathMath[1]) {
      const Element = loadable(value as any);
      const route = {
        path: pathMath[1],
        exact: true,
        element: <Element />,
      };
      routes.push(route);
    }
  }
  return routes;
}

export const exampleRoutes = genExampleRoutes();
