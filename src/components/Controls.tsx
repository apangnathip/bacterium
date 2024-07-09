import React from "react";
import "./Controls.css";
import { Flags } from "../App";
import { createNewGrid, GridObject } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEraser,
  faForwardStep,
  faPause,
  faPencil,
  faPlay,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const Controls = ({
  flags,
  setFlags,
  gridObj,
}: {
  flags: Flags;
  setFlags: React.Dispatch<React.SetStateAction<Flags>>;
  gridObj: GridObject;
}) => {
  return (
    <div className="bar">
      <button
        className={flags.draw ? "pressed" : ""}
        onClick={() => setFlags((prev) => ({ ...prev, draw: true }))}
      >
        <FontAwesomeIcon icon={faPencil} />
      </button>
      <button
        className={flags.draw ? "" : "pressed"}
        onClick={() => setFlags((prev) => ({ ...prev, draw: false }))}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
      <button
        onClick={() =>
          setFlags((prev) => ({ ...prev, continue: !prev.continue }))
        }
      >
        <FontAwesomeIcon icon={flags.continue ? faPause : faPlay} />
      </button>
      <button onClick={() => setFlags((prev) => ({ ...prev, step: true }))}>
        <FontAwesomeIcon icon={faForwardStep} />
      </button>
      <button
        onClick={() =>
          setFlags((prev) => ({ ...prev, reset: true, draw: true }))
        }
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
      <button
        onClick={() =>
          setFlags((prev) => {
            return { ...prev, gap: prev.gap ? 0 : 1 };
          })
        }
      >
        {flags.gap ? "Hide Gap" : "Show Gap"}
      </button>
      <input
        type="range"
        min="1"
        max="25"
        step="1"
        defaultValue={flags.fps}
        onChange={(e) => {
          setFlags((prev) => ({ ...prev, fps: parseInt(e.target.value) }));
        }}
      ></input>
      <input
        type="range"
        min="1"
        max="200"
        step="1"
        defaultValue={gridObj.size}
        onChange={(e) => {
          gridObj.size = parseInt(e.target.value);
          gridObj.grid = createNewGrid(gridObj.size);
          setFlags((prev) => ({ ...prev, reset: true }));
        }}
      ></input>
    </div>
  );
};

export default Controls;
