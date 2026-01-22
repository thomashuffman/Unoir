

export function generateDeck(size = 15, rng = Math.random) {
  const suits = ["red", "green", "blue", "yellow"];
  const values = [1,2,3,4,5,6];
  const deck = [];

  for (let i = 0; i < size; i++) {
    const color = suits[Math.floor(rng() * suits.length)];
    const value = values[Math.floor(rng() * values.length)];
    deck.push({ id: i, color, value });
  }

  return deck.sort(() => rng() - 0.5);
}

export function pickBossEffect(pastBosses, rng = Math.random){
  const BOSSEFFECTS = [
    {name: 'chainExpensive', description: 'The cost of resetting the chain is equal to your total money'},
    {name: 'baseIs3', description: 'The base value of every played card is 3 regardless of the number on the card'},
    {name: 'noLongChains', description: 'Each card in the chain is -1 from the total score'},
    {name: '', description: ''}

  ]
  // const possibleBosses = BOSSEFFECTS.filter(
  //   (relic) => !pastBosses.some((r) => r.effect === relic.effect)
  // );

  const possibleBosses = BOSSEFFECTS.filter(
    (boss) => !pastBosses.some((r) => r.name === boss.name)
  );
  //let possibleBosses = BOSSEFFECTS.some()
  let chosenBoss=possibleBosses[Math.floor(rng()*possibleBosses.length)];

  return chosenBoss;
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

export function calculateCardScore(chain, card, currentScore, rng = Math.random, relics, currentBoss, base2Value, fullDeck) {
  
  let base = card.value;
  if(currentBoss.name === "baseIs3"){
    base = 3;
  }


  const hasBaseValueSix = relics.some(r => r.effect === "baseSix");
  const hasBaseIncrease = relics.some(r => r.effect === "baseValueIncrease");
  const hasLuckyBonus = relics.some((r) => r.effect === "luckyBonus");
  const hasOneMaxer = relics.some((r) => r.effect === "oneMultiplier");
  const hasChainStarter = relics.some((r) => r.effect === "firstCardTriple");
  const hasPerfectHarmony = relics.some((r) => r.effect === "colorBonus");
  const hasMomentumBuilder = relics.some((r) => r.effect === "chainScaling");
  const hasValueMultiplier = relics.some((r) => r.effect === "highValueBonus");
  const hasComboKing = relics.some((r) => r.effect === "comboBonus");
  const hasIncreasingSequence = relics.some((r) => r.effect === "increasingSequence");
  const hasThriceMore = relics.some((r) => r.effect === "threeThree");
  const hasMaxOnes = relics.some((r) => r.effect === "maxOnes");
  //Needs to be first so that we can add increases etc. after
  if(hasBaseValueSix && currentBoss.name !== "baseIs3"){
    base = 6;
  }

  if(hasMaxOnes){
    const countOfOnes = fullDeck.filter(card => card.value === 1).length;
    base+=countOfOnes;
  }

  if(card.value === 2){
    base+=base2Value;
  }

   if (hasValueMultiplier && card.value >= 4) {
     base += 2;
   }
      
  if (hasPerfectHarmony && chain.length > 0) {
      const prevCard = chain[chain.length - 1];
      if (card.color !== prevCard.color && card.color !== "purple" && prevCard.color !== "purple") {
        base += 20;
    }
  }

  if(hasBaseIncrease){
    base+=2;
  }

  if(hasChainStarter && chain.length<=1){
    base*=3;
  }

  // Apply chain bonuses
  if (chain.length > 0) {
    const prev = chain[chain.length - 1];

    if (card.value === prev.value) {
      base *= 2; // Same value: 2x multiplier
    } else if (card.color === prev.color) {
      base *= 1.5; // Same color: 1.5x multiplier
    }
  }

  let score = base;

  if (hasMomentumBuilder && chain.length >= 3) {
    score += chain.length-2;
  }
  if (hasComboKing && chain.length >= 4) {
    score += 2 * (chain.length + 1);
  }
  // Apply card enhancements
  if (card.enhancement === "plusFive") {
    score += 5;
  } else if (card.enhancement === "purple") {
    // Purple cards multiply current score by 0.8x to 2.0x
    const purpleMultiplier = 0.8 + rng() * 1.2; // Range: 0.8 to 2.0
    score += Math.round(currentScore * (purpleMultiplier - 1));
  }

  // Gambler's Die relic: 15% chance to double card points
  let bonusTriggered = false;
  let chanceToProc = rng();
  if (hasLuckyBonus && chanceToProc < 0.15) {
    score *= 2;
    bonusTriggered = true;
  }

  if(hasThriceMore){
    let threeCount=1;
    let chainIndex = chain.length-1;
    while (chainIndex >=0){
      if(chain[chainIndex].value !== 3){
        break;
      }
      if(chain[chainIndex].value === 3){
        threeCount+=1;
      }
      chainIndex-=1;
    }
    if(threeCount>=3){
      score +=33;
    }
  }

  let finalMultiplier = 1;
  
  if(hasIncreasingSequence && card.value===6){
    let chainIndex = chain.length-1;
    let correctDecrease = 5
    while (chainIndex >=0){
      if(chain[chainIndex].value !== correctDecrease){
        break;
      }
      if(correctDecrease === 1){
        score+=100;
        break;
      }
      correctDecrease-=1;
      chainIndex-=1;
    }
  }
  
  if(hasOneMaxer && card.value===1){
    let chainIndex = chain.length - 1;
    while (chainIndex >=0){
      if(chain[chainIndex].value === 1){
        finalMultiplier+=1;
      }else{
        break;
      }
      chainIndex-=1;
    }
  }
  score = Math.round(score * (finalMultiplier));

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