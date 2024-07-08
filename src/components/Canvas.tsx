import { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import { CellState, Flags, GridObject } from "../App";

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

const drawGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
) => {
  const cellSize = (1 / gridObj.size) * 600;
  const gap = flags.showGap ? 0.5 : 0;
  const offsetX = getCenterOffset(canvas.width, gridObj.size, cellSize, gap);
  const offsetY = getCenterOffset(canvas.height, gridObj.size, cellSize, gap);

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
        j * (cellSize + gap) + offsetX,
        i * (cellSize + gap) + offsetY,
        cellSize,
        cellSize,
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
  const mouseRef = useRef({ x: 0, y: 0, isClicked: false });
  const runRef = useRef(true);
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
    if (runRef.current && delta > 1000 / flags.fps) {
      then = time - (delta % (1000 / flags.fps));
      updateGrid(gridObj);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;

    if (!mouseRef.current.isClicked) return;

    const cellSize = (1 / gridObj.size) * 600;
    const gap = flags.showGap ? 0.5 : 0;
    const offsetX = getCenterOffset(
      window.innerWidth,
      gridObj.size,
      cellSize,
      gap,
    );
    const offsetY = getCenterOffset(
      window.innerHeight,
      gridObj.size,
      cellSize,
      gap,
    );

    // convert mouseRef.current position to grid position, i.e. which cell the mouse is in
    const gridPixelSize = gridObj.size * (cellSize + gap);
    const gridCol = Math.floor(
      ((mouseRef.current.x - offsetX) * gridObj.size) / gridPixelSize,
    );
    const gridRow = Math.floor(
      ((mouseRef.current.y - offsetY) * gridObj.size) / gridPixelSize,
    );

    if (
      gridCol >= 0 &&
      gridRow >= 0 &&
      gridCol < gridObj.size &&
      gridRow < gridObj.size
    ) {
      gridObj.grid[gridRow][gridCol] = CellState.New;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={() => (mouseRef.current.isClicked = true)}
      onMouseUp={() => (mouseRef.current.isClicked = false)}
    />
  );
};

export default Canvas;
