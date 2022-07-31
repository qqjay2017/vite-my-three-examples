import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
function Router() {
  return (
    <BrowserRouter basename="/">
      <Routes />
    </BrowserRouter>
  );
}

export default Router;
