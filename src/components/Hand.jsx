import React from "react";
import Card from "./Card";

export default function Hand({ hand, onPlayCard }) {
  return (
    <div className="hand">
      {hand.map((card) => (
        <Card key={card.id} card={card} onClick={() => onPlayCard(card)} />
      ))}
    </div>
  );
}
