import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyDeck, spendMoney, addRelic } from "../store/runSlice";
import { generatePackOptions } from "../game/gameLogic";
import DeckModal from "../components/deckModal";

// Sort cards by color groups and value within each group
const sortDeckByColorAndValue = (deck) => {
  const colorOrder = ['red', 'blue', 'green', 'yellow', 'purple'];
  
  // Separate wild cards
  const wildCards = deck.filter(card => card.enhancement === 'wild');
  const regularCards = deck.filter(card => card.enhancement !== 'wild');
  
  // Group cards by color
  const groupedByColor = colorOrder.map(color => {
    return regularCards
      .filter(card => card.color.toLowerCase() === color)
      .sort((a, b) => b.value - a.value); // Sort highest to lowest
  });
  
  // Flatten and add wild cards at the end
  return [...groupedByColor.flat(), ...wildCards.sort((a, b) => b.value - a.value)];
};

export default function ShopScreen({ levelNumber, onProceed, allRelics }) {
  const dispatch = useDispatch();
  const { deck, money, relics } = useSelector((state) => state.run);

  const CARD_PACKS = [
    { id: "eco", name: "Eco Pack", subtitle: "Values 1-3", cost: 3, type: "eco", icon: "🌿" },
    { id: "highRoller", name: "High Roller Pack", subtitle: "Values 4-6", cost: 6, type: "highRoller", icon: "💎" },
  ];

  const SHOP_UTILITIES = [
    { id: "removeCard", name: "Remove Card", description: "Remove a card from your deck", cost: 5, type: "removeCard", icon: "🗑️" },
  ];

  const availableRelics = allRelics.filter(
    (relic) => !relics.some((r) => r.effect === relic.effect)
  );

  const [shopRelics, setShopRelics] = useState([]);

  useEffect(() => {
    if (availableRelics.length > 0 && shopRelics.length === 0) {
      const selectWeightedRelics = () => {
        const rarityWeights = {
          common: 40,
          uncommon: 30,
          rare: 20,
          epic: 8,
          legendary: 2
        };

        const selected = [];
        const availablePool = [...availableRelics];

        for (let i = 0; i < 3 && availablePool.length > 0; i++) {
          const totalWeight = availablePool.reduce((sum, relic) => {
            return sum + (rarityWeights[relic.rarity] || 10);
          }, 0);

          let random = Math.random() * totalWeight;
          let selectedRelic = null;

          for (const relic of availablePool) {
            random -= rarityWeights[relic.rarity] || 10;
            if (random <= 0) {
              selectedRelic = relic;
              break;
            }
          }

          if (selectedRelic) {
            selected.push(selectedRelic);
            const index = availablePool.findIndex(r => r.effect === selectedRelic.effect);
            availablePool.splice(index, 1);
          }
        }

        return selected;
      };

      setShopRelics(selectWeightedRelics());
    }
  }, [availableRelics.length, shopRelics.length]);

  const displayedRelics = shopRelics.filter(
    (relic) => !relics.some((r) => r.effect === relic.effect)
  );

  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [packOptions, setPackOptions] = useState([]);
  const [removingCard, setRemovingCard] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);

  const buyPack = (pack) => {
    if (money < pack.cost || purchasedItems.includes(pack.id)) return;

    setPurchasedItems([...purchasedItems, pack.id]);
    dispatch(spendMoney(pack.cost));

    const options = generatePackOptions(pack.type, deck);
    setSelectedPack(pack);
    setPackOptions(options);
  };

  const buyRelic = (relic) => {
    if (money < relic.cost || purchasedItems.includes(relic.effect)) return;

    setPurchasedItems([...purchasedItems, relic.effect]);
    dispatch(spendMoney(relic.cost));
    dispatch(addRelic(relic));
  };

  const buyUtility = (utility) => {
    if (money < utility.cost) return;

    if (utility.type === "removeCard") {
      setRemovingCard(true);
    }
  };

  const chooseCard = (card) => {
    if (!selectedPack) return;

    dispatch(modifyDeck([...deck, card]));
    setSelectedPack(null);
    setPackOptions([]);
  };

  const removeCard = (card) => {
    if (removingCard) {
      setPurchasedItems([...purchasedItems, "removeCard"]);
      dispatch(spendMoney(SHOP_UTILITIES[0].cost));
      dispatch(modifyDeck(deck.filter((c) => c.id !== card.id)));
      setRemovingCard(false);
    }
  };

  const hasQuickVeteran = relics.some(r => r.effect === "quickVeteran");
  const veteranThreshold = hasQuickVeteran ? 3 : 5;

  const sortedDeck = sortDeckByColorAndValue(deck);

  return (
    <div className="overlay">
      <div className="shop-screen">
        <button className="btn next-level" onClick={onProceed}>
          Next Level →
        </button>
        
        <h2 className="shop-title">🏪 The Shop</h2>
        <div className="shop-header">
          <p className="shop-money">💰 ${money}</p>
          <p className="shop-level">Level {levelNumber} Complete!</p>
          <button className="view-deck-button" onClick={() => setShowDeckModal(true)}>
            View Deck
          </button>
        </div>

        <div className="shop-section">
          <h3 className="section-title">📦 Card Packs</h3>
          <div className="shop-grid pack-grid">
            {CARD_PACKS.map((pack) => (
              <div 
                key={pack.id} 
                className={`shop-card ${purchasedItems.includes(pack.id) ? "purchased" : ""} ${money < pack.cost ? "disabled" : ""}`}
              >
                <div className="shop-card-icon">{pack.icon}</div>
                <h4>{pack.name}</h4>
                <p className="shop-card-subtitle">{pack.subtitle}</p>
                <button
                  className="btn buy"
                  onClick={() => buyPack(pack)}
                  disabled={purchasedItems.includes(pack.id) || money < pack.cost}
                >
                  {purchasedItems.includes(pack.id) ? "Purchased" : `$${pack.cost}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {levelNumber%2===0&& (
          <div>
            <h3 className="section-title">Relics only show up after beating odd numbered levels, plan wisely</h3>
          </div>
        )}

        {displayedRelics.length > 0 && levelNumber%2!==0 && (
          <div className="shop-section">
            <h3 className="section-title">✨ Relics</h3>
            <div className="shop-grid relic-grid">
              {displayedRelics.map((relic) => (
                <div 
                  key={relic.effect} 
                  className={`shop-card relic-card rarity-${relic.rarity} ${purchasedItems.includes(relic.effect) ? "purchased" : ""} ${money < relic.cost ? "disabled" : ""}`}
                >
                  <span className={`rarity-badge rarity-${relic.rarity}`}>{relic.rarity.toUpperCase()}</span>
                 <div className="shop-card-icon">
                    {relic.icon?.endsWith?.(".png") || relic.icon?.endsWith?.(".jpg") ? (
                      <img src={relic.icon} alt={relic.name} className="relic-icon-image" />
                    ) : (
                      <span>{relic.icon}</span>
                    )}
                  </div>
                  <h4>{relic.name}</h4>
                  <p className="shop-card-description">{relic.description}</p>
                  <button
                    className="btn buy"
                    onClick={() => buyRelic(relic)}
                    disabled={purchasedItems.includes(relic.effect) || money < relic.cost}
                  >
                    {purchasedItems.includes(relic.effect) ? "Owned" : `$${relic.cost}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="shop-section">
          <h3 className="section-title">🔧 Utilities</h3>
          <div className="shop-grid utility-grid">
            {SHOP_UTILITIES.map((utility) => (
              <div 
                key={utility.id} 
                className={`shop-card ${money < utility.cost ? "disabled" : ""}`}
              >
                <div className="shop-card-icon">{utility.icon}</div>
                <h4>{utility.name}</h4>
                <p className="shop-card-description">{utility.description}</p>
                <button
                  className="btn buy"
                  onClick={() => buyUtility(utility)}
                  disabled={money < utility.cost}
                >
                  ${utility.cost}
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedPack && (
          <div className="modal-overlay">
          <button className="view-deck-button" onClick={() => setShowDeckModal(true)}>
            View Deck
          </button>
            <div className="pack-modal">
              <h3>Choose a Card from {selectedPack.name}</h3>
              <div className="pack-options">
                {packOptions.map((card) => (
                  <button
                    key={card.id}
                    className={`card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()}`}
                    onClick={() => chooseCard(card)}
                  >
                    {card.value}
                    {card.enhancement && (
                      <span className="enhancement">
                        {card.enhancement === "plusFive" && " (+5)"}
                        {card.enhancement === "wild" && " (Wild)"}
                        {card.enhancement === "plusMoney" && " (+$1)"}
                        {card.enhancement === "purple" && " (Score x0.8 to x2.0)"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button className="btn close" onClick={() => { setSelectedPack(null); setPackOptions([]); }}>
                Skip
              </button>
            </div>
          </div>
        )}

        {removingCard && (
          <div className="modal-overlay">
            <div className="pack-modal remove-card-modal">
              <h3>Choose a Card to Remove</h3>
              <div className="remove-deck-grid">
                {deck.length === 0 ? (
                  <p>No cards to remove.</p>
                ) : (
                  sortedDeck.map((card) => (
                    <button
                      key={card.id}
                      className={`deck-card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
                      onClick={() => removeCard(card)}
                    >
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
                    </button>
                  ))
                )}
              </div>
              <button className="btn close" onClick={() => setRemovingCard(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <DeckModal 
          isOpen={showDeckModal} 
          onClose={() => setShowDeckModal(false)} 
          deck={deck}
          relics={relics}
        />
      </div>
    </div>
  );
}