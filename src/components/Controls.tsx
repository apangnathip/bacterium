import React, { useState } from "react";
import "./Controls.css";
import { Flags } from "../App";
import { GridObject } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faEraser,
  faForwardStep,
  faMaximize,
  faPause,
  faPencil,
  faPlay,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import Slider from "./Slider";

const Controls = ({
  flags,
  setFlags,
  gridObj,
}: {
  flags: Flags;
  setFlags: React.Dispatch<React.SetStateAction<Flags>>;
  gridObj: GridObject;
}) => {
  const [gapWasOn, setGapWasOn] = useState(flags.gap !== 0);

  return (
    <div className="bar">
      <div className="bar-row">
        <Button
          fn={() => setFlags((prev) => ({ ...prev, draw: true }))}
          toggleBy={flags.draw}
          toolTipText={"Pencil Tool"}
        >
          <FontAwesomeIcon icon={faPencil} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, draw: false }))}
          toggleBy={!flags.draw}
          toolTipText={"Eraser Tool"}
        >
          <FontAwesomeIcon icon={faEraser} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, continue: !prev.continue }))}
          toolTipText={flags.continue ? "Pause" : "Play"}
        >
          <FontAwesomeIcon icon={flags.continue ? faPause : faPlay} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, step: true }))}
          toolTipText={"Step Forward"}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, reset: true, draw: true }))}
          toolTipText={"Reset Grid"}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
        <Button
          fn={() => {
            setFlags((prev) => ({ ...prev, gap: prev.gap ? 0 : 1 }));
            gridObj.cellSize += flags.gap ? 1 : -1;
          }}
          toggleBy={flags.gap !== 0}
          toolTipText={flags.gap ? "Hide Grid" : "Show Grid"}
        >
          <FontAwesomeIcon icon={faBorderAll} />
        </Button>
        <Button
          fn={() => {
            setFlags((prev) => ({
              ...prev,
              maximise: !prev.maximise,
              reset: prev.maximise ? false : true,
            }));
          }}
          toggleBy={flags.maximise}
          toolTipText={"Fit Grid to Screen"}
        >
          <FontAwesomeIcon icon={faMaximize} />
        </Button>
      </div>
      <Slider
        min={1}
        max={30}
        val={flags.fps}
        text={"Growth Rate"}
        changeFn={(n: number) => {
          setFlags((prev) => ({ ...prev, fps: n }));
        }}
      />
      <Slider
        min={5}
        max={100}
        val={gridObj.cellSize}
        text={"Cell Size"}
        changeFn={(n: number) => {
          gridObj.cellSize = n;
          if (flags.maximise) setFlags((prev) => ({ ...prev, reset: true }));
        }}
        clickFn={() => {
          setGapWasOn(flags.gap !== 0);
          if (!flags.gap) {
            gridObj.cellSize -= 1;
            setFlags((prev) => ({ ...prev, gap: 1 }));
          }
        }}
        leaveFn={() => {
          if (!gapWasOn) {
            gridObj.cellSize += 1;
            setFlags((prev) => ({ ...prev, gap: 0 }));
          }
        }}
      />
    </div>
  );
};

export default Controls;
