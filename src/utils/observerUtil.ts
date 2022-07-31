// import ReactDOM from 'react-dom'
import ResizeObserver from "resize-observer-polyfill";
export type ResizeListener = (element: HTMLDivElement) => void;
// https://www.npmjs.com/package/resize-observer-polyfill
// 监听器集合
const elementListeners = new Map<HTMLDivElement, Set<ResizeListener>>();

function onResize(entities: ResizeObserverEntry[]) {
  entities.forEach((entity) => {
    const { target } = entity;
    elementListeners
      .get(target as HTMLDivElement)
      ?.forEach((listener) => listener(target as HTMLDivElement));
  });
}

const resizeObserver = new ResizeObserver(onResize);

export function observe(
  element: HTMLDivElement | null,
  callback: ResizeListener
) {
  if (!element) {
    return false;
  }
  // 没监听过,添加监听
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Set());
    resizeObserver.observe(element);
  }
  // 添加回调
  elementListeners.get(element)?.add(callback);
}

export function unobserve(
  element: HTMLDivElement | null,
  callback: ResizeListener
) {
  if (!element) {
    return false;
  }
  if (elementListeners.has(element)) {
    elementListeners.get(element)?.delete(callback);
    if (!elementListeners.get(element)?.size) {
      resizeObserver.unobserve(element);
      elementListeners.delete(element);
    }
  }
}

// export function findDOMNode(node: React.ReactInstance | Element|any) {
//     if (node instanceof Element) {
//       return node
//     }

//     return ReactDOM.findDOMNode(node)
//   }
