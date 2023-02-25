import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
function Router() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </Suspense>
  );
}

export default Router;
