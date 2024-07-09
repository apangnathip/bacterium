import { ReactNode } from "react";
import "./Button.css";

const Button = ({
  children,
  fn,
  toggleBy,
}: {
  children: ReactNode;
  fn: () => void;
  toggleBy?: boolean;
}) => {
  let className = "";
  if (toggleBy !== undefined) {
    className = toggleBy ? "pressed" : "";
  }
  return (
    <button onClick={fn} className={className}>
      {children}
    </button>
  );
};

export default Button;
