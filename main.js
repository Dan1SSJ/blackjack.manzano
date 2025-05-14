let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const playerScoreSpan = document.getElementById("player-score");
const dealerScoreSpan = document.getElementById("dealer-score");
const message = document.getElementById("message");

document.getElementById("new-card").addEventListener("click", () => {
  if (!gameOver) {
    playerHand.push(drawCard());
    updateUI();
    checkPlayerBust();
  }
});

document.getElementById("stand").addEventListener("click", () => {
  gameOver = true;
  dealerPlay();
});

document.getElementById("restart").addEventListener("click", startGame);

function startGame() {
  deck = createDeck();
  shuffle(deck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard()];
  gameOver = false;
  message.textContent = "";
  updateUI();
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const newDeck = [];
  for (const suit of suits) {
    for (const value of values) {
      newDeck.push({ value, suit });
    }
  }
  return newDeck;
}

function drawCard() {
  return deck.pop();
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function updateUI() {
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';
  playerHand.forEach(card => {
    playerCardsDiv.appendChild(createCardElement(card));
  });
  dealerHand.forEach(card => {
    dealerCardsDiv.appendChild(createCardElement(card));
  });

  playerScoreSpan.textContent = calculateScore(playerHand);
  dealerScoreSpan.textContent = calculateScore(dealerHand);
}

function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.textContent = `${card.value}${card.suit}`;
  return cardDiv;
}

function checkPlayerBust() {
  const score = calculateScore(playerHand);
  if (score > 21) {
    message.textContent = 'Te pasaste. Pierdes!';
    gameOver = true;
  }
}

function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  updateUI();
  determineWinner();
}

function determineWinner() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    message.textContent = 'Ganaste!';
  } else if (playerScore === dealerScore) {
    message.textContent = 'Empate!';
  } else {
    message.textContent = 'CPU GANA!';
  }
}

startGame();
