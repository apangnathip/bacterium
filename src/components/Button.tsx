import { ReactNode } from "react";
import "./Button.css";

const Button = ({
  children,
  fn,
  toggleBy,
  toolTipText,
}: {
  children: ReactNode;
  fn: () => void;
  toggleBy?: boolean;
  toolTipText?: string;
}) => {
  let className = "";
  if (toggleBy !== undefined) {
    className = toggleBy ? "pressed" : "";
  }
  return (
    <button onClick={fn} className={className}>
      <span className="tooltip">{toolTipText}</span>
      {children}
    </button>
  );
};

export default Button;
