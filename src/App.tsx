import { useEffect, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";

export type GridObject = { grid: boolean[][]; size: number };

export type Flags = {
  continue: boolean;
  step: boolean;
  reset: boolean;
  showGap: boolean;
};

function App() {
  const [gridObj, setGrid] = useState<GridObject>({ grid: [], size: 0 });
  const [flags, setFlag] = useState<Flags>({
    continue: false,
    step: false,
    reset: false,
    showGap: false,
  });

  useEffect(() => {
    const rows: boolean[][] = [];
    const size = 50;
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(false);
      }
      rows.push(row);
    }
    setGrid({ grid: rows, size: size });
  }, []);

  return (
    <>
      <Controls />
      <Canvas gridObj={gridObj} setGrid={setGrid} flags={flags} />
    </>
  );
}

export default App;
