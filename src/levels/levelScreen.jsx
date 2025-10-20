import React from "react";
import PropTypes from "prop-types";
import { canPlayCard } from "../game/gameLogic";

const LevelScreen = ({ hand, chain, drawsLeft, score, goalScore, onDraw, onPlayCard, onResetChain }) => {
  const handleCardClick = (card, event) => {
    // Get the position of the card element
    const cardPosition = {
      x: event.target.getBoundingClientRect().left,
      y: event.target.getBoundingClientRect().top,
    };

    // Pass the card and its position to onPlayCard
    onPlayCard(card, cardPosition);
  };

  return (
    <div className="level-screen">
      <div className="chain">
        {chain.length === 0 ? (
          <p>No cards played yet.</p>
        ) : (
          chain.map((card) => (
            <div
              key={card.id}
              className={`card ${card.color.toLowerCase()}`}
            >
              {card.value}
              {card.enhancement ? (
                <span className="enhancement">
                  {card.enhancement === "plusFive" && " (+5)"}
                  {card.enhancement === "wild" && " (Wild)"}
                  {card.enhancement === "plusMoney" && " (+$1)"}
                  {card.enhancement === "purple" && " (Purple)"}
                  {!["plusFive", "wild", "plusMoney", "purple"].includes(card.enhancement) && ` (${card.enhancement})`}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="controls">
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
          Reset Chain
        </button>
      </div>

      <div className="hand">
        {hand.length === 0 ? (
          <p>No cards in hand.</p>
        ) : (
          hand.map((card) => (
            <button
              key={card.id}
              className={`card ${card.color.toLowerCase()} ${canPlayCard(chain, card) ? "" : "disabled"}`}
              onClick={(event) => handleCardClick(card, event)}
              disabled={!canPlayCard(chain, card)}
            >
              {card.value}
              {card.enhancement ? (
                <span className="enhancement">
                  {card.enhancement === "plusFive" && " (+5)"}
                  {card.enhancement === "wild" && " (Wild)"}
                  {card.enhancement === "plusMoney" && " (+$1)"}
                  {card.enhancement === "purple" && " (Purple)"}
                  {!["plusFive", "wild", "plusMoney", "purple"].includes(card.enhancement) && ` (${card.enhancement})`}
                </span>
              ) : null}
            </button>
          ))
        )}
      </div>

      <p className="score">Score: {score} / {goalScore}</p>
    </div>
  );
};

LevelScreen.propTypes = {
  hand: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      enhancement: PropTypes.string,
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
};

export default LevelScreen;