import React from "react";
import "./Controls.css";
import { Flags } from "../App";

const Controls = ({
  flags,
  setFlags,
}: {
  flags: Flags;
  setFlags: React.Dispatch<React.SetStateAction<Flags>>;
}) => {
  return (
    <div className="bar">
      <button
        onClick={() =>
          setFlags((prev) => ({ ...prev, continue: !prev.continue }))
        }
      >
        {flags.continue ? "Stop" : "Start"}
      </button>
      <button onClick={() => setFlags((prev) => ({ ...prev, reset: true }))}>
        Reset
      </button>
    </div>
  );
};

export default Controls;
