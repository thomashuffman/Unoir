import React from "react";
import Card from "./Card";

export default function Chain({ chain }) {
  return (
    <div className="chain">
      {chain.map((card, i) => (
        <Card key={i} card={card} small />
      ))}
    </div>
  );
}
