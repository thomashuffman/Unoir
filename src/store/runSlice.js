import { createSlice } from "@reduxjs/toolkit";
import seedrandom from "seedrandom";
import { generateDeck } from "../game/gameLogic";

const initialState = {
  deck: [],
  availableDeck: [],
  seed: null,
  score: 0,
  money: 0,
  initialized: false,
  relics: [], // Re-added relics to state
  drawsLeft: 8,
  currentLevelIndex: 0,
  gameState: "relicSelection", // Start with relic selection
};

const runSlice = createSlice({
  name: "run",
  initialState,
  reducers: {
    initializeDeck: (state, action) => {
      if (!state.initialized) {
        const seed = action.payload || Date.now().toString();
        const rng = seedrandom(seed);
        state.deck = generateDeck(15, rng);
        state.availableDeck = [...state.deck].sort(() => rng() - 0.5);
        state.seed = seed;
        state.score = 0;
        state.money = 0;
        state.relics = [];
        state.initialized = true;
        state.drawsLeft = 8;
        state.currentLevelIndex = 0;
        state.gameState = "relicSelection"; // Start with relic selection
      }
    },
    shuffleDeck: (state, action) => {
      state.availableDeck = [...state.deck].sort(() => Math.random() - 0.5);
      state.drawsLeft = action.payload || 8;
    },
    modifyDeck: (state, action) => {
      state.deck = action.payload;
      // Don't reshuffle availableDeck - just update the card data to preserve order
      state.availableDeck = state.availableDeck.map(availCard => {
        const updatedCard = action.payload.find(c => c.id === availCard.id);
        return updatedCard || availCard;
      });
    },
    drawFromAvailableDeck: (state, action) => {
      if (state.drawsLeft > 0 && state.availableDeck.length > 0) {
        state.availableDeck = state.availableDeck.slice(1);
        if (action.payload !== "initialDraw") {
          state.drawsLeft -= 1;
        }
      }
    },
    addScore: (state, action) => {
      state.score += action.payload;
    },
    resetScore: (state) => {
      state.score = 0;
      state.relics = [];
    },
    addMoney: (state, action) => {
      state.money += action.payload;
    },
    spendMoney: (state, action) => {
      state.money = Math.max(0, state.money - action.payload);
      console.log(`Spent $${action.payload}. Remaining money: $${state.money}`);
    },
    addRelic: (state, action) => {
      state.relics = [...state.relics, action.payload];
      if (action.payload.effect === "extraDraw") {
       state.drawsLeft += 1;
      }
    },
    addDraws: (state, action) => {
      state.drawsLeft += action.payload;
    },
    resetRun: (state) => {
      state.deck = [];
      state.availableDeck = [];
      state.seed = null;
      state.score = 0;
      state.money = 0;
      state.relics = [];
      state.initialized = false;
      state.drawsLeft = 8;
      state.currentLevelIndex = 0;
      state.gameState = "relicSelection"; // Start with relic selection on reset
    },
    setGameState: (state, action) => {
      state.gameState = action.payload;
    },
    proceedToNextLevel: (state, action) => {
      state.score = 0;
      if(state.relics.some((r) => r.effect === "startingMoney")){
        state.money += 6 + action.payload; // Base reward money + draws left
      }else{
        state.money += 3 + action.payload; // Base reward money + draws left
      }
      state.currentLevelIndex += 1;
      state.gameState = "playing"; // Ensure shop pops up after each level
      state.drawsLeft = action.payload || 8;
      state.availableDeck = [...state.deck].sort(() => Math.random() - 0.5);
    },
  },
});

export const {
  initializeDeck,
  shuffleDeck,
  modifyDeck,
  drawFromAvailableDeck,
  addScore,
  resetScore,
  addMoney,
  spendMoney,
  addRelic,
  addDraws,
  resetRun,
  setGameState,
  proceedToNextLevel,
} = runSlice.actions;

export default runSlice.reducer;