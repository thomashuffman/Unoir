import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeDeck,
  drawFromAvailableDeck,
  addScore,
  add2Base,
  resetRun,
  resetScore,
  setGameState,
  proceedToNextLevel,
  addMoney,
  addRelic,
  modifyDeck,
  addDraws,
} from "../store/runSlice";
import {
  calculateCardScore,
  canPlayCard,
  hasPlayableCard,
} from "../game/gameLogic";
import {
  ALL_STARTER_RELICS
} from "../relics"
import InfoModal from "../components/infoModal";
import LevelScreen from "../levels/levelScreen";
import ShopScreen from "../shop/shopScreen";
import ScorePopup from "../components/ScorePopup";
import Tooltip from "../components/Tooltip";

// ========== DEV MODE ==========
// Set DEV_MODE to true and add relic names to DEV_RELICS to test specific relics
const DEV_MODE = false; // Set to true to enable dev mode
const DEV_RELICS = [
  "Initial Draw"
  // "Rainbow Bridge",
  // "Chromatic Fusion",
]; // Add relic names here to force them into the selection
// ==============================

export default function RunManager({ onExitRun }) {
  const LEVELS = [
    { number: 0, goal: 0, maxDraws: 8, levelType: 'normal' },
    { number: 1, goal: 20, maxDraws: 8, levelType: 'normal' },
    { number: 2, goal: 40, maxDraws: 8, levelType: 'normal' },
    { number: 3, goal: 70, maxDraws: 8, levelType: 'normal' },
    { number: 4, goal: 90, maxDraws: 8, levelType: 'normal' },
    { number: 5, goal: 110, maxDraws: 8, levelType: 'boss1' },
    { number: 6, goal: 130, maxDraws: 8, levelType: 'normal' },
    { number: 7, goal: 150, maxDraws: 8, levelType: 'normal' },
    { number: 8, goal: 190, maxDraws: 8, levelType: 'normal' },
    { number: 9, goal: 210, maxDraws: 8, levelType: 'normal' },
    { number: 10, goal: 250, maxDraws: 8, levelType: 'boss2' },
    { number: 11, goal: 300, maxDraws: 8, levelType: 'normal' },
    { number: 12, goal: 320, maxDraws: 8, levelType: 'normal' },
    { number: 13, goal: 350, maxDraws: 8, levelType: 'normal' },
    { number: 14, goal: 380, maxDraws: 8, levelType: 'normal' },
    { number: 15, goal: 420, maxDraws: 8, levelType: 'bossfinal' },
  ];

  let INITIAL_HAND_SIZE = 5;

  const dispatch = useDispatch();
  const { deck, availableDeck, initialized, score, money, drawsLeft, currentLevelIndex, gameState, relics, currentBoss, current2Base } = useSelector((state) => state.run);
  const { seed } = useSelector((state) => state.run);

  // Use Math.random for gameplay randomness (Gambler's Die, Purple cards)
  // The seed is only used for deck generation

  const [hand, setHand] = useState([]);
  const [chain, setChain] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [popups, setPopups] = useState([]); // Array to handle multiple popups
  const [firstCardPlayedThisLevel, setFirstCardPlayedThisLevel] = useState(false);
  const [chainResetThisLevel, setChainResetThisLevel] = useState(false);
  const currentLevel = LEVELS[currentLevelIndex];

  // Select 3 random relics at the start of the run
  const [starterRelics, setStarterRelics] = useState([]);
  useEffect(() => {
    if (gameState === "relicSelection" && starterRelics.length === 0) {
      // DEV MODE: Force specific relics into selection
      if (DEV_MODE && DEV_RELICS.length > 0) {
        const devRelicsToAdd = DEV_RELICS
          .map(name => ALL_STARTER_RELICS.find(r => r.name === name))
          .filter(r => r !== undefined);
        
        if (devRelicsToAdd.length > 0) {
          // Fill remaining slots with random relics
          const remainingSlots = 3 - devRelicsToAdd.length;
          const availablePool = ALL_STARTER_RELICS.filter(
            r => !DEV_RELICS.includes(r.name)
          );
          
          const randomRelics = [];
          for (let i = 0; i < remainingSlots && availablePool.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availablePool.length);
            randomRelics.push(availablePool[randomIndex]);
            availablePool.splice(randomIndex, 1);
          }
          
          setStarterRelics([...devRelicsToAdd, ...randomRelics]);
          return;
        }
      }
      
      // Normal weighted random selection based on rarity
      const rarityWeights = {
        common: 50,      // 50% chance weight
        uncommon: 30,    // 30% chance weight
        rare: 15,        // 15% chance weight
        epic: 4,         // 4% chance weight
        legendary: 1     // 1% chance weight
      };
      
      const selectWeightedRelics = () => {
        const selected = [];
        const availablePool = [...ALL_STARTER_RELICS];
        
        for (let i = 0; i < 3 && availablePool.length > 0; i++) {
          // Calculate total weight
          const totalWeight = availablePool.reduce((sum, relic) => {
            return sum + (rarityWeights[relic.rarity] || 10);
          }, 0);
          
          // Random selection based on weight
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
            // Remove from pool to avoid duplicates
            const index = availablePool.findIndex(r => r.effect === selectedRelic.effect);
            availablePool.splice(index, 1);
          }
        }
        
        return selected;
      };
      
      setStarterRelics(selectWeightedRelics());
    }
  }, [gameState, starterRelics.length]);

  const handleRelicSelection = (relic) => {
    dispatch(addRelic(relic));
    // if (relic.effect === "startingMoney") {
    //   dispatch(addMoney(3));
    // } else if (relic.effect === "startingMoneySmall") {
    //   dispatch(addMoney(2));
    if(relic.effect === "bonusDraws"){
      dispatch(addDraws(3));
    }else if(relic.effect === "extraDraw"){
      dispatch(addDraws(1));
    }
    // //dispatch(setGameState("playing"));
    handleProceedToNextLevel();
  };

  // Initialize the deck and draw initial hand on mount
  useEffect(() => {
    if(relics.some((r) => r.effect === "drawMoreInitially")){
      INITIAL_HAND_SIZE+=1;
    }
    if (!initialized) {
      dispatch(initializeDeck());
      // let maxMoney = 1 + drawsLeft; // Base reward money + draws left
      // if(relics.some((r) => r.effect === "startingMoney")){
      //   maxMoney += 3;
      // }
      // if(relics.some((r) => r.effect === "startingMoneySmall")){
      //   maxMoney += 2;
      // }
      // dispatch(addMoney(maxMoney)); // Set the player's money
    } else if (hand.length === 0 && availableDeck.length >= INITIAL_HAND_SIZE && chain.length === 0) {
      for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
        const newCard = availableDeck[i];
        setHand((prevHand) => [...prevHand, newCard]);
        dispatch(drawFromAvailableDeck("initialDraw"));
      }
    }
  }, [gameState, initialized, availableDeck, hand.length, dispatch]);

  // Win/Lose checks and Golden Amulet effect
  useEffect(() => {
    if (gameState !== "playing") return;

    if (score >= currentLevel.goal) {
      let moneyBonus = 0;
      if (relics.some((relic) => relic.effect === "extraMoney")) {
        moneyBonus += 5; // Golden Amulet: +$5 per level
      }
      dispatch(addMoney(moneyBonus));
      
      // Alchemist's Touch: Randomly upgrade one card after level completion
      const hasAlchemist = relics.some((r) => r.effect === "upgradeCard");
      if (hasAlchemist && deck.length > 0) {
        const eligibleCards = deck.filter(c => !c.enhancement || c.enhancement === "purple");
        if (eligibleCards.length > 0) {
          const randomCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
          const enhancements = ["plusFive", "wild", "plusMoney"];
          const newEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
          
          const upgradedDeck = deck.map(c => 
            c.id === randomCard.id ? { ...c, enhancement: newEnhancement } : c
          );
          dispatch(modifyDeck(upgradedDeck));
          
          // Show upgrade notification with card details
          const upgradePopup = {
            id: Date.now() + 999,
            score: 0,
            color: randomCard.color.toLowerCase(),
            isUpgrade: true,
            cardValue: randomCard.value,
            cardEnhancement: newEnhancement,
            isMega: randomCard.isMega,
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 },
          };
          setPopups((prevPopups) => [...prevPopups, upgradePopup]);
          setTimeout(() => {
            setPopups((prevPopups) => prevPopups.filter((p) => p.id !== upgradePopup.id));
          }, 2500);
        }
      }
      
      if (currentLevelIndex === LEVELS.length - 1) {
        dispatch(setGameState("win"));
      } else if(LEVELS[currentLevelIndex].levelType.startsWith('boss')){
        //TODO: update this so that we have a special event or screen for beating the boss
        dispatch(setGameState("shop"));
      }else {
        dispatch(setGameState("shop"));
      }
      return;
    }

    // Check if player is truly stuck
    if (drawsLeft <= 0 && !hasPlayableCard(chain, hand)) {
      // Calculate reset cost
      const hasCheapReset = relics.some((r) => r.effect === "cheapReset");
      const hasFreeResets = relics.some((r) => r.effect === "freeResets");
      const resetCost = hasFreeResets ? 0 : (hasCheapReset ? 2 : 4);
      
      // Only game over if they can't afford to reset the chain
      if (money < resetCost || (drawsLeft <= 0 && hand.length === 0) || (money <= 0 && !hasPlayableCard(chain, hand))) {
        dispatch(setGameState("lose"));
      }
    }
  }, [drawsLeft, hand, chain, score, gameState, currentLevel, currentLevelIndex, relics, money, dispatch, deck]);

  // Reset firstCardPlayedThisLevel when level changes
  useEffect(() => {
    setFirstCardPlayedThisLevel(false);
    setChainResetThisLevel(false);
  }, [currentLevelIndex]);

  // Draw a card with Recycler effect
  const drawCardHandler = () => {
    if (money <= 0 || drawsLeft <= 0 || gameState !== "playing") return;

    // Recycler: If deck runs out, shuffle played cards back in
    if (availableDeck.length === 0) {
      const hasRecycler = relics.some((r) => r.effect === "recycleCards");
      if (hasRecycler && chain.length > 0) {
        const recycledCards = [...chain].sort(() => Math.random() - 0.5);
        dispatch(modifyDeck([...deck, ...recycledCards]));
        
        // Show recycler notification
        const recyclePopup = {
          id: Date.now() + 888,
          score: 0,
          color: "green",
          isRecycle: true,
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        };
        setPopups((prevPopups) => [...prevPopups, recyclePopup]);
        setTimeout(() => {
          setPopups((prevPopups) => prevPopups.filter((p) => p.id !== recyclePopup.id));
        }, 2000);
        
        setChain([]);
        return;
      } else {
        return; // No more cards to draw
      }
    }
    

    const newCard = availableDeck[0];
    dispatch(drawFromAvailableDeck());
    
    // Get the latest card data from the deck (in case it has memory data)
    const cardFromDeck = deck.find(c => c.id === newCard.id) || newCard;
    setHand([...hand, cardFromDeck]);
    
    dispatch(addMoney(-1)); // Reduce money by $1

    // Trigger the -$1 popup
    const moneyPopup = {
      id: Date.now(), // Unique ID for the popup
      score: -1, // Negative value for money loss
      color: "red", // Red color for money loss
      position: {
        x: window.innerWidth / 2, // Center the popup horizontally
        y: 100, // Position it near the top of the screen
      },
    };
    setPopups((prevPopups) => [...prevPopups, moneyPopup]);

    // Remove the popup after 1.5 seconds
    setTimeout(() => {
      setPopups((prevPopups) => prevPopups.filter((p) => p.id !== moneyPopup.id));
    }, 1500);
  };

  // Play a card with all relic effects
  const playCard = (card, cardPosition = { x: 0, y: 0 }) => {
    // Check if card is normally playable
    const normallyPlayable = canPlayCard(chain, card);
    
    // Card must be normally playable to be played
    if (!normallyPlayable) {
      return;
    }
    
    if (gameState !== "playing") return;
    
    // Check if player has Chain Starter relic (first card of chain gets double points)
    const hasChainStarter = relics.some((r) => r.effect === "firstCardTriple");
    const isFirstCardInChain = chain.length === 0;
    
    // Use Math.random for card scoring randomness
    const result = calculateCardScore(chain, card, score, Math.random, relics, currentBoss, current2Base);
    let cardScore = result.score;
    const bonusTriggered = result.bonusTriggered;
    
    // Track card memory - increment times played for THIS SPECIFIC CARD by ID
    const newTimesPlayed = (card.timesPlayed || 0) + 1;
    
    // Check if player has Memory Catalyst (quickVeteran) relic
    const hasQuickVeteran = relics.some((r) => r.effect === "quickVeteran");
    const veteranThreshold = hasQuickVeteran ? 3 : 5;
    const becomesVeteran = !card.isVeteran && newTimesPlayed >= veteranThreshold;
    
    // Wildcard Master: After playing normally, 15% chance this card becomes a wildcard in the chain
    const hasWildcardMaster = relics.some((r) => r.effect === "wildcardChance");
    const actAsWildcard = hasWildcardMaster && Math.random() < 0.15;
    
    const updatedCard = {
      ...card,
      timesPlayed: newTimesPlayed,
      isVeteran: newTimesPlayed >= veteranThreshold,
      veteranUpgradeApplied: becomesVeteran,
      actedAsWildcard: actAsWildcard, // Mark if this card will act as wildcard in chain
    };
    
    const updatedDeck = deck.map((c) => {
      if (c.id === card.id) {
        return updatedCard;
      }
      return c;
    });
    
    dispatch(modifyDeck(updatedDeck));
    
    // Update hand with the latest card data from the updated deck
    setHand((prevHand) => 
      prevHand
        .filter((c) => c.id !== card.id)
        .map((handCard) => {
          const updatedCardData = updatedDeck.find((c) => c.id === handCard.id);
          return updatedCardData || handCard;
        })
    );
    
    // Add the updated card to the chain (with the new play count and wildcard flag)
    setChain([...chain, updatedCard]);
    
    // Apply veteran bonus: +2 to score if card is veteran (or double if they have Veteran Commander)
    let finalScore = cardScore;
    const hasVeteranCommander = relics.some((r) => r.effect === "veteranDouble");
    
    if (updatedCard.isVeteran || newTimesPlayed >= veteranThreshold) {
      if (hasVeteranCommander) {
        // Veteran Commander: double the card's points instead of +2
        finalScore = cardScore * 2;
      } else {
        // Normal veteran bonus: +2
        finalScore = cardScore + 2;
      }
    }

    // Momentum Surge: Multiply card score based on remaining deck size
    const hasMomentumSurge = relics.some((r) => r.effect === "deckSizeMultiplier");
    if (hasMomentumSurge) {
      let additive = 0;
      if( availableDeck.length >= 11 ){
        for( let i = 11; i <= availableDeck.length; i++ ){
          additive += 2;
        }
      }
      finalScore = Math.floor(finalScore + additive);
    }
    if(currentBoss.name==="noLongChains"){
        finalScore-=chain.length;
    }
    
    dispatch(addScore(finalScore));

    if(card.value === 2 && relics.some((r) => r.effect === "twoPermanent")){
      dispatch(add2Base());
    }

    if (card.enhancement === "plusMoney") {
      dispatch(addMoney(1));
    }
    
    // Mega cards give +$2 when played
    if (card.isMega) {
      dispatch(addMoney(2));
    }
    
    // Infinite Wealth: Gain $1 for every card played
    const hasInfiniteWealth = relics.some((r) => r.effect === "moneyPerCard");
    if (hasInfiniteWealth) {
      dispatch(addMoney(1));
    }
    
    // First Strike: If the first card played is a 1, gain +2 draws
    const hasFirstStrike = relics.some((r) => r.effect === "firstCardOne");
    if (hasFirstStrike && !firstCardPlayedThisLevel && card.value === 1) {
      dispatch(addDraws(2));
      setFirstCardPlayedThisLevel(true);
    }
    
    // Trigger the score popup
    const popup = {
      id: Date.now(),
      score: finalScore,
      color: card.color.toLowerCase(),
      bonusTriggered: bonusTriggered || (hasChainStarter && isFirstCardInChain) || actAsWildcard,
      isVeteran: updatedCard.isVeteran || newTimesPlayed >= veteranThreshold,
      position: {
        x: cardPosition.x - 50,
        y: cardPosition.y - 100,
      },
    };
    
    setPopups((prevPopups) => [...prevPopups, popup]);
    
    // Remove the popup after 1.5 seconds
    setTimeout(() => {
      setPopups((prevPopups) => prevPopups.filter((p) => p.id !== popup.id));
    }, 1500);

    // Perfect Hand: Check if all 5 initially drawn cards are played without drawing or resetting
    const hasPerfectHand = relics.some((r) => r.effect === "perfectHandBonus");
    if (hasPerfectHand && hand.length === 1 && chain.length === INITIAL_HAND_SIZE - 1 && drawsLeft === currentLevel.maxDraws && !chainResetThisLevel) {
      dispatch(addScore(25));
      
      // Show perfect hand bonus popup
      const perfectHandPopup = {
        id: Date.now() + 3,
        score: 25,
        color: "gold",
        bonusTriggered: true,
        position: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 - 80,
        },
      };
      setPopups((prevPopups) => [...prevPopups, perfectHandPopup]);
      
      setTimeout(() => {
        setPopups((prevPopups) => prevPopups.filter((p) => p.id !== perfectHandPopup.id));
      }, 2500);
    }
  };

  const resetChain = () => {
    // Check if player has Cheap Shuffle relic
    const hasCheapReset = relics.some((r) => r.effect === "cheapReset");
    const hasFreeResets = relics.some((r) => r.effect === "freeResets");
    const resetCost = hasFreeResets ? 0 : (hasCheapReset ? 2 : 4);

    if (money < resetCost || chain.length === 0 || gameState !== "playing") return;

    // Check if player has Rainbow Bridge relic and all 4 main colors in chain
    const hasRainbowBonus = relics.some((r) => r.effect === "rainbowBonus");
    if (hasRainbowBonus && chain.length >= 4) {
      const colors = new Set(chain.map(c => c.color.toLowerCase()));
      const mainColors = ['red', 'blue', 'green', 'yellow'];
      const hasAllMainColors = mainColors.every(color => colors.has(color));
      
      if (hasAllMainColors) {
        dispatch(addScore(40));
        
        // Show rainbow bonus popup
        const rainbowPopup = {
          id: Date.now() + 1,
          score: 40,
          color: "rainbow",
          bonusTriggered: true,
          position: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          },
        };
        setPopups((prevPopups) => [...prevPopups, rainbowPopup]);
        
        setTimeout(() => {
          setPopups((prevPopups) => prevPopups.filter((p) => p.id !== rainbowPopup.id));
        }, 2000);
      }
    }

    // Check if player has Chromatic Fusion relic and chain has 4+ same color
    const hasColorFusion = relics.some((r) => r.effect === "colorFusion");
    if (hasColorFusion && chain.length >= 4) {
      // Count colors in chain
      const colorCounts = {};
      chain.forEach(card => {
        const color = card.color.toLowerCase();
        if (color !== 'purple') { // Purple doesn't create mega cards
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      });
      
      // Find color with 4+ cards
      const fusionColor = Object.keys(colorCounts).find(color => colorCounts[color] >= 4);
      
      if (fusionColor) {
        // Create a mega card (high value card with special enhancement)
        const maxId = Math.max(...deck.map(c => c.id), 0);
        const megaCard = {
          id: maxId + 1,
          color: fusionColor,
          value: 6,
          enhancement: "plusFive",
          isMega: true,
          timesPlayed: 0,
          isVeteran: false,
        };
        
        dispatch(modifyDeck([...deck, megaCard]));
        
        // Show fusion notification
        const fusionPopup = {
          id: Date.now() + 2,
          score: 0,
          color: fusionColor,
          isFusion: true,
          position: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 - 60,
          },
        };
        setPopups((prevPopups) => [...prevPopups, fusionPopup]);
        
        setTimeout(() => {
          setPopups((prevPopups) => prevPopups.filter((p) => p.id !== fusionPopup.id));
        }, 2500);
      }
    }

    if (resetCost > 0) {
      // Trigger the money loss popup
      const moneyPopup = {
        id: Date.now(),
        score: -resetCost,
        color: "red",
        position: {
          x: window.innerWidth / 2,
          y: 100,
        },
      };
      setPopups((prevPopups) => [...prevPopups, moneyPopup]);
  
      // Remove the popup after 1.5 seconds
      setTimeout(() => {
        setPopups((prevPopups) => prevPopups.filter((p) => p.id !== moneyPopup.id));
      }, 1500);
      dispatch(addMoney(-resetCost));
    }
    setChain([]);
    setChainResetThisLevel(true);
  };

  // Restart the entire run
  const restartRun = () => {
    dispatch(resetRun());
    dispatch(initializeDeck());
    setHand([]);
    setChain([]);
    dispatch(resetScore());
  };

  // Proceed to the next level with extra draws from relics
  const handleProceedToNextLevel = () => {
    setHand([]);
    setChain([]);
    
    // Card Duplicator: Duplicate a random card when entering shop
    const hasCardDuplicator = relics.some((r) => r.effect === "duplicateRandom");
    if (hasCardDuplicator && deck.length > 0) {
      const randomCard = deck[Math.floor(Math.random() * deck.length)];
      const maxId = Math.max(...deck.map(c => c.id), 0);
      const duplicatedCard = { ...randomCard, id: maxId + 1, timesPlayed: 0 };
      dispatch(modifyDeck([...deck, duplicatedCard]));
      
      // Show duplicate notification with card info
      const duplicatePopup = {
        id: Date.now() + 777,
        score: 0,
        color: randomCard.color.toLowerCase(),
        isDuplicate: true,
        cardValue: randomCard.value,
        cardEnhancement: randomCard.enhancement,
        isMega: randomCard.isMega,
        isVeteran: randomCard.isVeteran,
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 50 },
      };
      setPopups((prevPopups) => [...prevPopups, duplicatePopup]);
      setTimeout(() => {
        setPopups((prevPopups) => prevPopups.filter((p) => p.id !== duplicatePopup.id));
      }, 2500);
    }
    
    const extraDraws = relics.filter((relic) => relic.effect === "extraDraw").length;
    const bonusDraws = relics.some((r) => r.effect === "bonusDraws") ? 3 : 0;
    const totalDraws = LEVELS[currentLevelIndex + 1].maxDraws + extraDraws + bonusDraws;
    dispatch(proceedToNextLevel(totalDraws));
  };

  return (
    <div className="run-container">
      {/* Relic Selection Screen */}
      {gameState === "relicSelection" && (
        <div className="overlay">
          <h2 className="result">Choose Your Starting Relic</h2>
          <p>Select one relic to help you on your journey:</p>
          <div className="relic-selection">
            {starterRelics.map((relic, index) => (
              <div key={index} className="relic-option">
                <div className="relic-icon">{relic.icon}</div>
                <h3>{relic.name}</h3>
                <p>{relic.description}</p>
                <button 
                  className="btn draw" 
                  onClick={() => handleRelicSelection(relic)}
                >
                  Choose
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState !== "relicSelection" && (
        <>

          <p className="deck-count">
            Deck: {availableDeck.length} cards left
          </p>
          <p className="draws-left">Draws left: {drawsLeft}</p>
          {/* Info button and modal */}
          <button className="info-button" onClick={() => setInfoOpen(true)}>
            Info / Rules
          </button>
          <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />

          {/* Score Popups */}
          {popups.map((popup) => (
            <ScorePopup 
              key={popup.id} 
              score={popup.score} 
              position={popup.position} 
              col={popup.color}
              bonusTriggered={popup.bonusTriggered}
              isVeteran={popup.isVeteran}
              isFusion={popup.isFusion}
              isUpgrade={popup.isUpgrade}
              isRecycle={popup.isRecycle}
              isDuplicate={popup.isDuplicate}
              cardValue={popup.cardValue}
            />
          ))}

          {/* Screens */}
          {gameState === "playing" && (
            <LevelScreen
              hand={hand}
              chain={chain}
              drawsLeft={drawsLeft}
              score={score}
              level={currentLevel.number}
              goalScore={currentLevel.goal}
              money={money}
              onDraw={drawCardHandler}
              onPlayCard={(card, position) => playCard(card, position)}
              onResetChain={resetChain}
              relics={relics}
              availableDeck={availableDeck}
              LEVELS={LEVELS}
            />
          )}

          {gameState === "shop" && (
            <ShopScreen
              levelNumber={currentLevel.number}
              money={money}
              onProceed={handleProceedToNextLevel}
              allRelics={ALL_STARTER_RELICS}
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
        </>
      )}
    </div>
  );
}