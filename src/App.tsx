import { useEffect, useState } from "react";
import "./App.css";
import Canvas, { createNewGrid } from "./components/Canvas";
import Controls from "./components/Controls";

export enum CellState {
  Empty,
  Alive,
  New,
}
export type GridObject = { grid: CellState[][]; size: number };

export type Flags = {
  continue: boolean;
  reset: boolean;
  showGap: boolean;
  fps: number;
};

function App() {
  const [gridObj, setGrid] = useState<GridObject>({ grid: [], size: 0 });
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    reset: false,
    showGap: false,
    fps: 10,
  });

  useEffect(() => {
    const size = 100;
    const rows = createNewGrid(size);
    setGrid({ grid: rows, size: size });
  }, []);

  return (
    <>
      <Controls flags={flags} setFlags={setFlags} />
      <Canvas
        gridObj={gridObj}
        setGrid={setGrid}
        flags={flags}
        setFlags={setFlags}
      />
    </>
  );
}

export default App;
