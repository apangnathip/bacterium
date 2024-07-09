import { useEffect, useRef } from "react";
import { GridObject } from "./Canvas";
import "./Graph.css";
import { Flags } from "../App";

const Graph = ({ flags, gridObj }: { flags: Flags; gridObj: GridObject }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let i = useRef(0);

  useEffect(() => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = window.devicePixelRatio;
    canvas.width = Math.round(canvasRef.current!.clientWidth * scale);
    canvas.height = Math.round(canvasRef.current!.clientHeight * scale);

    ctx.moveTo(0, canvas.height);
    ctx.strokeStyle = "red";
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log(gridObj.cellCount);
    ctx.lineTo(i.current * 5, canvas.height - gridObj.cellCount);
    ctx.stroke();
    i.current++;
  }, [gridObj.cellCount]);

  return <canvas ref={canvasRef} className="graph"></canvas>;
};

export default Graph;
