document.addEventListener("DOMContentLoaded", displayUserBalance());

/**
 * INITIALISE GAME STATE VARIABLES
 */
const gameState = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  gamePhase: 'start', // 'start', 'playerTurn', 'dealerTurn', 'gameOver'
  playerStand: false,
  winCondition: ''
};

function resetGameState() {
  gameState.gamePhase = 'start';
  gameState.playerHand = [];
  gameState.dealerHand = [];
  gameState.playerStand = false;
  gameState.winCondition = '';
}

/**
 * CREATE CARDS AND SHUFFLE DECK
 */

var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Function to create a standard deck of 52 poker cards
var createCardDeck = function() {
  var cardDeck = []; // init an array to store the cards
  var suitArray = ['diamonds', 'clubs', 'hearts', 'spades']; // an array for the suit of cards


  for (var suitIndex = 0; suitIndex < suitArray.length; suitIndex++) { // iterating through the suits array
    var currentSuit = suitArray[suitIndex]; // init and save current suit
    for (var rankIndex = 1; rankIndex <= 13; rankIndex++) { // iterating through the number of cards each suit is supposed to consist of.
      var rankName = rankIndex; // save current card index
      var cardValue = rankIndex; // save current card value

      if (rankIndex === 1) {
        rankName = 'ace';
        cardValue = 11;  // Ace is 11 by default, we'll handle its dual value in calculateHandValue
      } else if (rankIndex === 11) {
        rankName = 'jack';
        cardValue = 10;
      } else if (rankIndex === 12) {
        rankName = 'queen';
        cardValue = 10;
      } else if (rankIndex === 13) {
        rankName = 'king';
        cardValue = 10;
      }

      // init an object to store the detail of the card
      var card = {
        rank: rankIndex,
        suit: currentSuit,
        name: rankName,
        value: cardValue
      };
      // push the card object (details of the card) to the card deck array
      cardDeck.push(card);
    }
  }
  return cardDeck; // once the deck has been made, the function will return the whole deck
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

/**
 * GAMEPLAY MECHANICS
 */

// Deals the first set of cards when a new game starts
var dealInitialCards = function() {
  gameState.playerHand = [gameState.deck.pop(), gameState.deck.pop()];
  gameState.dealerHand = [gameState.deck.pop(), gameState.deck.pop()];
  gameState.gamePhase = 'playerTurn';
};

// calculates the total value the users hand has after drawing
var calculateHandValue = function(hand) {
  var total = 0;
  var aceCount = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[0].name === 'ace' && hand[1].name === 'ace') {
      aceCount+=2;
    } else if (hand[i].name === 'ace') {
      aceCount++;
    }
    total += hand[i].value;
  }
  // Adjust for Aces
  if (total > 21 && aceCount > 1 && hand.length > 2) {
    total -= 10;
    // aceCount--;
  }
  // console.log("Hand Value: ", total);
  return total;
};

var displayHand = function(hand, isDealer = false, hideSecond = false) {
  var output = '<div class="hand">';
  var handValue = calculateHandValue(hand);
  
  for (var i = 0; i < hand.length; i++) {
    if (isDealer && hideSecond && i === 1) {
      output += '<img src="assets/back.png" alt="Hidden Card" class="card">';
    } else {
      var cardName = `${hand[i].name}_of_${hand[i].suit}`.toLowerCase();
      output += `<img src="assets/${cardName}.png" alt="${hand[i].name} of ${hand[i].suit}" class="card">`;
    }
  }
  
  output += `<span class="hand-value">${isDealer && hideSecond ? 'Dealer hand' : 'Hand value: ' + handValue}</span>`;
  output += '</div>';
  
  return output;
};

// Checks is the dealer or the user has blackjack
var checkForBlackjack = function() {
  var playerValue = calculateHandValue(gameState.playerHand);
  var dealerValue = calculateHandValue(gameState.dealerHand);

  if (playerValue === 21 && dealerValue === 21) {
    return "Both player and dealer have Blackjack! It's a tie!";
  } else if (playerValue === 21) {
    gameState.winCondition = 'playerBlackjack';
    return "Player wins with Blackjack!";
  } else if (dealerValue === 21) {
    gameState.winCondition = 'dealerBlackjack';
    return "Dealer wins with Blackjack!";
  }
  return null;
};

// Checks is the dealer or the user has blackjack
var checkForPocketAce = function() {
  var playerValue = calculateHandValue(gameState.playerHand);
  var dealerValue = calculateHandValue(gameState.dealerHand);

  if(playerValue === 22 ) {

    gameState.winCondition = 'pocketAces';
    return "Player wins with Pocket Aces!";

  } else if (dealerValue === 22) {

    gameState.winCondition = 'pocketAcesDealer';
    return "Dealer wins with Pocket Aces!";

  } else if ( playerValue === 22 && dealerValue === 22) {

    return "It is a tie!";

  }
  return null;
};

// Determine the actions to take based on the users action after the initial cards have been drawn
var playerAction = function(action) {
  if (action === 'hit') {
    gameState.playerHand.push(gameState.deck.pop());
    if (calculateHandValue(gameState.playerHand) > 21) {
      gameState.gamePhase = 'dealerTurn';
    }
  } else if (action === 'stand') {
    gameState.playerStand = true;
    gameState.gamePhase = 'dealerTurn';
  }
};

// Determines the action of the dealer
var dealerAction = function() {
  while (calculateHandValue(gameState.dealerHand) < 17) {
    gameState.dealerHand.push(gameState.deck.pop());
  }
  gameState.gamePhase = 'gameOver';
};

