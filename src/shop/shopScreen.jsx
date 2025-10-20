import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyDeck, spendMoney, addRelic } from "../store/runSlice";
import { generatePackOptions } from "../game/gameLogic";

export default function ShopScreen({ levelNumber, onProceed }) {
  const dispatch = useDispatch();
  const { deck, money, relics } = useSelector((state) => state.run);

  const SHOP_ITEMS = [
    { id: 1, name: "Eco Pack (Values 1-3)", cost: 3, type: "eco" },
    { id: 2, name: "High Roller Pack (Values 4-6)", cost: 10, type: "highRoller" },
    { id: 3, name: "Remove Card", cost: 5, type: "removeCard" },
    { id: 4, name: "Remove Card from Deck", cost: 7, type: "removeCard" },
    { id: 5, name: "Lucky Charm (Extra Draw)", cost: 3, type: "relic", relic: { name: "Lucky Charm", effect: "extraDraw" } },
    { id: 6, name: "Golden Amulet (+$1 per Level)", cost: 5, type: "relic", relic: { name: "Golden Amulet", effect: "extraMoney" } },
  ];

  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [packOptions, setPackOptions] = useState([]);
  const [removingCard, setRemovingCard] = useState(false);

  const buyItem = (item) => {
    if (money < item.cost || purchasedItems.includes(item.id)) return;

    if (item.type === "removeCard") {
      setRemovingCard(true);
    } else if (item.type === "relic") {
      setPurchasedItems([...purchasedItems, item.id]);
      dispatch(spendMoney(item.cost));
      dispatch(addRelic(item.relic));
    } else {
      const options = generatePackOptions(item.type, deck);
      setSelectedPack(item);
      setPackOptions(options);
    }
  };

  const chooseCard = (card) => {
    if (!selectedPack || purchasedItems.includes(selectedPack.id)) return;

    setPurchasedItems([...purchasedItems, selectedPack.id]);
    dispatch(spendMoney(selectedPack.cost));
    dispatch(modifyDeck([...deck, card]));
    setSelectedPack(null);
    setPackOptions([]);
  };

  const removeCard = (card) => {
    if (removingCard) {
      setPurchasedItems([...purchasedItems, removingCard]);
      dispatch(spendMoney(SHOP_ITEMS.find(i => i.type === "removeCard" && i.cost === (removingCard === SHOP_ITEMS[2].id ? 5 : 7)).cost));
      dispatch(modifyDeck(deck.filter((c) => c.id !== card.id)));
      setRemovingCard(false);
    }
  };

  return (
    <div className="overlay shop-screen">
      <button className="btn next-level" onClick={onProceed}>
        Next Level ({levelNumber + 1})
      </button>
      <h2 className="result">Shop (Level {levelNumber})</h2>
      <p>Money: ${money}</p>
      <p>Relics: {relics.length ? relics.map(r => r.name).join(", ") : "None"}</p>
      <p>Select an item:</p>

      <ul className="shop-items">
        {SHOP_ITEMS.map((item) => (
          <li key={item.id} className="shop-item">
            <span>{item.name} (Cost: ${item.cost})</span>
            <button
              className="btn buy"
              onClick={() => buyItem(item)}
              disabled={purchasedItems.includes(item.id) || money < item.cost}
            >
              {purchasedItems.includes(item.id) ? "Purchased" : "Buy"}
            </button>
          </li>
        ))}
      </ul>

      {selectedPack && (
        <div className="pack-modal">
          <h3>Choose a Card from {selectedPack.name}</h3>
          <div className="pack-options">
            {packOptions.map((card) => (
              <button
                key={card.id}
                className={`card ${card.color.toLowerCase()}`}
                onClick={() => chooseCard(card)}
              >
                {card.value}
                {card.enhancement && (
                  <span className="enhancement">
                    {card.enhancement === "plusFive" && " (+5)"}
                    {card.enhancement === "wild" && " (Wild)"}
                    {card.enhancement === "plusMoney" && " (+$1)"}
                    {card.enhancement === "purple" && " (Purple)"}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="btn close" onClick={() => setSelectedPack(null)}>
            Cancel
          </button>
        </div>
      )}

      {removingCard && (
        <div className="pack-modal">
          <h3>Choose a Card to Remove</h3>
          <div className="remove-deck-grid">
            {deck.length === 0 ? (
              <p>No cards to remove.</p>
            ) : (
              deck.map((card) => (
                <button
                  key={card.id}
                  className={`deck-card ${card.color.toLowerCase()}`}
                  onClick={() => removeCard(card)}
                >
                  {card.value}
                  {card.enhancement && (
                    <span className="enhancement">
                      {card.enhancement === "plusFive" && " (+5)"}
                      {card.enhancement === "wild" && " (Wild)"}
                      {card.enhancement === "plusMoney" && " (+$1)"}
                      {card.enhancement === "purple" && " (Purple)"}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
          <button className="btn close" onClick={() => setRemovingCard(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}