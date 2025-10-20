import React from "react";
import "../App.css";

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>How to Play UNOIR</h2>
        <ul>
          <li>Goal: Reach the score goal before running out of draws.</li>
          <li>You have a limited number of draws per level.</li>
          <li>You can play a card if it matches the <strong>color</strong> or <strong>number</strong> of the last card in the chain.</li>
          <li>Score is calculated based on the card value and chain synergies:</li>
          <ul>
            <li>+1.5 multiplier if color matches the previous card</li>
            <li>+2 multiplier if number matches the previous card</li>
            <li>I.E. if you play a 6 on a 6 you'll score +12, if you play a blue 3 on a blue 4 you'll score 5</li>
          </ul>
          <li>If you run out of draws and cannot play any card → Game Over</li>
        </ul>
        <button className="btn draw" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
