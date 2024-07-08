import { useEffect, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";

export enum CellState {
  Empty,
  Alive,
  New,
}
export type GridObject = { grid: CellState[][]; size: number };

export type Flags = {
  continue: boolean;
  step: boolean;
  reset: boolean;
  showGap: boolean;
  fps: number;
};

function App() {
  const [gridObj, setGrid] = useState<GridObject>({ grid: [], size: 0 });
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    step: false,
    reset: false,
    showGap: false,
    fps: 5,
  });

  useEffect(() => {
    const rows: CellState[][] = [];
    const size = 100;
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(CellState.Empty);
      }
      rows.push(row);
    }
    setGrid({ grid: rows, size: size });
  }, []);

  return (
    <>
      <Controls setFlags={setFlags} />
      <Canvas gridObj={gridObj} setGrid={setGrid} flags={flags} />
    </>
  );
}

export default App;
