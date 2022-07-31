import React, { memo } from "react";
import { useRoutes } from "react-router-dom";

import Layout from "/@/layout";
import { genExampleRoutes } from "./helper/routeHelper";

function Routes() {
  const router = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: genExampleRoutes(),
    },
  ]);

  return router;
}

export default memo(Routes);
