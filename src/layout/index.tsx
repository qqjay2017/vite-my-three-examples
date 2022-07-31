import { useState } from "react";

import styled from "styled-components";
import { isMobile } from "../utils/detect-browser";
import Content from "./Content";
import Sidebar from "./Sidebar";

const LayoutStyle = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fafafa;
`;

function Layout() {
  const [open, setOpen] = useState(isMobile() ? false : true);
  const [contentKey, _setContentKey] = useState(1);
  const setContentKey = () => {
    _setContentKey(contentKey + 1);
  };

  return (
    <LayoutStyle>
      <Sidebar open={open} setOpen={setOpen} setContentKey={setContentKey} />
      <Content open={open} />
    </LayoutStyle>
  );
}

export default Layout;
