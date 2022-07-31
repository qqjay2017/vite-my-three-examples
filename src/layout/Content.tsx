import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { sizeConstant } from "../constant/sizes";

const ContentStyle = styled.div<{ open: boolean }>`
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  position: fixed;
  top: 0;
  left: 0;
  margin-left: ${(props) =>
    props.open ? sizeConstant.sidebarSize : sizeConstant.sidebarCloseSize};
  z-index: 1;
  overflow-x: hidden;
  padding: ${sizeConstant.normalSpace};
`;
function Content({ open }: { open: boolean }) {
  return (
    <ContentStyle open={open}>
      <Outlet />
    </ContentStyle>
  );
}

export default Content;
