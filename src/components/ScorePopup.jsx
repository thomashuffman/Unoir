import React from "react";
import "../App.css";

export default function ScorePopup({ score, position, col, bonusTriggered = false, isVeteran = false, isFusion = false, isUpgrade = false, isRecycle = false, isDuplicate = false, cardValue = 0, cardEnhancement = null, isMega = false }) {
  const isNegative = score < 0;
  const isRainbow = col === "rainbow";
  
  // Determine color
  let color;
  if (isNegative) {
    color = "red";
  } else if (isRainbow) {
    color = "#facc15"; // Gold for rainbow
  } else if (isUpgrade) {
    color = "#a78bfa"; // Purple for upgrades
  } else if (isRecycle) {
    color = "#10b981"; // Green for recycle
  } else if (isDuplicate) {
    color = "#8b5cf6"; // Purple for duplicates
  } else {
    color = col;
  }
  
  // Determine text
  let text;
  if (isFusion) {
    text = "🎨 Mega Card Created! 🎨";
  } else if (isUpgrade) {
    // Build descriptive text for upgraded card
    const colorName = col.charAt(0).toUpperCase() + col.slice(1);
    let cardDescription = `${colorName} ${cardValue}`;
    
    // Show what it was upgraded to
    let upgradeType = "";
    if (cardEnhancement === "plusFive") {
      upgradeType = " → +5 Bonus";
    } else if (cardEnhancement === "wild") {
      upgradeType = " → Wild";
    } else if (cardEnhancement === "plusMoney") {
      upgradeType = " → +$1";
    }
    
    if (isMega) {
      cardDescription = `Mega ${cardDescription}`;
    }
    
    text = `⚗️ ${cardDescription}${upgradeType}! ⚗️`;
  } else if (isRecycle) {
    text = "♻️ Cards Recycled! ♻️";
  } else if (isDuplicate) {
    // Build descriptive text for duplicated card
    const colorName = col.charAt(0).toUpperCase() + col.slice(1);
    let cardDescription = `${colorName} ${cardValue}`;
    
    // Add enhancement information
    if (isMega) {
      cardDescription = `Mega ${cardDescription}`;
    } else if (cardEnhancement === "plusFive") {
      cardDescription = `${cardDescription} (+5)`;
    } else if (cardEnhancement === "wild") {
      cardDescription = `Wild ${cardDescription}`;
    } else if (cardEnhancement === "plusMoney") {
      cardDescription = `${cardDescription} (+$1)`;
    } else if (cardEnhancement === "purple") {
      cardDescription = `Purple ${cardDescription}`;
    }
    
    text = `🔮 Duplicated ${cardDescription}! 🔮`;
  } else if (isRainbow) {
    text = "🌈 +40 Rainbow Bonus! 🌈";
  } else {
    text = isNegative ? `-$${Math.abs(score)}` : `+${score}`;
  }

  const style = {
    top: position.y,
    left: position.x,
    fontSize: isRainbow || isFusion || isUpgrade || isRecycle || isDuplicate ? "2rem" : bonusTriggered ? "2.5rem" : isVeteran ? "2.2rem" : "2rem",
    color: bonusTriggered && !isRainbow ? "#facc15" : isVeteran && !isRainbow ? "#fbbf24" : color,
    fontWeight: bonusTriggered || isVeteran || isRainbow || isFusion || isUpgrade || isRecycle || isDuplicate ? "900" : "800",
    textShadow: bonusTriggered || isRainbow
      ? `
        -2px -2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        2px 2px 0 #fff,
        0 0 20px #facc15,
        0 0 30px #facc15
      `
      : isVeteran
      ? `
        -2px -2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        2px 2px 0 #fff,
        0 0 15px #fbbf24
      `
      : isFusion || isUpgrade || isDuplicate
      ? `
        -2px -2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        2px 2px 0 #fff,
        0 0 20px #a78bfa,
        0 0 30px #a78bfa
      `
      : isRecycle
      ? `
        -2px -2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        2px 2px 0 #fff,
        0 0 20px #10b981,
        0 0 30px #10b981
      `
      : `
        -1px -1px 0 #fff,
        1px -1px 0 #fff,
        -1px 1px 0 #fff,
        1px 1px 0 #fff,
        0 0 10px ${color}
      `,
  };

  return (
    <div className="score-popup" style={style}>
      {text}
    </div>
  );
}