import { useEffect, useState } from "react";
import "./Slider.css";

const Slider = ({
  min,
  max,
  val,
  fn,
}: {
  min: number;
  max: number;
  val?: number;
  fn: (n: number) => void;
}) => {
  const [value, setValue] = useState(val);
  useEffect(() => {
    if (value) fn(value);
  }, [value]);
  return (
    <div className={"slider-container"}>
      <input
        className={"slider"}
        type="range"
        min={min}
        max={max}
        defaultValue={value}
        onChange={(e) => {
          setValue(parseInt(e.target.value));
        }}
      />
      <input
        type="number"
        className={"box"}
        value={value}
        onChange={(e) => {
          const target = parseInt(e.target.value);
          if (isNaN(target)) {
            return;
          } else if (target < min) {
            setValue(min);
          } else if (target > max) {
            setValue(max);
          } else {
            setValue(target);
          }
        }}
      />
    </div>
  );
};

export default Slider;
