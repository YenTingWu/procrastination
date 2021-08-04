export function getBoundingClientRectWithCenterPoint(element: HTMLElement) {
  const {
    x,
    y,
    width,
    height,
    top,
    left,
    right,
  } = element.getBoundingClientRect();

  return {
    centerPoint: {
      cx: x + width / 2,
      cy: y + height / 2,
    },
    x,
    y,
    width,
    height,
    top,
    left,
    right,
  };
}
