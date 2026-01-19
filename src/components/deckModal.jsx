import React, { useState } from "react";

const enhancementDescriptions = {
  plusFive: "Adds 5 points to your score.",
  wild: "Can be played on any card and any color card can follow it.",
  plusMoney: "Grants $1 when played.",
  purple: "Current Score multipler between 1x and 2.2x.",
};

// Group cards by color and sort by value within each group
const groupDeckByColor = (deck, sortOrder = 'desc') => {
  const colorOrder = ['red', 'blue', 'green', 'yellow', 'purple'];
  
  // Separate wild cards
  const wildCards = deck.filter(card => card.enhancement === 'wild');
  const regularCards = deck.filter(card => card.enhancement !== 'wild');
  
  // Group cards by color
  const groupedByColor = colorOrder.map(color => ({
    color,
    cards: regularCards
      .filter(card => card.color.toLowerCase() === color)
      .sort((a, b) => sortOrder === 'desc' ? b.value - a.value : a.value - b.value)
  })).filter(group => group.cards.length > 0);
  
  // Add wild cards as a separate group if they exist
  if (wildCards.length > 0) {
    groupedByColor.push({
      color: 'wild',
      cards: wildCards.sort((a, b) => sortOrder === 'desc' ? b.value - a.value : a.value - b.value)
    });
  }
  
  return groupedByColor;
};
  
// Group cards by number/value
const groupDeckByNumber = (deck, sortOrder = 'desc') => {
  // Get all unique values and sort them
  const values = [...new Set(deck.map(card => card.value))].sort((a, b) => 
    sortOrder === 'desc' ? b - a : a - b
  );
  
  return values.map(value => ({
    value,
    cards: deck.filter(card => card.value === value)
  }));
};

const DeckModal = ({ isOpen, onClose, deck, fullDeck, relics = [] }) => {
  const [sortBy, setSortBy] = useState('color'); // 'color' or 'number'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [viewMode, setViewMode] = useState('available'); // 'available' or 'full'

  if (!isOpen) return null;

  // Check if player has Memory Catalyst relic
  const hasQuickVeteran = relics.some(r => r.effect === "quickVeteran");
  const veteranThreshold = hasQuickVeteran ? 3 : 5;

  const toggleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if clicking the same sort button
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Switch to new sort type with default desc order
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Use the appropriate deck based on view mode
  const currentDeck = viewMode === 'full' && fullDeck ? fullDeck : deck;
  
  const groupedDeck = sortBy === 'color' 
    ? groupDeckByColor(currentDeck, sortOrder)
    : groupDeckByNumber(currentDeck, sortOrder);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ 
          color: '#facc15', 
          marginBottom: '20px',
          fontSize: '1.5rem',
          fontWeight: '800'
        }}>
          {viewMode === 'full' ? 'Full Deck' : 'Remaining Deck'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px', width: '100%' }}>
          {/* View Mode Toggle - Top Row */}
          {fullDeck && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button 
                onClick={() => setViewMode('available')}
                style={{
                  flex: 1,
                  background: viewMode === 'available' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                    : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                  color: 'white',
                  padding: '10px 20px',
                  border: viewMode === 'available' ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'available' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(59, 130, 246, 0.4)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                📋 Remaining ({deck.length})
              </button>
              <button 
                onClick={() => setViewMode('full')}
                style={{
                  flex: 1,
                  background: viewMode === 'full' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                    : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                  color: 'white',
                  padding: '10px 20px',
                  border: viewMode === 'full' ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'full' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(59, 130, 246, 0.4)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                🃏 Full Deck ({fullDeck.length})
              </button>
            </div>
          )}
          
          {/* Sort Buttons - Bottom Row */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              onClick={() => toggleSort('color')}
              style={{
                flex: 1,
                background: sortBy === 'color' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                color: 'white',
                padding: '10px 20px',
                border: sortBy === 'color' ? '2px solid rgba(16, 185, 129, 0.5)' : '2px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                boxShadow: sortBy === 'color' 
                  ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              🎨 Color {sortBy === 'color' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button 
              onClick={() => toggleSort('number')}
              style={{
                flex: 1,
                background: sortBy === 'number' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                color: 'white',
                padding: '10px 20px',
                border: sortBy === 'number' ? '2px solid rgba(16, 185, 129, 0.5)' : '2px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                boxShadow: sortBy === 'number' 
                  ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              🔢 Number {sortBy === 'number' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        <button 
          className="btn close" 
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            color: 'white',
            padding: '8px 16px',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            marginBottom: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
        >
          ✕ Close
        </button>

        {currentDeck.length === 0 ? (
          <p style={{ color: '#d1d5db', fontSize: '14px' }}>No cards left in the deck.</p>
        ) : (
          <div className="deck-by-color" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {groupedDeck.map((group, idx) => (
              <div key={sortBy === 'color' ? group.color : group.value} className="color-row" style={{ marginBottom: '8px' }}>
                {sortBy === 'number' && (
                  <div style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '4px',
                    color: '#facc15',
                    fontSize: '13px'
                  }}>
                    Value: {group.value}
                  </div>
                )}
                {group.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`deck-card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
                    title={card.enhancement ? enhancementDescriptions[card.enhancement] : ""}
                    style={{ 
                      height: '60px',
                      minHeight: '60px',
                      fontSize: '14px',
                      padding: '6px'
                    }}
                  >
                    <div className="card-content" style={{ gap: '2px' }}>
                      {card.isMega && <span className="mega-badge" style={{ fontSize: '9px', padding: '1px 4px' }}>MEGA</span>}
                      {card.isMega && <span className="mega-money-icon" style={{ fontSize: '14px' }}>💰</span>}
                      {card.isVeteran && !card.isMega && <span className="veteran-badge" style={{ fontSize: '14px' }}>⭐</span>}
                      {card.value}
                      {card.enhancement && (
                        <span className="enhancement" style={{ fontSize: '11px' }}>
                          {card.enhancement === "plusFive" && " (+5)"}
                          {card.enhancement === "wild" && " (Wild)"}
                          {card.enhancement === "plusMoney" && " (+$1)"}
                          {card.enhancement === "purple" && " (Purple)"}
                        </span>
                      )}
                      {card.timesPlayed > 0 && !card.isMega && (
                        <span className="memory-tracker" style={{ fontSize: '10px' }}>{card.timesPlayed}/{card.isVeteran ? "★" : veteranThreshold}</span>
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