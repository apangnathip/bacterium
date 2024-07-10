import { GridObject } from "../components/Canvas";

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

export function shuffle(array: any[]) {
  var tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

  return array;
}

// flatten 2D coordinates to 1D
export function flattenCoords(i: number, j: number, size: number) {
  return i * size + j;
}

// returns the equivalent grid coordinates of where the mouse is
export function getCoords(
  x: number,
  y: number,
  gridObj: GridObject,
  gap: number,
) {
  const { m } = gridObj.size;
  const gridPixelSize = m * (gridObj.cellSize + gap);
  const gridCol = Math.floor((x * m) / gridPixelSize);
  const gridRow = Math.floor((y * m) / gridPixelSize);
  return [gridRow, gridCol];
}
