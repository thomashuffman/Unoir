import React from "react";
import "../App.css";

export default function Card({ card, onClick, small }) {
  return (
    <button
      className={`card ${card.color} ${small ? "small" : ""}`}
      onClick={onClick}
    >
      {card.value}
    </button>
  );
}