// Check the winning conditions
var determineWinner = function(playerValue, dealerValue) {
  // var playerValue = calculateHandValue(gameState.playerHand);
  // var dealerValue = calculateHandValue(gameState.dealerHand);

  if (checkForPocketAce()) {
    return "";
  }

  // Check for 5 card win
  if (gameState.playerHand.length === 5 && playerValue <= 21) {
    gameState.winCondition = '5CardWin';
    return "Player wins with 5 cards!";
  } else if (gameState.dealerHand.length === 5 && dealerValue <= 21) {  
    gameState.winCondition = '5CardWinDealer';
    return "Dealer wins with 5 cards!";
  }

  // Check if more than 5 card and bust
  if (gameState.playerHand.length === 5 && playerValue > 21) {
    gameState.winCondition = '5CardWinDealer';
    return "Player busts with more than 5 cards!";
  } else if (gameState.dealerHand.length === 5 && playerValue > 21) {
    gameState.winCondition = '5CardWin';
    return "Dealer busts with more than 5 cards!";
  }

  // Normal Check
  if (playerValue > 21 && dealerValue > 21) {
    return "Both player and dealer bust. It's a tie!";
  } else if (playerValue > 21) {
    gameState.winCondition = 'dealerWin';
    return "Player busts! Dealer wins.";
  } else if (dealerValue > 21) {
    gameState.winCondition = 'playerWin';
    return "Dealer busts! Player wins.";
  } else if (playerValue > dealerValue) {
    gameState.winCondition = 'playerWin';
    return "Player wins!";
  } else if (dealerValue > playerValue) {
    gameState.winCondition = 'dealerWin';
    return "Dealer wins.";
  } else {
    return "It's a tie!";
  }
};

/**
 * BETTING SYSTEM
 * WINNING CONDITIONS
 * Blackjack: Double the bet
 * Win: Get back same about you bet
 * Pocket Aces: Triple the bet
 * Win with 5 cards with no bust: Triple the bet
 * Tie: Banker and Player keep money (no change)
 * 
 * If player wins, the amount is added to the player balance
 * If player loses, the amount is deducted from the player balance
 */

const calculateWinAmount = async (winCondition) => {
  let userData = await loadUserData();
  let currentBalance = userData.users[0].balance;
  let betAmount = Number(document.querySelector("#bet-amount").value);

  // let amountAfterBet = 0;
  // balance validation. Ensure that there is enough balance to bet
  if (betAmount > currentBalance) {
    alert("Insufficient balance to place bet.");
    return;
  }

  // pocketAces
  if (winCondition === 'pocketAces') {
      amountAfterBet = currentBalance + (betAmount * 3);
  } else if (winCondition === 'pocketAcesDealer') {
      amountAfterBet = currentBalance - (betAmount * 3);
  // 5CardWin
  } else if(winCondition === '5CardWin') {
    amountAfterBet = currentBalance + (betAmount * 3);
  } else if(winCondition === '5CardWinDealer') {
    amountAfterBet = currentBalance - (betAmount * 3);
  // BlackJack
  } else if (winCondition === 'playerBlackjack') {
      amountAfterBet = currentBalance + (betAmount * 2);
  } else if (winCondition === 'dealerBlackjack') {
      amountAfterBet = currentBalance - (betAmount * 2);
  // Normal
  } else if (winCondition === 'playerWin') {
      amountAfterBet = currentBalance + betAmount;
  } else if (winCondition === 'dealerWin') {
      amountAfterBet = currentBalance - betAmount;  
  } else {
    amountAfterBet = currentBalance;
  }

  userData.users[0].balance = amountAfterBet;
  await updateUserData(userData);
};

/**
 * MAIN FUNCTION
 */

var main = function (input) {
  var output = '';
  var gameOver = false;

  if (gameState.gamePhase === 'start') {
    gameState.deck = shuffleCards(createCardDeck());
    dealInitialCards();
    var blackjackResult = checkForBlackjack();
    var pocketAceResult = checkForPocketAce();

    if(pocketAceResult) {
      output = pocketAceResult;
      gameState.gamePhase = 'gameOver';
      gameOver = true;
    }
    else if (blackjackResult) {
      output = blackjackResult;
      gameState.gamePhase = 'gameOver';
      gameOver = true;
    } else {
      output = "Cards dealt. Your turn.";
    }
  } else if (gameState.gamePhase === 'playerTurn') {
    if (input === 'hit' || input === 'stand') {
      if (gameState.playerHand.length == 5) {
        gameState.gamePhase = 'gameOver';
        gameOver = true;
      }
      playerAction(input);
      if (gameState.gamePhase === 'dealerTurn') {
        dealerAction();

        if (gameState.dealerHand.length == 5) {
          gameState.gamePhase = 'gameOver';
          gameOver = true;
        }
        gameOver = true;
      }
    } else {
      output = "Invalid input. Please enter 'hit' or 'stand'.";
    }
  }

  if (gameState.winCondition) {
    calculateWinAmount(gameState.winCondition); // Await here
  }
  
  // Display current hands
  output += "<div class='player-hand'><h2>Your hand:</h2>" + displayHand(gameState.playerHand) + "</div>";
  output += "<div class='dealer-hand'><h2>Dealer's hand:</h2>" + displayHand(gameState.dealerHand, true, gameState.gamePhase !== 'gameOver') + "</div>";

  if (gameState.gamePhase === 'gameOver' || gameOver) {
    const playerValue = calculateHandValue(gameState.playerHand);
    const dealerValue = calculateHandValue(gameState.dealerHand);
    output = determineWinner(playerValue, dealerValue) + "<br>" + output;
    calculateWinAmount(gameState.winCondition); // Finalise balance based on win condition
    resetGameState(); // Reset for a new game
  }
  
  if (gameState.gamePhase === 'playerTurn') {
    output += "<br>Do you want to 'hit' or 'stand'?";
  }

  return {
    output: output,
    gameOver: gameOver
  };
};
