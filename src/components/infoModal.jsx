import React from "react";
import "../App.css";

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>How to Play UNOIR</h2>
        
        <h3>🎯 Goal</h3>
        <ul>
          <li>Reach the score goal before running out of money and draws</li>
          <li>Complete all 7 levels to win the run</li>
        </ul>

        <h3>💰 Resources</h3>
        <ul>
          <li><strong>Money:</strong> Drawing cards costs $1 each. You also need money to reset chains ($4, or $2 with Cheap Shuffle relic)</li>
          <li><strong>Draws:</strong> Limited number of draws per level (starts at 8)</li>
          <li>If you run out of both money and playable cards → Game Over</li>
        </ul>

        <h3>🎴 Playing Cards</h3>
        <ul>
          <li>You can play a card if it matches the <strong>color</strong> or <strong>number</strong> of the last card in the chain</li>
          <li>Any card can start a new chain</li>
          <li><strong>Wildcard</strong> cards (🃏) can be played on anything, and any card can follow them</li>
        </ul>

        <h3>📊 Scoring</h3>
        <ul>
          <li><strong>Base score:</strong> Card value (1-6)</li>
          <li><strong>Number match:</strong> 2x multiplier (e.g., 6 on 6 = 12 points)</li>
          <li><strong>Color match:</strong> 1.5x multiplier (e.g., blue 3 on blue 4 = 5 points)</li>
          <li><strong>Veteran cards:</strong> Cards played 5+ times get +2 bonus (or double with Veteran Commander relic)</li>
        </ul>

        <h3>✨ Card Enhancements</h3>
        <ul>
          <li><strong>+5 Bonus:</strong> Adds 5 extra points</li>
          <li><strong>Wildcard (🃏):</strong> Can be played on any card</li>
          <li><strong>+$ Bonus:</strong> Gain $1 when played</li>
          <li><strong>Purple cards:</strong> Multiply your current score by 0.8x to 2.0x (risky!)</li>
          <li><strong>Mega cards:</strong> Give +$2 when played (created by Chromatic Fusion relic)</li>
        </ul>

        <h3>🔄 Chain System</h3>
        <ul>
          <li>Cards must match the previous card by color or value</li>
          <li>Reset chain for $4 to start fresh (costs $2 with Cheap Shuffle, or free with Master Strategist)</li>
          <li>Some relics reward long chains with bonus points</li>
        </ul>

        <h3>🏪 Shop & Progression</h3>
        <ul>
          <li>After each level, visit the shop to buy card packs, relics, or remove cards</li>
          <li>Earn money by completing levels efficiently</li>
          <li><strong>Relics:</strong> Powerful permanent upgrades that change your strategy</li>
          <li><strong>Card Packs:</strong> Add new cards to your deck (Eco Pack: 1-3, High Roller: 4-6)</li>
        </ul>

        <button className="btn draw" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
