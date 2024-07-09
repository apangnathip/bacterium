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
  size: number;
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

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  gridObj: GridObject,
  flags: Flags,
  cellSize: number,
) => {
  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      if (!gridObj.grid[i][j]) {
        ctx.fillStyle = `rgb(25, 23, 36)`;
      } else {
        ctx.fillStyle = gridObj.grid[i][j]!.color;
      }

      ctx.fillRect(
        j * (cellSize + flags.gap),
        i * (cellSize + flags.gap),
        cellSize,
        cellSize,
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
  for (let i = 0; i < gridObj.size; i++) {
    for (let j = 0; j < gridObj.size; j++) {
      if (!gridObj.grid[i][j] || flattenCoords(i, j, gridObj.size) in newCells)
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
      initCanvas();
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

      return () => {
        cancelAnimationFrame(requestRef.current);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      initCanvas();
      flagRef.current = flags;

      if (flagRef.current.reset) {
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
      drawGrid(
        ctx,
        gridObj,
        flagRef.current,
        canvas.width / gridObj.size - flagRef.current.gap,
      );

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
          gridObj.size,
          canvas.width / gridObj.size - flagRef.current.gap,
          flagRef.current.gap,
        );

        if (
          gridCol >= 0 &&
          gridRow >= 0 &&
          gridCol < gridObj.size &&
          gridRow < gridObj.size
        ) {
          if (flagRef.current.draw) {
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

    return <canvas ref={canvasRef} />;
  },
);

export default Canvas;
