import React from "react";
import "../App.css";

export default function ScorePopup({ score, position }) {
  // Determine styles based on score value
  const flamboyance = Math.min(score / 10, 1); // Scale between 0 and 1
  const size = 2 + flamboyance * 2; // Base size is 2rem, max is 4rem
  const color = flamboyance > 0.5 ? "#ff5733" : "#facc15"; // Higher scores are more vibrant
  const glow = flamboyance > 0.5 ? "0 0 20px rgba(255, 87, 51, 0.8)" : "0 0 10px rgba(250, 204, 21, 0.8)";

  const style = {
    top: position.y,
    left: position.x,
    fontSize: `${size}rem`,
    color: color,
    textShadow: glow,
  };

  return (
    <div className="score-popup" style={style}>
      +{score}
    </div>
  );
}