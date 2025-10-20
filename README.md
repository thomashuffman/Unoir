UNOIR

Welcome to UNOIR, a thrilling and strategic card game built with React and Redux. Dive into a vibrant world of card chaining, where you strategize to meet score goals, collect powerful relics, and enhance your deck in a dazzling shop. With its glowing UI and dynamic gameplay, UNOIR offers an addictive and visually stunning experience!

Table of Contents





Overview



Gameplay



Features



Installation



How to Play



Project Structure



Technologies Used



Contributing



License

Overview

UNOIR is a single-player card game where players chain colored cards to achieve level-specific score goals within limited draws. Between levels, visit the shop to spend earned money on card packs and relics like the Lucky Charm (extra draws) or Golden Amulet (extra money). Featuring a sleek, modern interface with vibrant gradients, glowing buttons, and smooth animations, UNOIR combines strategy and style for an immersive gaming experience.

Gameplay





Objective: Reach the target score for each level (30 for Level 1, 80 for Level 2, 120 for Level 3) by chaining cards strategically.



Cards: Play cards with colors (red, blue, green, yellow, purple) and optional enhancements (e.g., plusMoney adds $1 when played).



Chaining: Build sequences where each card’s color matches the previous one or follows rules defined in gameLogic.js.



Draws: Use a limited number of draws per level (default: 8, plus extra draws from Lucky Charm relics).



Shop: After completing a level, spend money on:





Eco Pack ($2): 3 random cards.



High Roller Pack ($5): 5 random cards with a higher chance of enhancements.



Remove Card ($3): Remove a card from your hand.



Remove Card from Deck ($5): Remove a card from your deck.



Lucky Charm ($3): Grants +1 draw per level.



Golden Amulet ($5): Grants +$1 when completing a level.



Winning/Losing: Meet the score goal to proceed to the shop or win (after Level 3). Run out of draws with no playable cards, and it’s game over.

Features





Strategic Card Chaining: Build chains to maximize scores while managing limited draws.



Dynamic Shop: Purchase card packs and relics to boost your deck and gameplay.



Relics: Equip Lucky Charm for extra draws or Golden Amulet for bonus money.



Vibrant UI: A responsive interface with glowing buttons, colorful gradients, and smooth animations, optimized for desktop and mobile.



Level Progression: Three challenging levels with escalating score goals.



Deck Management: View and refine your deck by removing unwanted cards.



Redux State Management: Robust handling of deck, score, money, and relics.

Installation

To run UNOIR locally, follow these steps:





Clone the Repository:

git clone https://github.com/your-username/unoir.git
cd unoir



Install Dependencies: Ensure you have Node.js installed. Then run:

npm install



Start the Development Server:

npm start

The game will open in your default browser at http://localhost:3000.



Build for Production (optional):

npm run build

This creates an optimized build in the build folder.

How to Play





Start a Run: Begin at Level 1 with a deck of colored cards and 5 cards in hand.



Play Cards: Click a card in your hand to add it to the chain if it’s a valid play (based on color or rules in gameLogic.js).



Draw Cards: Use the "Draw" button to draw a new card (limited by drawsLeft).



Reset Chain: Reset the chain to start a new sequence (no score penalty).



Shop: After clearing a level, spend money on card packs or relics in the vibrant shop interface.



Win or Lose: Reach the score goal to proceed or win (Level 3). If draws run out and no cards are playable, you lose.



View Deck/Rules: Use the "View Deck" button to inspect your deck or the "Info / Rules" button for game details.

Project Structure

unoir/
├── src/
│   ├── components/
│   │   ├── infoModal.jsx       # Modal for game rules
│   │   └── deckModal.jsx       # Modal to view deck
│   ├── game/
│   │   └── gameLogic.js        # Logic for card scoring and playability
│   ├── levels/
│   │   └── levelScreen.jsx     # Main gameplay screen
│   ├── shop/
│   │   └── shopScreen.jsx      # Shop interface for buying packs/relics
│   ├── store/
│   │   └── runSlice.js         # Redux slice for game state
│   ├── App.css                 # Styles for the game
│   ├── App.jsx                 # Main app component
│   └── index.js                # Entry point
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico
├── package.json                # Project dependencies and scripts
└── README.md                   # This file

Technologies Used





React: Frontend library for building the UI.



Redux: State management for deck, score, money, and relics.



React-Redux: Connects Redux to React components.



CSS: Custom styles with gradients, animations, and responsive grid layouts.



JavaScript (ES6+): Core game logic and functionality.



Vite/Webpack: Development and build tools (assumed; adjust based on your setup).

Contributing

We welcome contributions to UNOIR! To contribute:





Fork the repository.



Create a new branch (git checkout -b feature/your-feature).



Make your changes and commit (git commit -m "Add your feature").



Push to your branch (git push origin feature/your-feature).



Open a pull request with a description of your changes.

Please ensure your code follows the existing style and includes tests if applicable. Report issues or suggest features via the Issues tab.

License

This project is licensed under the MIT License. See the LICENSE file for details.



Get ready to chain, shop, and conquer in UNOIR! 🎴 Star the repo and share the fun with friends!