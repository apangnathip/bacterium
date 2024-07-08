import { useEffect, useRef } from "react";
import { Flags } from "../App";
import "./Canvas.css";

export type GridObject = {
  grid: CellState[][];
  size: number;
  cellSize: number;
};

enum CellState {
  Empty,
  Alive,
  New,
}

export const createNewGrid = (size: number) => {
  const rows: CellState[][] = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(CellState.Empty);
    }
    rows.push(row);
  }
  return rows;
};

const getCenterOffset = (
  length: number,
  gridSize: number,
  cellSize: number,
  gap: number,
) => {
  return Math.round((length - gridSize * (cellSize + gap)) / 2);
};

const getCoords = (
  x: number,
  y: number,
  size: number,
  cellSize: number,
  gap: number,
) => {
  const offsetX = getCenterOffset(window.innerWidth, size, cellSize, gap);
  const offsetY = getCenterOffset(window.innerHeight, size, cellSize, gap);

  // convert mouseRef.current position to grid position, i.e. which cell the mouse is in
  const gridPixelSize = size * (cellSize + gap);
  const gridCol = Math.floor(((x - offsetX) * size) / gridPixelSize);
  const gridRow = Math.floor(((y - offsetY) * size) / gridPixelSize);
  return [gridRow, gridCol];
};

const drawGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
) => {
  const gap = flags.showGap ? 0.5 : 0;
  const offsetX = getCenterOffset(
    canvas.width,
    gridObj.size,
    gridObj.cellSize,
    gap,
  );
  const offsetY = getCenterOffset(
    canvas.height,
    gridObj.size,
    gridObj.cellSize,
    gap,
  );

  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      switch (gridObj.grid[i][j]) {
        case CellState.Empty:
          ctx.fillStyle = `rgb(25, 23, 36)`;
          break;
        case CellState.Alive:
          ctx.fillStyle = "gray";
          break;
        case CellState.New:
          ctx.fillStyle = "rgb(255, 255, 255)";
          break;
      }
      ctx.fillRect(
        j * (gridObj.cellSize + gap) + offsetX,
        i * (gridObj.cellSize + gap) + offsetY,
        gridObj.cellSize,
        gridObj.cellSize,
      );
    }
  }
};

const flattenCoords = (i: number, j: number, size: number) => {
  return i * size + j;
};

const updateGrid = (gridObj: GridObject) => {
  let newCells = {} as { [key: number]: boolean };
  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      if (!gridObj.grid[i][j] || flattenCoords(i, j, gridObj.size) in newCells)
        continue;

      gridObj.grid[i][j] = CellState.Alive;

      let neighbours = [
        // cardinal directions
        [i - 1, j],
        [i + 1, j],
        [i, j - 1],
        [i, j + 1],
        // diagonals
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j - 1],
        [i + 1, j + 1],
      ];

      for (const [x, y] of neighbours) {
        if (
          x >= 0 &&
          x < gridObj.size &&
          y >= 0 &&
          y < gridObj.size &&
          !gridObj.grid[x][y]
        ) {
          gridObj.grid[x][y] = CellState.New;
          newCells[flattenCoords(x, y, gridObj.size)] = true;
        }
      }
    }
  }
};

const Canvas = ({
  gridObj,
  setGrid,
  flags,
  setFlags,
}: {
  gridObj: GridObject;
  setGrid: React.Dispatch<React.SetStateAction<GridObject>>;
  flags: Flags;
  setFlags: React.Dispatch<React.SetStateAction<Flags>>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);
  const runRef = useRef(true);
  const fpsRef = useRef(1);
  const mouseRef = useRef({
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    isClicked: false,
    button: 0,
  });

  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let then: number;

  useEffect(() => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [canvasRef.current]);

  useEffect(() => {
    runRef.current = flags.continue;
    fpsRef.current = flags.fps;
    if (flags.reset) {
      gridObj.grid = createNewGrid(gridObj.size);
      setFlags((prev) => ({ ...prev, reset: false }));
    }
  }, [flags]);

  const animate = (time: number) => {
    if (!ctx || !canvas) return;
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(canvas, ctx, gridObj, flags);

    // update grid by a set interval
    then = then ?? time;
    let delta = time - then;
    if (runRef.current && delta > 1000 / fpsRef.current) {
      then = time - (delta % (1000 / fpsRef.current));
      updateGrid(gridObj);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;

    if (!mouseRef.current.isClicked) return;

    let dist = Math.hypot(
      mouseRef.current.x - mouseRef.current.startX,
      mouseRef.current.y - mouseRef.current.startY,
    );

    for (let i = 0; i < dist; i++) {
      const lerpX =
        mouseRef.current.startX +
        (mouseRef.current.x - mouseRef.current.startX) * (i / dist);
      const lerpY =
        mouseRef.current.startY +
        (mouseRef.current.y - mouseRef.current.startY) * (i / dist);
      const [gridRow, gridCol] = getCoords(
        lerpX,
        lerpY,
        gridObj.size,
        gridObj.cellSize,
        flags.showGap ? 0.5 : 0,
      );

      if (
        gridCol >= 0 &&
        gridRow >= 0 &&
        gridCol < gridObj.size &&
        gridRow < gridObj.size
      ) {
        switch (mouseRef.current.button) {
          case 0:
            gridObj.grid[gridRow][gridCol] = CellState.New;
            break;
          case 2:
            gridObj.grid[gridRow][gridCol] = CellState.Empty;
            break;
        }
      }
    }

    mouseRef.current.startX = mouseRef.current.x;
    mouseRef.current.startY = mouseRef.current.y;
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isClicked = !mouseRef.current.isClicked;
    mouseRef.current.button = e.button;
    mouseRef.current.startX = e.clientX;
    mouseRef.current.startY = e.clientY;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
      onMouseUp={handleMouseClick}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Canvas;
