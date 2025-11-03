const COLORS = ["red", "blue", "green", "yellow", "purple"];
const VALUES = [1, 2, 3, 4, 5, 6];
const ENHANCEMENTS = ["plusFive", "wild", "plusMoney", "purple"];

export function generateDeck(size = 15, rng = Math.random) {
  const suits = ["red", "green", "blue", "yellow"];
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
  const suits = ["red", "green", "blue", "yellow"];
  const enhancements = [null, "plusFive", "wild", "plusMoney"];
  const options = [];
  const maxId = deck.length ? Math.max(...deck.map(c => c.id)) : 0;
  const values = packType === "eco" ? [1, 2, 3] : [4, 5, 6];

  for (let i = 0; i < 5; i++) {
    // 10% chance for purple card (reduced from 20%)
    const isPurple = rng() < 0.1;
    const color = isPurple ? "purple" : suits[Math.floor(rng() * suits.length)];
    const value = values[Math.floor(rng() * values.length)];
    const enhancementRoll = rng();
    const enhancement = enhancementRoll < 0.9 
      ? enhancements[Math.floor(rng() * enhancements.length)] 
      : null;
    
    const card = { id: maxId + i + 1, color, value, enhancement };
    
    // Purple cards always have the purple enhancement
    if (color === "purple") {
      card.enhancement = "purple";
    }
    
    options.push(card);
  }

  return options;
}

export function calculateCardScore(chain, card, currentScore, rng = Math.random, hasLuckyBonus = false) {
  let base = card.value;
  let multiplier = 1;

  // Apply chain bonuses
  if (chain.length > 0) {
    const prev = chain[chain.length - 1];

    if (card.value === prev.value) {
      base *= 2; // Same value: 2x multiplier
    } else if (card.color === prev.color) {
      base *= 1.5; // Same color: 1.5x multiplier
    }
  }

  let score = Math.round(base * multiplier);

  // Apply card enhancements
  if (card.enhancement === "plusFive") {
    score += 5;
  } else if (card.enhancement === "purple") {
    // Purple cards multiply current score by 0.8x to 2.0x
    const purpleMultiplier = 0.8 + rng() * 1.2; // Range: 0.8 to 2.0
    score += Math.round(currentScore * (purpleMultiplier - 1));
  }

  // Gambler's Die relic: 20% chance to double card points
  let bonusTriggered = false;
  let chanceToProc = rng();
  if (hasLuckyBonus && chanceToProc < 0.2) {
    score *= 2;
    bonusTriggered = true;
  }

  return { score, bonusTriggered };
}

export function canPlayCard(chain, card, isTempWildcard = false) {
  if (chain.length === 0) {
    return true; // Any card can start the chain
  }

  const lastCard = chain[chain.length - 1];

  // Wildcards can be played on any card (including temporary wildcards)
  if (card.enhancement === "wild" || isTempWildcard) {
    return true;
  }

  // Any card can be played on top of a wildcard or a card that acted as wildcard
  if (lastCard.enhancement === "wild" || lastCard.tempWild || lastCard.actedAsWildcard) {
    return true;
  }

  // Standard rules: match color or value
  return card.color === lastCard.color || card.value === lastCard.value;
}

export function hasPlayableCard(chain, hand, wildcardMasterActive = false) {
  if (hand.length === 0) return false;
  if (chain.length === 0) return true;
  
  // If Wildcard Master is active, check with possibility of temp wildcards
  if (wildcardMasterActive) {
    return hand.some((card) => 
      canPlayCard(chain, card) || canPlayCard(chain, card, true)
    );
  }
  
  return hand.some((card) => canPlayCard(chain, card));
}