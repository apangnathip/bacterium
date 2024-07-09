import { memo, useEffect, useRef } from "react";
import { Flags } from "../App";
import "./Canvas.css";
import {
  flattenCoords,
  getCoords,
  lerpColor,
  toRGBText,
} from "../utils/helper";

export type GridObject = {
  grid: (Cell | null)[][];
  size: { n: number; m: number };
  cellSize: number;
  cellCount: number;
};

export class Cell {
  age: number;
  color: string;
  grownColor: [number, number, number];
  birthColor: [number, number, number];
  constructor() {
    this.age = 0;
    this.grownColor = [72, 46, 116];
    this.birthColor = [255, 193, 255];
    this.color = toRGBText(this.birthColor);
  }

  update() {
    if (this.age >= 1) {
      this.color = toRGBText(this.grownColor);
      return;
    }
    this.color = lerpColor(this.birthColor, this.grownColor, this.age);
    this.age += 0.1;
  }
}

export const createNewGrid = (n: number, m: number) => {
  const rows: (Cell | null)[][] = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < m; j++) {
      row.push(null);
    }
    rows.push(row);
  }
  return rows;
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
) => {
  for (let i = 0; i < gridObj.size.n; i++) {
    for (let j = 0; j < gridObj.size.m; j++) {
      if (!gridObj.grid[i][j]) {
        ctx.fillStyle = `rgb(25, 23, 36)`;
      } else {
        ctx.fillStyle = gridObj.grid[i][j]!.color;
      }

      ctx.fillRect(
        j * (gridObj.cellSize + flags.gap),
        i * (gridObj.cellSize + flags.gap),
        gridObj.cellSize,
        gridObj.cellSize,
      );
    }
  }
};

const shuffle = (arr: any[]) => {
  let newArr = [];
  let randomIndex = Math.floor(Math.random() * arr.length);
  let element = arr.splice(randomIndex, 1);
  newArr.push(element[0]);
  return newArr;
};

const updateGrid = (gridObj: GridObject) => {
  let newCells = {} as { [key: number]: boolean };
  for (let i = 0; i < gridObj.size.n; i++) {
    for (let j = 0; j < gridObj.size.m; j++) {
      if (
        !gridObj.grid[i][j] ||
        flattenCoords(i, j, gridObj.size.n) in newCells
      )
        continue;

      gridObj.grid[i][j]!.update();

      let neighbours = shuffle([
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
      ]);

      for (const [x, y] of neighbours) {
        if (
          x >= 0 &&
          y >= 0 &&
          x < gridObj.size.n &&
          y < gridObj.size.m &&
          !gridObj.grid[x][y]
        ) {
          gridObj.grid[x][y] = new Cell();
          gridObj.cellCount++;
          newCells[flattenCoords(x, y, gridObj.size.n)] = true;
          break;
        }
      }
    }
  }
};

const Canvas = memo(
  ({
    gridObj,
    flags,
    setFlags,
  }: {
    gridObj: GridObject;
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
    });

    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    let rect: DOMRect;
    let then: number;

    useEffect(() => {
      if (!initCanvas()) return;

      gridObj.size.n = Math.floor(canvas!.height / gridObj.cellSize);
      gridObj.size.m = Math.floor(canvas!.width / gridObj.cellSize);
      gridObj.grid = createNewGrid(gridObj.size.n, gridObj.size.m);

      requestRef.current = requestAnimationFrame(animate);

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        mouseRef.current.isClicked = true;
        handleMouseClick(e);
      });
      window.addEventListener("mouseup", (e) => {
        mouseRef.current.isClicked = false;
        handleMouseClick(e);
      });
      window.addEventListener("resize", () => {
        rect = canvas!.getBoundingClientRect();
      });

      return () => {
        cancelAnimationFrame(requestRef.current);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      initCanvas();
      flagRef.current = flags;

      if (flagRef.current.reset) {
        if (flagRef.current.maximise) {
          gridObj.size.n = Math.floor(canvas!.height / gridObj.cellSize);
          gridObj.size.m = Math.floor(canvas!.width / gridObj.cellSize);
        }
        gridObj.grid = createNewGrid(gridObj.size.n, gridObj.size.m);
        setFlags((prev) => ({ ...prev, reset: false }));
      }
    }, [flags]);

    const initCanvas = () => {
      canvas = canvasRef.current;
      if (!canvas) return false;

      ctx = canvas.getContext("2d");
      if (!ctx) return false;

      rect = canvas.getBoundingClientRect();

      const scale = window.devicePixelRatio;
      canvas.width = Math.round(canvasRef.current!.clientWidth * scale);
      canvas.height = Math.round(canvasRef.current!.clientHeight * scale);

      // prevent gaps between cells due to floating-point error
      ctx.globalCompositeOperation = "lighter";
      return true;
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, gridObj, flagRef.current);

      if (!flagRef.current.continue) {
        if (flagRef.current.step) {
          updateGrid(gridObj);
          flagRef.current.step = false;
        }
        return;
      }

      // update grid by a set interval
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
          gridObj,
          flagRef.current.gap,
        );

        if (
          gridCol >= 0 &&
          gridRow >= 0 &&
          gridCol < gridObj.size.m &&
          gridRow < gridObj.size.n
        ) {
          if (flagRef.current.draw) {
            if (!gridObj.grid[gridRow][gridCol]) gridObj.cellCount++;
            gridObj.grid[gridRow][gridCol] = new Cell();
          } else {
            gridObj.grid[gridRow][gridCol] = null;
          }
        }
      }

      mouseRef.current.startX = mouseRef.current.x;
      mouseRef.current.startY = mouseRef.current.y;
    };

    const handleMouseClick = (e: MouseEvent) => {
      mouseRef.current.startX = e.clientX - rect.left;
      mouseRef.current.startY = e.clientY - rect.top;
    };

    return <canvas className="grid" ref={canvasRef} />;
  },
);

export default Canvas;
