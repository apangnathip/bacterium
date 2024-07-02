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
  const [gridObj, setGrid] = useState<GridObject>({ grid: [], size: 50 });
  const [flags, setFlag] = useState<Flags>({
    continue: false,
    step: false,
    reset: false,
    showGap: true,
  });

  useEffect(() => {
    const rows: boolean[][] = [];
    for (let i = 0; i < gridObj.size; i++) {
      const row = [];
      for (let j = 0; j < gridObj.size; j++) {
        row.push(false);
      }
      rows.push(row);
    }
    setGrid({ grid: rows, size: gridObj.size });
  }, []);

  return (
    <>
      <Controls />
      <Canvas gridObj={gridObj} flags={flags} />
    </>
  );
}

export default App;
