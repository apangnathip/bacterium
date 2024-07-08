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
  const size = 100;
  const [gridObj, setGrid] = useState<GridObject>({
    grid: createNewGrid(size),
    size: size,
    cellSize: (1 / size) * 800,
  });
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    reset: false,
    showGap: false,
    fps: 1,
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
