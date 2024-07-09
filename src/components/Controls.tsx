import React from "react";
import "./Controls.css";
import { Flags } from "../App";
import { createNewGrid, GridObject } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faEraser,
  faForwardStep,
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
  return (
    <div className="bar">
      <div className="bar-row">
        <Button
          fn={() => setFlags((prev) => ({ ...prev, draw: true }))}
          toggleBy={flags.draw}
        >
          <FontAwesomeIcon icon={faPencil} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, draw: false }))}
          toggleBy={!flags.draw}
        >
          <FontAwesomeIcon icon={faEraser} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, continue: !prev.continue }))}
        >
          <FontAwesomeIcon icon={flags.continue ? faPause : faPlay} />
        </Button>
        <Button fn={() => setFlags((prev) => ({ ...prev, step: true }))}>
          <FontAwesomeIcon icon={faForwardStep} />
        </Button>
        <Button
          fn={() => setFlags((prev) => ({ ...prev, reset: true, draw: true }))}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
        <Button
          fn={() => {
            setFlags((prev) => ({ ...prev, gap: prev.gap ? 0 : 1 }));
            gridObj.cellSize += flags.gap ? 1 : -1;
          }}
          toggleBy={flags.gap !== 0}
        >
          <FontAwesomeIcon icon={faBorderAll} />
        </Button>
      </div>
      <Button
        fn={() => {
          setFlags((prev) => ({
            ...prev,
            maximise: !prev.maximise,
            reset: prev.maximise ? false : true,
          }));
        }}
        toggleBy={flags.maximise}
      >
        Maximise Grid
      </Button>
      <Slider
        min={1}
        max={25}
        val={flags.fps}
        fn={(n: number) => {
          setFlags((prev) => ({ ...prev, fps: n }));
        }}
      />
      <Slider
        min={5}
        max={100}
        val={gridObj.cellSize}
        fn={(n: number) => {
          gridObj.cellSize = n;
          if (flags.maximise) setFlags((prev) => ({ ...prev, reset: true }));
        }}
      />
    </div>
  );
};

export default Controls;
