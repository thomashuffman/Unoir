import React from "react";

const deckModal = ({ isOpen, onClose, deck }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Remaining Deck</h2>
        {deck.length === 0 ? (
          <p>No cards left in the deck.</p>
        ) : (
          <div className="deck-grid">
            {deck.map((card) => (
              <div key={card.id} className={`deck-card ${card.color.toLowerCase()}`}>
                {card.value}
                {card.enhancement && (
                <span className="enhancement">
                {card.enhancement === "plusFive" && " (+5)"}

                {card.enhancement === "wild" && " (Wild)"}

                {card.enhancement === "plusMoney" && " (+$1)"}

                {card.enhancement === "purple" && " (Purple)"}

            </span>
        )}
              </div>
            ))}
          </div>
        )}
        <button className="btn close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default deckModal;