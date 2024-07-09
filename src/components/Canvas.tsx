import { memo, useEffect, useRef } from "react";
import { Flags } from "../App";
import "./Canvas.css";

export type GridObject = {
  grid: (Cell | null)[][];
  size: number;
};

export class Cell {
  age: number;
  color: string;
  grownColor: string;
  birthColor: string;
  constructor() {
    this.age = 1;
    this.grownColor = "rgb(72, 46, 116)";
    this.birthColor = "rgb(255, 193, 255)";
    this.color = this.birthColor;
  }

  getColorByAge() {
    const r = lerp(255, 72, this.age / 10);
    const g = lerp(193, 46, this.age / 10);
    const b = lerp(255, 116, this.age / 10);
    return `rgb(${r}, ${g}, ${b})`;
  }

  update() {
    if (this.age > 10) {
      this.color = this.grownColor;
      return;
    }
    this.color = this.getColorByAge();
    this.age++;
  }
}

export const createNewGrid = (size: number) => {
  const rows: (Cell | null)[][] = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(null);
    }
    rows.push(row);
  }
  return rows;
};

// linear interpolation, a to b, by alpha
const lerp = (a: number, b: number, alpha: number) => {
  return a * (1 - alpha) + b * alpha;
};

// flatten 2D coordinates to 1D
const flattenCoords = (i: number, j: number, size: number) => {
  return i * size + j;
};

// returns the equivalent grid coordinates of where the mouse is
const getCoords = (
  x: number,
  y: number,
  size: number,
  cellSize: number,
  gap: number,
) => {
  const gridPixelSize = size * (cellSize + gap);
  const gridCol = Math.floor((x * size) / gridPixelSize);
  const gridRow = Math.floor((y * size) / gridPixelSize);
  return [gridRow, gridCol];
};

const drawGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
) => {
  const gap = flags.showGap ? 1 : 0;
  const cellSize = canvas.width / gridObj.size - gap;

  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      if (!gridObj.grid[i][j]) {
        ctx.fillStyle = `rgb(25, 23, 36)`;
      } else {
        ctx.fillStyle = gridObj.grid[i][j]!.color;
      }

      ctx.fillRect(
        j * (cellSize + gap),
        i * (cellSize + gap),
        cellSize,
        cellSize,
      );
    }
  }
};

const updateGrid = (gridObj: GridObject) => {
  let newCells = {} as { [key: number]: boolean };
  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      if (!gridObj.grid[i][j] || flattenCoords(i, j, gridObj.size) in newCells)
        continue;

      gridObj.grid[i][j]!.update();

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
      ].sort(() => Math.random() - 0.5);

      for (const [x, y] of neighbours) {
        if (
          x >= 0 &&
          x < gridObj.size &&
          y >= 0 &&
          y < gridObj.size &&
          !gridObj.grid[x][y]
        ) {
          gridObj.grid[x][y] = new Cell();
          newCells[flattenCoords(x, y, gridObj.size)] = true;
          break;
        }
      }
    }
  }
};

const Canvas = memo(
  ({
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
    const flagRef = useRef(flags);
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
    let rect: DOMRect;
    let then: number;

    useEffect(() => {
      initCanvas();
      requestRef.current = requestAnimationFrame(animate);

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", (e) => {
        mouseRef.current.isClicked = true;
        handleMouseClick(e);
      });
      window.addEventListener("mouseup", (e) => {
        mouseRef.current.isClicked = false;
        handleMouseClick(e);
      });

      return () => {
        cancelAnimationFrame(requestRef.current);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      initCanvas();
      flagRef.current = flags;

      if (flags.reset) {
        gridObj.grid = createNewGrid(gridObj.size);
        setFlags((prev) => ({ ...prev, reset: false }));
      }
    }, [flags]);

    const initCanvas = () => {
      canvas = canvasRef.current;
      if (!canvas) return;

      ctx = canvas.getContext("2d");
      if (!ctx) return;

      rect = canvas.getBoundingClientRect();

      const scale = window.devicePixelRatio;
      canvas.width = Math.round(canvasRef.current!.clientWidth * scale);
      canvas.height = Math.round(canvasRef.current!.clientHeight * scale);

      // prevent gaps between cells due to floating-point error
      ctx.globalCompositeOperation = "lighter";
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(canvas, ctx, gridObj, flags);

      if (flagRef.current.step) {
        updateGrid(gridObj);
        flagRef.current.step = false;
        return;
      }

      // update grid by a set interval
      if (!flagRef.current.continue) return;
      then = then ?? time;
      let delta = time - then;
      if (delta > 1000 / flagRef.current.fps) {
        then = time - (delta % (1000 / flagRef.current.fps));
        updateGrid(gridObj);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas || !mouseRef.current.isClicked) return;

      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      let dist = Math.hypot(
        mouseRef.current.x - mouseRef.current.startX,
        mouseRef.current.y - mouseRef.current.startY,
      );

      let gap = flags.showGap ? 1 : 0;

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
          canvas.width / gridObj.size - gap,
          gap,
        );

        if (
          gridCol >= 0 &&
          gridRow >= 0 &&
          gridCol < gridObj.size &&
          gridRow < gridObj.size
        ) {
          switch (mouseRef.current.button) {
            case 0:
              gridObj.grid[gridRow][gridCol] = new Cell();
              break;
            case 2:
              gridObj.grid[gridRow][gridCol] = null;
              break;
          }
        }
      }

      mouseRef.current.startX = mouseRef.current.x;
      mouseRef.current.startY = mouseRef.current.y;
    };

    const handleMouseClick = (e: MouseEvent) => {
      mouseRef.current.button = e.button;
      mouseRef.current.startX = e.clientX - rect.left;
      mouseRef.current.startY = e.clientY - rect.top;
    };

    return <canvas ref={canvasRef} />;
  },
);

export default Canvas;
