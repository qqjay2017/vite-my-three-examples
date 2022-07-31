import React from "react";
import { useRoutes } from "react-router-dom";

import Layout from "/@/layout";
import { exampleRoutes } from "./helper/routeHelper";

function Routes() {
  const router = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: exampleRoutes,
    },
  ]);
  return router;
}

export default Routes;
