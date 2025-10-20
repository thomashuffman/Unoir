const COLORS = ["red", "blue", "green", "yellow", "purple"];
const VALUES = [1, 2, 3, 4, 5, 6];
const ENHANCEMENTS = ["plusFive", "wild", "plusMoney", "purple"];

export function generateDeck(size = 20, rng = Math.random) {
  const suits = ["red", "green", "blue", "yellow"]; // No purple in initial deck
  const values = [1, 2, 3, 4, 5, 6];
  const deck = [];

  for (let i = 0; i < size; i++) {
    const color = suits[Math.floor(rng() * suits.length)];
    const value = values[Math.floor(rng() * values.length)];
    deck.push({ id: i, color, value });
  }

  return deck.sort(() => rng() - 0.5);
}

export function generatePackOptions(packType, deck, rng = Math.random) {
  const suits = ["red", "green", "blue", "yellow", "purple"];
  const enhancements = [null, "plusFive", "wild", "plusMoney"];
  const options = [];
  const maxId = deck.length ? Math.max(...deck.map(c => c.id)) : 0;

  const values = packType === "eco" ? [1, 2, 3] : [4, 5, 6];

  for (let i = 0; i < 3; i++) {
    const color = suits[Math.floor(rng() * suits.length)];
    const value = values[Math.floor(rng() * values.length)];
    const enhancementRoll = rng();
    const enhancement = enhancementRoll < 0.75 ? enhancements[Math.floor(rng() * enhancements.length)] : null;
    const card = { id: maxId + i + 1, color, value, enhancement };
    if (color === "purple") card.enhancement = "purple";
    options.push(card);
  }

  return options;
}

export function calculateCardScore(chain, card, currentScore) {
  let base = card.value;
  let multiplier = 1;

  if (chain.length > 0) {
    const prev = chain[chain.length - 1];

    if (card.value === prev.value) {

        base *= 2

    }else if (card.color === prev.color) {

        base *= 1.5

    }
  }

  let score = Math.round(base * multiplier);

  if (card.enhancement === "plusFive") {
    score += 5;
  } else if (card.enhancement === "purple") {
    const purpleMultiplier = 0.8 + Math.random() * 1.2; // 0.8 to 2.0
    score += Math.round(currentScore * (purpleMultiplier - 1)); // Apply to current score
  }

  return score;
}

export function canPlayCard(chain, card) {
  if (chain.length === 0) return true;
  if (card.enhancement === "wild") return true;
  const last = chain[chain.length - 1];
  return card.color === last.color || card.value === last.value;
}

export function hasPlayableCard(chain, hand) {
  if (hand.length === 0) return false;
  if (chain.length === 0) return true;
  const last = chain[chain.length - 1];
  return hand.some(
    (card) => card.enhancement === "wild" || card.color === last.color || card.value === last.value
  );
}