import { useEffect } from "react";
import "./Canvas.css";
import { Flags, GridObject } from "../App";

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

  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        i * (cellSize + gap) + offsetX,
        j * (cellSize + gap) + offsetY,
        cellSize,
        cellSize,
      );
    }
  }
};

const Canvas = ({ gridObj, flags }: { gridObj: GridObject; flags: Flags }) => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initGrid(canvas, ctx, gridObj, flags);
  }, [gridObj, flags]);
  return <canvas />;
};

export default Canvas;
