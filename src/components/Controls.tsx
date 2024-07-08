import React from "react";
import "./Controls.css";
import { Flags } from "../App";

const Controls = ({
  setFlags,
}: {
  setFlags: React.Dispatch<React.SetStateAction<Flags>>;
}) => {
  return (
    <div className="bar">
      <button>Start</button>
      <button
        onClick={() => {
          setFlags((prev) => ({ ...prev, fps: 0 }));
        }}
      >
        Pause
      </button>
      <button>Step</button>
      <button>Reset</button>
    </div>
  );
};

export default Controls;
