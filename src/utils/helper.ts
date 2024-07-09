function lerp(a: number, b: number, alpha: number) {
  return a * (1 - alpha) + b * alpha;
}

export function toRGBText(color: [number, number, number]) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

export function lerpColor(
  colorA: [number, number, number],
  colorB: [number, number, number],
  alpha: number,
) {
  const r = lerp(colorA[0], colorB[0], alpha);
  const g = lerp(colorA[1], colorB[1], alpha);
  const b = lerp(colorA[2], colorB[2], alpha);

  return toRGBText([r, g, b]);
}

// flatten 2D coordinates to 1D
export function flattenCoords(i: number, j: number, size: number) {
  return i * size + j;
}

// returns the equivalent grid coordinates of where the mouse is
export function getCoords(
  x: number,
  y: number,
  size: number,
  cellSize: number,
  gap: number,
) {
  const gridPixelSize = size * (cellSize + gap);
  const gridCol = Math.floor((x * size) / gridPixelSize);
  const gridRow = Math.floor((y * size) / gridPixelSize);

  return [gridRow, gridCol];
}
