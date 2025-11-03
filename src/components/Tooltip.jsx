import React from "react";
import "../App.css";

export default function Tooltip({ children, text }) {
  return (
    <span className="game-term" data-tooltip={text}>
      {children}
    </span>
  );
}
