import React from "react";
import "./Controls.css";
import { Flags } from "../App";
import { createNewGrid, GridObject } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faForwardStep,
  faPause,
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
      <FontAwesomeIcon
        icon={flags.continue ? faPause : faPlay}
        className="icon"
        onClick={() =>
          setFlags((prev) => ({ ...prev, continue: !prev.continue }))
        }
      />
      <FontAwesomeIcon
        icon={faForwardStep}
        className="icon"
        onClick={() => setFlags((prev) => ({ ...prev, step: true }))}
      />
      <FontAwesomeIcon
        icon={faRotateLeft}
        className="icon"
        onClick={() => setFlags((prev) => ({ ...prev, reset: true }))}
      />
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
