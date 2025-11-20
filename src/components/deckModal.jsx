import React from "react";

const enhancementDescriptions = {
  plusFive: "Adds 5 points to your score.",
  wild: "Can be played on any card and any color card can follow it.",
  plusMoney: "Grants $1 when played.",
  purple: "Current Score multipler between 1x and 2.2x.",
};

// Group cards by color and sort by value within each group
const groupDeckByColor = (deck) => {
  const colorOrder = ['red', 'blue', 'green', 'yellow', 'purple'];
  
  // Separate wild cards
  const wildCards = deck.filter(card => card.enhancement === 'wild');
  const regularCards = deck.filter(card => card.enhancement !== 'wild');
  
  // Group cards by color
  const groupedByColor = colorOrder.map(color => ({
    color,
    cards: regularCards
      .filter(card => card.color.toLowerCase() === color)
      .sort((a, b) => b.value - a.value) // Sort highest to lowest
  })).filter(group => group.cards.length > 0); // Only include colors with cards
  
  // Add wild cards as a separate group if they exist
  if (wildCards.length > 0) {
    groupedByColor.push({
      color: 'wild',
      cards: wildCards.sort((a, b) => b.value - a.value)
    });
  }
  
  return groupedByColor;
};

const DeckModal = ({ isOpen, onClose, deck, relics = [] }) => {
  if (!isOpen) return null;

  // Check if player has Memory Catalyst relic
  const hasQuickVeteran = relics.some(r => r.effect === "quickVeteran");
  const veteranThreshold = hasQuickVeteran ? 3 : 5;

  const groupedDeck = groupDeckByColor(deck);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Remaining Deck</h2>
        <button className="btn close" onClick={onClose}>
          Close
        </button>
        {deck.length === 0 ? (
          <p>No cards left in the deck.</p>
        ) : (
          <div className="deck-by-color">
            {groupedDeck.map((group) => (
              <div key={group.color} className="color-row">
                {group.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`deck-card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
                    title={card.enhancement ? enhancementDescriptions[card.enhancement] : ""}
                  >
                    <div className="card-content">
                      {card.isMega && <span className="mega-badge">MEGA</span>}
                      {card.isMega && <span className="mega-money-icon">💰</span>}
                      {card.isVeteran && !card.isMega && <span className="veteran-badge">⭐</span>}
                      {card.value}
                      {card.enhancement && (
                        <span className="enhancement">
                          {card.enhancement === "plusFive" && " (+5)"}
                          {card.enhancement === "wild" && " (Wild)"}
                          {card.enhancement === "plusMoney" && " (+$1)"}
                          {card.enhancement === "purple" && " (Purple)"}
                        </span>
                      )}
                      {card.timesPlayed > 0 && !card.isMega && (
                        <span className="memory-tracker">{card.timesPlayed}/{card.isVeteran ? "★" : veteranThreshold}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckModal;