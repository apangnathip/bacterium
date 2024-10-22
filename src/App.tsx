import { useState } from "react";
import "./App.css";
import Canvas, { GridObject } from "./components/Canvas";
import Controls from "./components/Controls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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
    gap: 0,
    fps: 20,
  });

  const [gridObj, _] = useState<GridObject>({
    grid: [],
    size: { n: 0, m: 0 },
    cellSize: 20,
  });

  return (
    <main>
      <div className="panel">
        <div className="header">
          <span>Bacterium</span>
          <a
            className="link-icon"
            href="https://github.com/apangnathip/bacterium"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
        <Controls flags={flags} setFlags={setFlags} gridObj={gridObj} />
      </div>
      <Canvas gridObj={gridObj} flags={flags} setFlags={setFlags} />
    </main>
  );
}

export default App;
