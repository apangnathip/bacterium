import { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import { Flags, GridObject } from "../App";

type Mouse = { x: number; y: number; isClicked: boolean };

const initGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
) => {
  const cellSize = (1 / gridObj.size) * 600;
  const gap = flags.showGap ? 0.5 : 0;
  const offsetX = Math.round(
    (canvas.width - gridObj.size * (cellSize + gap)) / 2,
  );
  const offsetY = Math.round(
    (canvas.height - gridObj.size * (cellSize + gap)) / 2,
  );

  // const offsetX = 0;
  // const offsetY = 0;

  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      ctx.fillStyle = gridObj.grid[j][i] ? "red" : "white";
      ctx.fillRect(
        i * (cellSize + gap) + offsetX,
        j * (cellSize + gap) + offsetY,
        cellSize,
        cellSize,
      );
    }
  }
};

const Canvas = ({
  gridObj,
  setGrid,
  flags,
}: {
  gridObj: GridObject;
  setGrid: React.Dispatch<React.SetStateAction<GridObject>>;
  flags: Flags;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let [mouse, setMouse] = useState({ x: 0, y: 0, isClicked: false });

  useEffect(() => {
    canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext("2d");
    if (!ctx) return;
    initGrid(canvas, ctx, gridObj, flags);
  }, [gridObj, flags]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!mouse.isClicked) return;

    const cellSize = (1 / gridObj.size) * 600;
    const gap = flags.showGap ? 0.5 : 0;
    const offsetX = Math.round(
      (window.innerWidth - gridObj.size * (cellSize + gap)) / 2,
    );
    const offsetY = Math.round(
      (window.innerHeight - gridObj.size * (cellSize + gap)) / 2,
    );

    // convert mouse position to grid position, i.e. which cell the mouse is in
    const gridTotalSize = gridObj.size * (cellSize + gap);
    const gridCol = Math.floor(
      ((mouse.x - offsetX) * gridObj.size) / gridTotalSize,
    );
    const gridRow = Math.floor(
      ((mouse.y - offsetY) * gridObj.size) / gridTotalSize,
    );

    if (
      gridCol >= 0 &&
      gridRow >= 0 &&
      gridCol < gridObj.size &&
      gridRow < gridObj.size
    ) {
      const newGrid = gridObj.grid;
      newGrid[gridRow][gridCol] = true;
      setGrid({ grid: newGrid, size: gridObj.size });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setMouse((prev) => ({ ...prev, isClicked: true }))}
      onMouseUp={() => setMouse((prev) => ({ ...prev, isClicked: false }))}
    />
  );
};

export default Canvas;
