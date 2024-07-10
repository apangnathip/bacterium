import { useEffect, useState } from "react";
import "./Slider.css";

const Slider = ({
  min,
  max,
  val,
  text,
  changeFn,
  clickFn,
  leaveFn,
}: {
  min: number;
  max: number;
  val?: number;
  text?: string;
  changeFn: (n: number) => void;
  clickFn?: () => void;
  leaveFn?: () => void;
}) => {
  const [value, setValue] = useState(val);
  useEffect(() => {
    if (value) changeFn(value);
  }, [value]);
  return (
    <div className={"slider-container"}>
      <span>{text}</span>
      <input
        className={"slider"}
        type="range"
        min={min}
        max={max}
        defaultValue={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        onMouseDown={() => {
          if (clickFn) clickFn();
        }}
        onMouseUp={() => {
          if (leaveFn) leaveFn();
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
