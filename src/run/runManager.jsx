import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeDeck,
  drawFromAvailableDeck,
  addScore,
  resetRun,
  resetScore,
  setGameState,
  proceedToNextLevel,
  addMoney,
} from "../store/runSlice";
import {
  calculateCardScore,
  canPlayCard,
  hasPlayableCard,
} from "../game/gameLogic";
import InfoModal from "../components/infoModal";
import DeckModal from "../components/deckModal";
import LevelScreen from "../levels/levelScreen";
import ShopScreen from "../shop/shopScreen";
import ScorePopup from "../components/ScorePopup";

export default function RunManager({ onExitRun }) {
  const LEVELS = [
    { number: 1, goal: 30, maxDraws: 8 },
    { number: 2, goal: 80, maxDraws: 8 },
    { number: 3, goal: 120, maxDraws: 8 },
  ];

  const INITIAL_HAND_SIZE = 5;

  const dispatch = useDispatch();
  const { deck, availableDeck, initialized, score, money, drawsLeft, currentLevelIndex, gameState, relics } = useSelector((state) => state.run);

  const [hand, setHand] = useState([]);
  const [chain, setChain] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [popups, setPopups] = useState([]); // Array to handle multiple popups

  const currentLevel = LEVELS[currentLevelIndex];

  // Initialize the deck and draw initial hand on mount
  useEffect(() => {
    if (!initialized) {
      dispatch(initializeDeck());
    } else if (hand.length === 0 && availableDeck.length >= INITIAL_HAND_SIZE && chain.length === 0) {
      for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
        const newCard = availableDeck[i];
        setHand((prevHand) => [...prevHand, newCard]);
        dispatch(drawFromAvailableDeck("initialDraw"));
      }
    }
  }, [initialized, availableDeck, hand.length, dispatch]);

  // Win/Lose checks and Golden Amulet effect
  useEffect(() => {
    if (gameState !== "playing") return;

    if (score >= currentLevel.goal) {
      let moneyBonus = 3 + drawsLeft;
      if (relics.some((relic) => relic.effect === "extraMoney")) {
        moneyBonus += 1; // Golden Amulet: +$1 per level
      }
      dispatch(addMoney(moneyBonus));
      if (currentLevelIndex === LEVELS.length - 1) {
        dispatch(setGameState("win"));
      } else {
        dispatch(setGameState("shop"));
      }
      return;
    }

    if (drawsLeft <= 0 && !hasPlayableCard(chain, hand)) {
      dispatch(setGameState("lose"));
    }
  }, [drawsLeft, hand, chain, score, gameState, currentLevel, currentLevelIndex, relics, dispatch]);

  // Draw a card with Lucky Charm effect
  const drawCardHandler = () => {
    if (drawsLeft <= 0 || availableDeck.length === 0 || gameState !== "playing") return;

    const newCard = availableDeck[0];
    dispatch(drawFromAvailableDeck());
    setHand([...hand, newCard]);
  };

  // Play a card
  const playCard = (card, cardPosition = { x: 0, y: 0 }) => {
    if (!canPlayCard(chain, card) || gameState !== "playing") return;

    const cardScore = calculateCardScore(chain, card, score);
    setChain([...chain, card]);
    setHand(hand.filter((c) => c.id !== card.id));

    dispatch(addScore(cardScore));

    if (card.enhancement === "plusMoney") {
      dispatch(addMoney(1));
    }

    // Trigger the score popup
    const popup = {
      id: Date.now(),
      score: cardScore,
      position: {
        x: cardPosition.x - 50, // Adjust for "above and to the left"
        y: cardPosition.y - 100,
      },
    };
    setPopups((prevPopups) => [...prevPopups, popup]);

    // Remove the popup after 1.5 seconds
    setTimeout(() => {
      setPopups((prevPopups) => prevPopups.filter((p) => p.id !== popup.id));
    }, 1500);
  };

  const resetChain = () => {
    setChain([]);
  };

  // Restart the entire run
  const restartRun = () => {
    dispatch(resetRun());
    dispatch(initializeDeck());
    setHand([]);
    setChain([]);
    dispatch(resetScore());
  };

  // Proceed to the next level
  const handleProceedToNextLevel = () => {
    setHand([]);
    setChain([]);
    const extraDraws = relics.filter((relic) => relic.effect === "extraDraw").length;
    const totalDraws = LEVELS[currentLevelIndex + 1].maxDraws + extraDraws;
    dispatch(proceedToNextLevel(totalDraws));
  };

  return (
    <div className="run-container">
      <p className="level">Level: {currentLevel.number}</p>
      <p className="score">Score: {score} / {currentLevel.goal}</p>
      <p className="money">Money: ${money}</p>
      <p className="deck-count">
        Deck: {availableDeck.length} cards left
        <button className="view-deck-button" onClick={() => setDeckModalOpen(true)}>
          View Deck
        </button>
      </p>
      <p className="draws-left">Draws left: {drawsLeft}</p>

      {/* Info button and modal */}
      <button className="info-button" onClick={() => setInfoOpen(true)}>
        Info / Rules
      </button>
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <DeckModal isOpen={deckModalOpen} onClose={() => setDeckModalOpen(false)} deck={availableDeck} />

      {/* Score Popups */}
      {popups.map((popup) => (
        <ScorePopup key={popup.id} score={popup.score} position={popup.position} />
      ))}

      {/* Screens */}
      {gameState === "playing" && (
        <LevelScreen
          hand={hand}
          chain={chain}
          drawsLeft={drawsLeft}
          score={score}
          goalScore={currentLevel.goal}
          onDraw={drawCardHandler}
          onPlayCard={(card, position) => playCard(card, position)}
          onResetChain={resetChain}
        />
      )}

      {gameState === "shop" && (
        <ShopScreen
          levelNumber={currentLevel.number}
          money={money}
          onProceed={handleProceedToNextLevel}
        />
      )}

      {gameState === "win" && (
        <div className="overlay">
          <h2 className="result">You Completed All Levels! 🎉</h2>
          <button className="btn draw" onClick={restartRun}>
            Restart Run
          </button>
          <button className="btn draw" onClick={onExitRun}>
            Exit to Menu
          </button>
        </div>
      )}

      {gameState === "lose" && (
        <div className="overlay">
          <h2 className="result">Game Over</h2>
          <button className="btn draw" onClick={restartRun}>
            Try Again
          </button>
          <button className="btn draw" onClick={onExitRun}>
            Exit to Menu
          </button>
        </div>
      )}
    </div>
  );
}