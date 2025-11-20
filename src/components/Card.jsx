import React from "react";
import "../App.css";
export default function Card({ card, onClick, small }) {
  const isTempWildcard = card.tempWild;
  const isWildcard = card.enhancement === "wild" || isTempWildcard;
  
  return (
    <button
      className={`card ${card.color} ${small ? "small" : ""} ${
        isTempWildcard ? "temp-wildcard" : ""
      } ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
      onClick={onClick}
    >
      {isTempWildcard && <span className="wildcard-indicator">🃏</span>}
      {card.isVeteran && <span className="veteran-badge">⭐</span>}
      {card.isMega && <div className="mega-badge">MEGA</div>}
      {card.isMega && <span className="mega-money-icon">💰</span>}
      {card.timesPlayed > 0 && (
        <span className="memory-tracker">{card.timesPlayed}</span>
      )}
      <span>{card.value}</span>
      {card.enhancement === "plusFive" && <span className="enhancement">+5</span>}
      {card.enhancement === "wild" && !isTempWildcard && <span className="enhancement">🃏</span>}
      {card.enhancement === "plusMoney" && <span className="enhancement">💰</span>}
      {card.enhancement === "purple" && <span className="enhancement">🎲</span>}
    </button>
  );
}
