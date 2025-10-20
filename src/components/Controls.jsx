import React from "react";

export default function Controls({ onDraw, onReset, remainingDraws }) {
  return (
    <div className="controls">
      <button className="btn draw" onClick={onDraw}>
        Draw ({remainingDraws} left)
      </button>
      <button className="btn reset" onClick={onReset}>
        Reset Chain
      </button>
    </div>
  );
}
