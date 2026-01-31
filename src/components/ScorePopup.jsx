import React from "react";
import "../App.css";

export default function ScorePopup({
  score = 0,
  money = 0,
  isMoney = false,
  position,
  col,
  bonusTriggered = false,
  isVeteran = false,
  isFusion = false,
  isUpgrade = false,
  isRecycle = false,
  isDuplicate = false,
  cardValue = 0,
  cardEnhancement = null,
  isMega = false,
}) {
  const isNegative = score < 0;
  const isRainbow = col === "rainbow";

  /* =========================
     COLOR LOGIC
  ========================= */
  let color;
  if (isMoney) {
    color = "#22c55e"; // money green
  } else if (isNegative) {
    color = "red";
  } else if (isRainbow) {
    color = "#facc15";
  } else if (isUpgrade) {
    color = "#a78bfa";
  } else if (isRecycle) {
    color = "#10b981";
  } else if (isDuplicate) {
    color = "#8b5cf6";
  } else {
    color = col;
  }

  /* =========================
     TEXT LOGIC
  ========================= */
  let text;

  if (isMoney) {
    text = money >= 0 ? `💰 +$${money}` : `💸 -$${Math.abs(money)}`;
  } else if (isFusion) {
    text = "🎨 Mega Card Created! 🎨";
  } else if (isUpgrade) {
    const colorName = col.charAt(0).toUpperCase() + col.slice(1);
    let cardDescription = `${colorName} ${cardValue}`;

    let upgradeType = "";
    if (cardEnhancement === "plusFive") {
      upgradeType = " → +5 Bonus";
    } else if (cardEnhancement === "wild") {
      upgradeType = " → Wild";
    } else if (cardEnhancement === "plusMoney") {
      upgradeType = " → +$3";
    }

    if (isMega) {
      cardDescription = `Mega ${cardDescription}`;
    }

    text = `⚗️ ${cardDescription}${upgradeType}! ⚗️`;
  } else if (isRecycle) {
    text = "♻️ Cards Recycled! ♻️";
  } else if (isDuplicate) {
    const colorName = col.charAt(0).toUpperCase() + col.slice(1);
    let cardDescription = `${colorName} ${cardValue}`;

    if (isMega) {
      cardDescription = `Mega ${cardDescription}`;
    } else if (cardEnhancement === "plusFive") {
      cardDescription = `${cardDescription} (+5)`;
    } else if (cardEnhancement === "wild") {
      cardDescription = `Wild ${cardDescription}`;
    } else if (cardEnhancement === "plusMoney") {
      cardDescription = `${cardDescription} (+$3)`;
    } else if (cardEnhancement === "purple") {
      cardDescription = `Purple ${cardDescription}`;
    }

    text = `🔮 Duplicated ${cardDescription}! 🔮`;
  } else if (isRainbow) {
    text = "🌈 +40 Rainbow Bonus! 🌈";
  } else {
    text = isNegative ? `-$${Math.abs(score)}` : `+${score}`;
  }

  /* =========================
     STYLE LOGIC
  ========================= */
  const style = {
    top: position.y,
    left: position.x,
    fontSize: isMoney
      ? "2.3rem"
      : isRainbow || isFusion || isUpgrade || isRecycle || isDuplicate
      ? "2rem"
      : bonusTriggered
      ? "2.5rem"
      : isVeteran
      ? "2.2rem"
      : "2rem",
    color:
      bonusTriggered && !isRainbow && !isMoney
        ? "#facc15"
        : isVeteran && !isRainbow && !isMoney
        ? "#fbbf24"
        : color,
    fontWeight:
      isMoney ||
      bonusTriggered ||
      isVeteran ||
      isRainbow ||
      isFusion ||
      isUpgrade ||
      isRecycle ||
      isDuplicate
        ? "900"
        : "800",
    textShadow: isMoney
      ? `
        -2px -2px 0 #fff,
        2px -2px 0 #fff,
        -2px 2px 0 #fff,
        2px 2px 0 #fff,
        0 0 20px #22c55e,
        0 0 30px #22c55e
      `
      : bonusTriggered || isRainbow
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
