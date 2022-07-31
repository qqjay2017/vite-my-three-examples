import { detect } from "detect-browser";
export function detectBrowser() {
  return detect(window.navigator.userAgent);
}

export function isMobile() {
  return window.innerWidth <= 576;
}
export function isDesktop() {
  return window.innerWidth > 576;
}
