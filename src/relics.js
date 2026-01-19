import Tooltip from "../src/components/Tooltip";
import thriceMoreIcon from "../src/images/ThriceMore.jpg";
export const ALL_STARTER_RELICS = [
    // COMMON RELICS (Basic helpful effects)
    { 
      name: "Merchant's Coin", 
      effect: "startingMoney", 
      descriptionText: "Start each level with +$3",
      description: <>Start each level with +$3</>,
      icon: "💰",
      cost: 4,
      rarity: "common"
    },
    { 
      name: "Lucky Charm", 
      effect: "extraDraw", 
      descriptionText: "Start each level with +1 draw",
      description: <>Start each level with +1 <Tooltip text="The number of times you can draw cards from your deck">draw</Tooltip></>,
      icon: "🍀",
      cost: 3,
      rarity: "common"
    },
    { 
      name: "Cheap Shuffle", 
      effect: "cheapReset", 
      descriptionText: "Reset chain costs $2 instead of $4",
      description: <>Reset <Tooltip text="A sequence of cards played in a row that match by color or value">chain</Tooltip> costs $2 instead of $4</>,
      icon: "🔄",
      cost: 3,
      rarity: "common"
    },
    { 
      name: "Base Value ++", 
      effect: "baseValueIncrease", 
      descriptionText: "The base value of each card is +2",
      description: <>Whenever you play a card the base value is increased by 2</>,
      icon: "+",
      cost: 3,
      rarity: "common"
    },

    // UNCOMMON RELICS (Moderate strategic effects)
    { 
      name: "Card Sage's Tome", 
      effect: "cardVision", 
      descriptionText: "See the top 3 cards of your deck at all times",
      description: <>See the top 3 cards of your <Tooltip text="The pile of cards you draw from">deck</Tooltip> at all times</>,
      icon: "📖",
      cost: 5,
      rarity: "uncommon"
    },
    { 
        name: "Everybody's equal", 
        effect: "baseSix", 
        descriptionText: "The base value of every card is 6",
        description: <>The base value of every card is 6</>,
        icon: "🟰",
        cost: 4,
        rarity: "uncommon"
      },
    { 
      name: "Gambler's Die", 
      effect: "luckyBonus", 
      descriptionText: "15% chance to double points from each card",
      description: <>15% chance to double points from each card</>,
      icon: "🎲",
      cost: 4,
      rarity: "uncommon"
    },
    { 
      name: "Memory Catalyst", 
      effect: "quickVeteran", 
      descriptionText: "Cards become veteran after 3 plays instead of 5",
      description: <>Cards become <Tooltip text="Veteran cards give +2 bonus points (or double with Veteran Commander)">veteran</Tooltip> after 3 plays instead of 5</>,
      icon: "🧪",
      cost: 5,
      rarity: "uncommon"
    },
    { 
      name: "Golden Amulet", 
      effect: "extraMoney", 
      descriptionText: "Gain +$5 when completing each level",
      description: <>Gain +$5 when completing each level</>,
      icon: "🏆",
      cost: 5,
      rarity: "uncommon"
    },
    { 
      name: "Value Multiplier", 
      effect: "highValueBonus", 
      descriptionText: "Cards with value 4+ give +2 extra points",
      description: <>Cards with value 4+ give +2 extra points</>,
      icon: "📈",
      cost: 6,
      rarity: "uncommon"
    },
    { 
        name: "Initial Draw", 
        effect: "drawMoreInitially", 
        descriptionText: "Start the round with 2 extra cards in your hand",
        description: <>Start the round with 2 extra cards in your hand</>,
        icon: "🙌",
        cost: 6,
        rarity: "uncommon"
      },
    { 
      name: "Momentum Builder", 
      effect: "chainScaling", 
      descriptionText: "Each card after the 3rd in a chain gives +1 extra point",
      description: <>Each card after the 3rd in a <Tooltip text="A sequence of cards played in a row that match by color or value">chain</Tooltip> gives +1 extra point</>,
      icon: "📊",
      cost: 5,
      rarity: "uncommon"
    },
    { 
      name: "Momentum Surge", 
      effect: "deckSizeMultiplier", 
      descriptionText: "Cards get a score addition based on remaining deck size (11+ cards +2, 12+ cards +4, 12+ cards +6)",
      description: <>Cards get a score addition based on remaining <Tooltip text="The pile of cards you draw from">deck</Tooltip> size (11+ cards = +2, 12+ = +4, etc.)</>,
      icon: "⚡",
      cost: 6,
      rarity: "uncommon"
    },
    { 
      name: "First Strike", 
      effect: "firstCardOne", 
      descriptionText: "If the first card you play each level is a 1, gain +2 draws for that level",
      description: <>If the first card you play each level is a 1, gain +2 <Tooltip text="The number of times you can draw cards from your deck">draws</Tooltip> for that level</>,
      icon: "⚔️",
      cost: 6,
      rarity: "uncommon"
    },
    { 
      name: "Two For You", 
      effect: "twoPermanent", 
      descriptionText: "Every time you play a 2 all 2s in your deck gain +2 base value",
      description: <>Every time you play a 2 all 2s in your deck gain +2 base value</>,
      icon: "2",
      cost: 6,
      rarity: "uncommon"
    },
    { 
      name: "Thrice More", 
      effect: "threeThree", 
      descriptionText: "Playing 3 3s in a row gives +33",
      description: <>Playing 3 3s in a row gives +33 points</>,
      icon: "333",
      cost: 6,
      rarity: "uncommon"
    },
    // RARE RELICS (Powerful strategic effects)
    { 
      name: "Chain Starter", 
      effect: "firstCardTriple", 
      descriptionText: "The first card of each chain scores double points",
      description: <>The first card of each <Tooltip text="A sequence of cards played in a row that match by color or value">chain</Tooltip> scores triple points</>,
      icon: "⛓️",
      cost: 6,
      rarity: "rare"
    },
    { 
      name: "One Maxer", 
      effect: "oneMultiplier", 
      descriptionText: "+1x for every 1 played in a row.",
      description: <>Every 1 played in a row will increase the multiplier by 1 I.E. 1-1-1 will have a multiply the score of the 3rd 1 by 3</>,
      icon: "1x",
      cost: 6,
      rarity: "rare"
    },
    // { 
    //   name: "Sequence Dawg", 
    //   effect: "increasingSequence", 
    //   descriptionText: "If cards are played in sequential order I.E. 1-2-3-4-5-6 +100 points when the 6 is played",
    //   description: <>If cards are played in sequential order I.E. 1-2-3-4-5-6 +100 points when the 6 is played</>,
    //   icon: "1->2",
    //   cost: 6,
    //   rarity: "rare"
    // },
    { 
      name: "Rainbow Bridge", 
      effect: "rainbowBonus", 
      descriptionText: "Playing all 4 main colors in one chain gives +40 points when the chain is reset",
      description: <>Playing all 4 main colors in one <Tooltip text="A sequence of cards played in a row that match by color or value">chain</Tooltip> gives +40 points when the chain is reset</>,
      icon: "🌈",
      cost: 7,
      rarity: "rare"
    },
    { 
      name: "Chromatic Fusion", 
      effect: "colorFusion", 
      descriptionText: "Chains of 4+ same color cards create a mega card when the chain is reset",
      description: <><Tooltip text="A sequence of cards played in a row that match by color or value">Chains</Tooltip> of 4+ same color cards create a <Tooltip text="A powerful card (value 6 with +5 bonus) that gives +$2 when played">mega card</Tooltip> when the chain is reset</>,
      icon: "🎨",
      cost: 8,
      rarity: "rare"
    },
    { 
      name: "Alchemist's Touch", 
      effect: "upgradeCard", 
      descriptionText: "After every level, randomly upgrade one card in your deck",
      description: <>After every level, randomly upgrade one card in your <Tooltip text="The pile of cards you draw from">deck</Tooltip></>,
      icon: "⚗️",
      cost: 7,
      rarity: "rare"
    },
    { 
      name: "Card Duplicator", 
      effect: "duplicateRandom", 
      descriptionText: "When exiting the shop, duplicate a random card from your deck",
      description: <>When exiting the shop, duplicate a random card from your <Tooltip text="The pile of cards you draw from">deck</Tooltip></>,
      icon: "🔮",
      cost: 7,
      rarity: "rare"
    },
    { 
      name: "Perfect Hand", 
      effect: "perfectHandBonus", 
      descriptionText: "Play all 5 initially drawn cards without drawing or resetting to gain +25 points",
      description: <>Play all 5 initially drawn cards without drawing or resetting to gain +25 points</>,
      icon: "🎯",
      cost: 8,
      rarity: "rare"
    },

    // EPIC RELICS (Very powerful game-changing effects)
    { 
      name: "Veteran Commander", 
      effect: "veteranDouble", 
      descriptionText: "Veteran cards score double points",
      description: <><Tooltip text="Cards that have been played 5 times (or 3 with Memory Catalyst)">Veteran</Tooltip> cards score double points</>,
      icon: "👑",
      cost: 10,
      rarity: "epic"
    },
    { 
      name: "Wildcard Master", 
      effect: "wildcardChance", 
      descriptionText: "Every card has a 15% chance to act as a wildcard",
      description: <>Every card has a 15% chance to act as a <Tooltip text="Can be played on any card and any card can follow it">wildcard</Tooltip></>,
      icon: "🃏",
      cost: 9,
      rarity: "epic"
    },
    { 
      name: "Combo King", 
      effect: "comboBonus", 
      descriptionText: "Chains of 5+ cards give +2 points per card in the chain",
      description: <><Tooltip text="A sequence of cards played in a row that match by color or value">Chains</Tooltip> of 5+ cards give +2 points per card in the chain</>,
      icon: "💥",
      cost: 9,
      rarity: "epic"
    },
    { 
      name: "Recycler", 
      effect: "recycleCards", 
      descriptionText: "When your deck runs out, shuffle all played cards back in",
      description: <>When your <Tooltip text="The pile of cards you draw from">deck</Tooltip> runs out, shuffle all played cards back in</>,
      icon: "♻️",
      cost: 8,
      rarity: "epic"
    },

    // LEGENDARY RELICS (Extremely powerful, run-defining effects)
    { 
      name: "Infinite Wealth", 
      effect: "moneyPerCard", 
      descriptionText: "Gain $1 for every card played",
      description: <>Gain $1 for every card played</>,
      icon: "💎",
      cost: 12,
      rarity: "legendary"
    },
    { 
      name: "Master Strategist", 
      effect: "freeResets", 
      descriptionText: "Resetting chains is completely free",
      description: <>Resetting <Tooltip text="A sequence of cards played in a row that match by color or value">chains</Tooltip> is completely free</>,
      icon: "🧠",
      cost: 10,
      rarity: "legendary"
    },
    { 
      name: "Mystic Hourglass", 
      effect: "bonusDraws", 
      descriptionText: "Start each level with +3 draws",
      description: <>Start each level with +3 <Tooltip text="The number of times you can draw cards from your deck">draws</Tooltip></>,
      icon: "⏳",
      cost: 11,
      rarity: "legendary"
    },
    { 
      name: "Perfect Harmony", 
      effect: "colorBonus", 
      descriptionText: "Playing cards that alternate colors gives +20 points per card",
      description: <>Playing cards that alternate colors gives +20 points per card</>,
      icon: "☯️",
      cost: 11,
      rarity: "legendary"
    },
  ];