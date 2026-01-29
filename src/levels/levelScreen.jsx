import React, { useState } from "react";
import PropTypes from "prop-types";
import { canPlayCard } from "../game/gameLogic";
import DeckModal from "../components/deckModal";
import { useSelector} from "react-redux";

const enhancementDescriptions = {
  plusFive: "Adds 5 points to your score.",
  wild: "Can be played on any card and any color card can follow it.",
  plusMoney: "Grants $1 when played.",
  purple: "Current Score multiplier between 0.8x and 2.0x.",
};

const LevelScreen = ({ hand, chain, drawsLeft, score, goalScore, onDraw, onPlayCard, onResetChain, relics = [], availableDeck = [], deck=[], level = 1, money = 0, LEVELS, restartRun }) => {
  const { currentBoss } = useSelector((state) => state.run);
  
  const [showRelics, setShowRelics] = useState(false);
  const [deckModalOpen, setDeckModalOpen] = useState(false);

  // Check if player has Wildcard Master relic
  const hasWildcardMaster = relics.some(r => r.effect === "wildcardChance");
  
  // Check if the last card in chain triggered wildcard
  const lastCardWasWildcard = chain.length > 0 && chain[chain.length - 1].actedAsWildcard;

  const handleCardClick = (card, event) => {
    // Get the position of the card element
    const cardPosition = {
      x: event.target.getBoundingClientRect().left,
      y: event.target.getBoundingClientRect().top,
    };

    onPlayCard(card, cardPosition);
  };

  // Check if player has Card Sage's Tome relic
  const hasCardVision = relics.some(r => r.effect === "cardVision");
  
  // Check if player has Memory Catalyst relic (changes veteran threshold)
  const hasQuickVeteran = relics.some(r => r.effect === "quickVeteran");
  const veteranThreshold = hasQuickVeteran ? 3 : 5;
  
  // Check if player has Cheap Shuffle relic (changes reset cost)
  const hasCheapReset = relics.some(r => r.effect === "cheapReset");
  const hasFreeResets = relics.some(r => r.effect === "freeResets");
  let resetCost = hasFreeResets ? 0 : (hasCheapReset ? 2 : 4);
  if(currentBoss.name === 'chainExpensive'){
    resetCost = money
  }


  // Calculate progress percentage
  const progressPercentage = Math.min((score / goalScore) * 100, 100);

  return (
    <div className={`level-screen ${currentBoss.name}`}>
      {/* Header: Game Title + Deck Button */}
      <div className="main-header">
      <div className="level-header">
        <h1 className="game-title" aria-label="UNOIR">UNOIR</h1>
        <div className="boss-description">{currentBoss.description}</div>
        <div className="level-header-actions">
          <button className="view-deck-inline" onClick={() => setDeckModalOpen(true)}>
            View Deck
          </button>
        </div>
      </div>
      
      <DeckModal isOpen={deckModalOpen} onClose={() => setDeckModalOpen(false)} deck={availableDeck} fullDeck={deck} relics={relics} />

      {/* Stats Display */}
      <div className="stats-container">
        <div className="stat-item level-stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level} / {LEVELS.length-6}</span>
        </div>
        <div className="stat-item score-stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
          <span className="stat-subtext">/ {goalScore}</span>
        </div>
        <div className="stat-item money-stat">
          <span className="stat-label">Money</span>
          <span className="stat-value">${money}</span>
        </div>
        <div className="stat-item draws-stat">
          <span className="stat-label">Draws Left</span>
          <span className="stat-value">{drawsLeft}</span>
        </div>
        <div className="stat-item draws-stat">
          <span className="stat-label">Cards Left</span>
          <span className="stat-value">{availableDeck.length}</span>
        </div>
      </div>
      </div>

      {/* Progress Bar */}
      <div hidden={deckModalOpen} className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">{Math.round(progressPercentage)}%</span>
      </div>

      {/* Relics Display Toggle */}
      <button className="relics-toggle" onClick={() => setShowRelics(!showRelics)}>
        {showRelics ? "Hide Relics" : `Relics (${relics.length})`}
      </button>

      {showRelics && (
        <div className="relics-display">
          <h3>Active Relics</h3>
          {relics.length === 0 ? (
            <p>No relics yet</p>
          ) : (
            <ul className="relics-list">
              {relics.map((relic, index) => (
                <li key={index} className="relic-item">
                  <span className="relic-icon">{relic.icon || "✨"}</span>
                  <div className="relic-details">
                    <strong>{relic.name}</strong>
                    <p>{relic.description || getRelicDescription(relic.effect)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Card Vision - Show top 3 cards if relic is active */}
      {hasCardVision && availableDeck.length > 0 && (
        <div className="card-vision">
          <h4>Next Cards (Card Sage's Tome):</h4>
          <div className="vision-cards">
            {availableDeck.slice(0, 3).map((card, index) => (
              <div
                key={card.id}
                className={`mini-card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${card.isVeteran ? "veteran" : ""}`}
              >
                {card.isVeteran && <span className="veteran-badge-mini">⭐</span>}
                {card.value}
                {card.timesPlayed > 0 && (
                  <span className="memory-tracker-mini">{card.timesPlayed}/{card.isVeteran ? "★" : veteranThreshold}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

     <div style={{visibility: deckModalOpen ? 'hidden' : 'visible' }} className="chain">
        {chain.length === 0 ? (
            <p>No cards played yet.</p>
        ) : (
            chain.map((card) => (
            <div
                key={card.id}
                className={`card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
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
                    {card.enhancement === "purple" && " (Score x0.8 to x2.0)"}
                </span>
                )}
                {card.timesPlayed > 0 && !card.isMega && (
                  <span className="memory-tracker">{card.timesPlayed}/{card.isVeteran ? "★" : veteranThreshold}</span>
                )}
            </div>
            ))
        )}
        </div>
      {/* Warning message when low on money or stuck */}
      {drawsLeft <= 0 && chain.length > 0 && !hand.some(card => canPlayCard(chain, card)) && !hasWildcardMaster && (
        <div className="warning-message stuck">
          ⚠️ No playable cards! Reset chain to continue {resetCost > 0 ? `(-$${resetCost})` : ''}
        </div>
      )}
      <div style={{visibility: deckModalOpen ? 'hidden' : 'visible' }} className="hand">
        {hand.length === 0 ? (
          <p>No cards in hand.</p>
        ) : (
          hand.map((card) => {
            const isPlayable = canPlayCard(chain, card);
            // Show glow on cards that are now playable because last card was a wildcard
            const isPlayableOnWildcard = lastCardWasWildcard && isPlayable;
            
            return (
              <button
                key={card.id}
                className={`card ${card.enhancement === "wild" ? "wild" : card.color.toLowerCase()} ${
                  isPlayable ? "" : "disabled"
                } ${isPlayableOnWildcard ? "playable-on-wildcard" : ""} ${card.isVeteran ? "veteran" : ""} ${card.isMega ? "mega" : ""}`}
                onClick={(event) => handleCardClick(card, event)}
                disabled={!isPlayable}
                title={card.enhancement ? enhancementDescriptions[card.enhancement] : ""}
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
                    {card.enhancement === "purple" && " (Score x0.8 to x2.0)"}
                    {!["plusFive", "wild", "plusMoney", "purple"].includes(card.enhancement) &&
                      ` (${card.enhancement})`}
                  </span>
                )}
                {card.timesPlayed > 0 && !card.isVeteran && !card.isMega && (
                  <span className="memory-tracker">{card.timesPlayed}/{veteranThreshold}</span>
                )}
              </button>
            );
          })
        )}
      </div>
      <div style={{visibility: deckModalOpen ? 'hidden' : 'visible' }} className="controls">
        <button
          className="btn draw"
          onClick={onDraw}
          disabled={drawsLeft <= 0}
        >
          Draw Card ({drawsLeft} left)
        </button>
        <button
          className="btn reset"
          onClick={onResetChain}
          disabled={chain.length === 0}
        >
          Reset Chain {resetCost > 0 ? `-$${resetCost}` : '(Free)'}
          
        </button>
      </div>
    </div>
  );
};

// Helper function to get relic descriptions for relics without stored descriptions
const getRelicDescription = (effect) => {
  const descriptions = {
    extraDraw: "Extra draw per level",
    extraMoney: "+$5 per level completion",
    startingMoney: "Start each level with +$3",
    cardVision: "See the top 3 cards of your deck",
    luckyBonus: "+20% chance for bonus points",
  };
  return descriptions[effect] || "Unknown effect";
};

LevelScreen.propTypes = {
  hand: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      enhancement: PropTypes.string,
      isVeteran: PropTypes.bool,
      timesPlayed: PropTypes.number,
    })
  ).isRequired,
  chain: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      enhancement: PropTypes.string,
    })
  ).isRequired,
  drawsLeft: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  goalScore: PropTypes.number.isRequired,
  onDraw: PropTypes.func.isRequired,
  onPlayCard: PropTypes.func.isRequired,
  onResetChain: PropTypes.func.isRequired,
  relics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      effect: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  availableDeck: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      enhancement: PropTypes.string,
    })
  ),
  deck: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      enhancement: PropTypes.string,
    })
  ),
  level: PropTypes.number,
  money: PropTypes.number,
  LEVELS: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      goal: PropTypes.number.isRequired,
      number: PropTypes.number.isRequired,
      levelType: PropTypes.string.isRequired,
    })
  )
};

export default LevelScreen;