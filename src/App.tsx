import { useState } from "react";
import "./App.css";
import Canvas, { createNewGrid, GridObject } from "./components/Canvas";
import Controls from "./components/Controls";

export type Flags = {
  continue: boolean;
  reset: boolean;
  step: boolean;
  gap: number;
  fps: number;
};

function App() {
  const size = 50;
  const [gridObj, setGridObj] = useState<GridObject>({
    grid: createNewGrid(size),
    size: size,
  });
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    reset: false,
    step: false,
    gap: 0,
    fps: 25,
  });

  return (
    <>
      <Controls flags={flags} setFlags={setFlags} gridObj={gridObj} />
      <div className="canvas-container">
        <Canvas
          gridObj={gridObj}
          setGrid={setGridObj}
          flags={flags}
          setFlags={setFlags}
        />
      </div>
    </>
  );
}

export default App;
