import { useState } from "react";
import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";
import styled from "styled-components";
import { colorConstant, sizeConstant } from "../constant";
import { exampleRoutes } from "../router/helper/routeHelper";
import { isMobile } from "../utils/detect-browser";
import three_icon from "/@/assets/svg/three_icon.svg";
// import { useMediaQuery } from "react-responsive";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
const SidebarStyle = styled.div`
  height: 100%;
  background-color: #fafafa;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  overflow-x: hidden;

  transition: 0.3s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  position: relative;

  &.open {
    width: ${sizeConstant.sidebarSize};
  }
  &.close {
    width: ${sizeConstant.sidebarCloseSize};
  }
`;

const Title = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 8px 0;
  color: ${colorConstant.primaryTextColor};
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.div`
  margin-left: 8px;
`;

const ThreeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const SidebarBody = styled.div`
  padding: ${sizeConstant.normalSpace};
  padding-right: 0;
  padding-bottom: 30px;
`;
const LinkStyle = styled(Link)`
  text-decoration: none;
  position: relative;
  color: ${colorConstant.secondaryTextColor};
  transition: all 0.5s;
  &.active {
    color: ${colorConstant.primaryColor};
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 8px;
      width: 2px;
      height: 16px;
      background-color: ${colorConstant.primaryColor};
    }
  }
`;
const LinkTextStyle = styled.div`
  font-size: 14px;
  padding: 8px 0;
  user-select: none;
`;

const SidebarFooter = styled.div<{ open: boolean }>`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.open ? "flex-end" : "center")};
  padding: 0 ${sizeConstant.normalSpace};
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const ToggleIconWrap = styled.div`
  padding: 10px;
  cursor: pointer;
`;

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <LinkStyle className={match ? "active" : ""} to={to} {...props}>
        {children}
      </LinkStyle>
    </div>
  );
}

function Sidebar({ open, setOpen }: { open: boolean; setOpen: Function }) {
  return (
    <SidebarStyle className={open ? "open" : "close"}>
      <Title>
        <ThreeIcon src={three_icon} />
        {open && <TitleText>three example</TitleText>}
      </Title>
      <SidebarBody>
        {exampleRoutes.map((route, index) => {
          return (
            <CustomLink to={`/${route.path}`} key={index}>
              <LinkTextStyle>{route.path}</LinkTextStyle>
            </CustomLink>
          );
        })}
      </SidebarBody>
      <SidebarFooter open={open}>
        {open ? (
          <ToggleIconWrap onClick={() => setOpen(false)}>
            <FaToggleOn
              style={{ color: colorConstant.secondaryColor, fontSize: "20px" }}
            />
          </ToggleIconWrap>
        ) : (
          <ToggleIconWrap onClick={() => setOpen(true)}>
            <FaToggleOff
              style={{
                color: colorConstant.secondaryTextColor,
                fontSize: "20px",
              }}
            />
          </ToggleIconWrap>
        )}
      </SidebarFooter>
    </SidebarStyle>
  );
}

export default Sidebar;
