import { useEffect, useState } from "react";
import "./App.css";
import Canvas, { createNewGrid, GridObject } from "./components/Canvas";
import Controls from "./components/Controls";

export type Flags = {
  continue: boolean;
  reset: boolean;
  showGap: boolean;
  fps: number;
};

function App() {
  const [gridObj, setGrid] = useState<GridObject>({
    grid: createNewGrid(100),
    size: 100,
    cellSize: (1 / 100) * 800,
  });
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    reset: false,
    showGap: false,
    fps: 10,
  });

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
