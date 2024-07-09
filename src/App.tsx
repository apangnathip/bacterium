import { useState } from "react";
import "./App.css";
import Canvas, { GridObject } from "./components/Canvas";
import Controls from "./components/Controls";

export type Flags = {
  continue: boolean;
  maximise: boolean;
  reset: boolean;
  step: boolean;
  draw: boolean;
  gap: number;
  fps: number;
};

function App() {
  const [flags, setFlags] = useState<Flags>({
    continue: false,
    maximise: true,
    reset: false,
    step: false,
    draw: true,
    gap: 1,
    fps: 25,
  });
  const [gridObj, setGridObj] = useState<GridObject>({
    grid: [],
    size: { n: 0, m: 0 },
    cellSize: 20,
    cellCount: 0,
  });

  return (
    <main>
      <Controls flags={flags} setFlags={setFlags} gridObj={gridObj} />
      <div className="canvas-container">
        <Canvas gridObj={gridObj} flags={flags} setFlags={setFlags} />
      </div>
      {/* <Graph flags={flags} gridObj={gridObj} /> */}
    </main>
  );
}

export default App;
