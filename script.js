/**
 * Represents a player in the blackjack game.
 */
class Player {
    /**
     * Creates a new player with the specified name.
     * @param {string} name - The name of the player.
     */
    constructor(name) {
        this.name = name;
        this.money = 1000;
        this.bet = 100;
        this.hands = [];

        this.heading = document.createElement("h3");
        this.displayScore();
    }

    /**
     * Draws the player's hands.
     */
    draw() {
        for (let hand of this.hands) {
            hand.draw();
        }
    }

    /**
     * Displays the player's score.
     */
    displayScore() {
        if (this.name == "Dealer") {
            this.heading.innerHTML = `${this.name}`;
        } else {
            this.heading.innerHTML = `${this.name}: ${this.money}`;
        }
    }
}

/**
 * Represents a hand of cards.
 * @class
 */
class Hand {
    /**
     * Represents a hand of cards.
     * @constructor
     * @param {string} holder - The name of the holder of the hand.
     * @param {Array} [cards=[]] - An array of cards in the hand.
     */
    constructor(holder, cards = []) {
        this.holder = holder
        this.cards = cards;

        this.div = document.createElement("hand");

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', this.cards.length * 30 + 70);
        this.svg.setAttribute('height', '90');
        this.div.appendChild(this.svg);

        this.scoreText = document.createElement("p");
        this.scoreText.innerHTML = `${this.score}`;
        this.div.appendChild(this.scoreText);

        game.appendChild(this.div);

        let linebreak = document.createElement("br");
        game.appendChild(linebreak);

        if (this.holder.name != "Dealer") {
            this.buttons = document.createElement("div");
            this.buttons.setAttribute('style', 'display: inline-block');
            game.appendChild(this.buttons);

            const buttonNames = ["Hit", "Stand", "Split", "Double", "Surrender"];
            const buttonFunctions = [this.hit, this.stand, this.split, this.double, this.surrender];

            for (let i = 0; i < buttonNames.length; i++) {
                const button = document.createElement("button");
                button.onclick = buttonFunctions[i].bind(this);
                button.innerHTML = buttonNames[i];
                this.buttons.appendChild(button);
            }

            game.appendChild(this.buttons);
    
            linebreak = document.createElement("br");
            game.appendChild(linebreak);
        }
    }
    
    /**
     * Calculates the score of the player's hand.
     * @returns {number[]} An array of possible scores.
     */
    get score() {
        let sum = [0];
        for (let card of this.cards) {
            if (card.faceUp) {
                if (card.value == 1) {
                    sum.push(sum[sum.length - 1] + 10);
                }
                if (card.value > 10) {
                    for (let i = 0; i < sum.length; i++) {
                        sum[i] += 10;
                    }
                }
                else {
                    for (let i = 0; i < sum.length; i++) {
                        sum[i] += card.value;
                    }
                }
                for (let i = 0; i < sum.length; i++) {
                    if (sum[i] > 21) {
                        sum.splice(i, sum.length - i);
                        break;
                    }
                }
            }
        }
        return sum;
    }

    /**
     * Draws the cards on the SVG element and updates the score text.
     */
    draw() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].draw(this.svg, i * 30 + 0, 0);
        }
        this.scoreText.innerHTML = `${this.score}`;
    }

    /**
     * Deals a new card to the player or dealer and updates the game state.
     */
    hit() {
        let card = deck.pop();
        if (this.holder.name == "Dealer" && this.cards.length == 0) {
            card.flip();
        }
        this.cards.push(card);
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        card.draw(this.svg, (this.cards.length - 1) * 30 + 0, 0);
        this.scoreText.innerHTML = `${this.score}`;
        if (this.holder.name != "Dealer") {
            if (this.score.length == 0) {
                this.holder.money -= this.holder.bet;
                this.displayMessage("Busted", "red");
            }
            else if (this.score[this.score.length - 1] == 21) {
                this.stand();
            }
        }
    }

    /**
     * Makes the player stand and triggers the dealer's turn.
     */
    stand() {
        this.reveal();
        this.buttons.setAttribute('style', 'display: none');
        var dealerTurnInterval = setInterval(() => {
            const dealerScore = dealer.hands[0].score;
            if (dealerScore[dealerScore.length - 1] >= 17 || dealerScore.length == 0) {
                clearInterval(dealerTurnInterval);
                const score = this.score;
                if (score.length == 0 || score[score.length - 1] < dealerScore[dealerScore.length - 1]) {
                    this.holder.money = this.holder.money - this.holder.bet;
                    this.displayMessage("You lose!", "red");
                }
                else if (dealerScore.length == 0 || score[score.length - 1] > dealerScore[dealerScore.length - 1]) {
                    this.holder.money = this.holder.money + this.holder.bet;
                    this.displayMessage("You win!", "lime");
                }
                else {
                    this.displayMessage("Push", "yellow");
                }
            }
            else {
                dealer.hands[0].hit();
            }
        }, 1000);
    }

    /**
     * Doubles the bet, hits a card, and stands if the score is less than or equal to 21.
     */
    double() {
        this.holder.bet *= 2;
        this.hit();
        if (this.score[this.score.length - 1] <= 21) {
            this.stand();
        }
    }

    /**
     * Splits the hand into two separate hands if the conditions are met.
     */
    split() {
        if (this.cards.length == 2 && this.cards[0].points == this.cards[1].points) {
            var newHand = new Hand(this.holder);
            this.holder += newHand;
            newHand.cards.push(this.cards.pop());
            this.draw();
            newHand.draw();
            this.hit();
            newHand.hit();
        }
    }
    
    /**
     * Surrenders the current hand, revealing the cards, deducting half of the bet amount from the player's money,
     * displaying the player's score, and showing a surrender message in yellow color.
     */
    surrender() {
        this.reveal();
        this.holder.money -= this.holder.bet / 2;
        this.holder.displayScore();
        this.displayMessage("Surrendered", "yellow");
    }
    
    /**
     * Reveals the first card of the dealer's hand, updates the score text, and draws the hand.
     */
    reveal() {
        const dealerHand = dealer.hands[0];
        dealerHand.cards[0].flip();
        dealerHand.scoreText.innerHTML = `${dealerHand.score}`;
        dealerHand.draw();
    }

    /**
     * Displays a message on the screen with the specified color.
     *
     * @param {string} message - The message to be displayed.
     * @param {string} color - The color of the message.
     */
    displayMessage(message, color) {
        document.getElementById("status").setAttribute('style', `color: ${color}`);
        document.getElementById("status").innerHTML = message;
        this.buttons.setAttribute('style', 'display: none');
        document.getElementById("restartButton").setAttribute('style', 'display: inline-block');
        document.getElementById("betInput").removeAttribute("disabled");
    }
}

/**
 * Represents a deck of cards.
 */
class Deck {
    /**
     * Creates a deck of cards.
     * @returns {Array} An array of Card objects representing a deck of cards.
     */
    static createDeck() {
        var cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(suit, value));
            }
        }
        return cards;
    }
    
    /**
     * Shuffles an array of cards using the Fisher-Yates algorithm.
     * @param {Array} oldCards - The array of cards to be shuffled.
     * @returns {Array} - The shuffled array of cards.
     */
    static shuffle(oldCards) {
        var newCards = [...oldCards];
        for (let i = 0; i < oldCards.length; i++) {
            var j = Math.floor(Math.random() * (i + 1));
            if (j != i) {
                newCards[i] = newCards[j];
            }
            newCards[j] = oldCards[i];
        }
        return newCards;
    }
}

/**
 * Represents a playing card.
 * @class
 */
class Card {
    /**
     * Represents a card in a deck.
     * @constructor
     * @param {string} suit - The suit of the card.
     * @param {number} value - The value of the card.
     * @param {boolean} [faceUp=true] - Whether the card is face up or face down.
     */
    constructor(suit, value, faceUp = true) {
        this.suit = suit;
        this.value = value;
        switch(this.value) {
            case 11:
            case 12:
            case 13:
                this.points = 10;
                break;
            default:
                this.points = this.value
                break;
        }
        this.faceUp = faceUp;
    }

    /**
     * Returns the rank of the card.
     * @returns {string|number} The rank of the card. If the value is 1, 11, 12, or 13, it returns "A", "J", "Q", or "K" respectively. Otherwise, it returns the numeric value.
     */
    get rank() {
        switch(this.value) {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.value
        }
    }

    /**
     * Get the symbol representation of the card's suit.
     *
     * @returns {string} The symbol representation of the card's suit.
     */
    get symbol() {
        switch(this.suit) {
            case 0:
                return "♠";
            case 1:
                return "♥";
            case 2:
                return "♣";
            case 3:
                return "♦";
        }
    }
    
    /**
     * Flips the card, changing its faceUp property.
     */
    flip() {
        this.faceUp = !this.faceUp;
    }

    /**
     * Draws a playing card on the SVG canvas.
     * @param {SVGSVGElement} svg - The SVG element to draw on.
     * @param {number} x - The x-coordinate of the top-left corner of the card.
     * @param {number} y - The y-coordinate of the top-left corner of the card.
     */
    draw(svg, x, y) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '70');
        rect.setAttribute('x', x + 10);
        rect.setAttribute('y', y + 10);
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        rect.setAttribute('fill', this.faceUp ? 'white' : 'white');
        svg.appendChild(rect);

        if (this.faceUp) {
            const color = this.suit % 2 === 0 ? "black" : "red";

            const textRank = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textRank.setAttribute('dominant-baseline', 'hanging');
            textRank.setAttribute('x', x + 15);
            textRank.setAttribute('y', y + 15);
            textRank.setAttribute('fill', color);
            textRank.innerHTML = this.rank;
            svg.appendChild(textRank);

            const textSymbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textSymbol.setAttribute('x', x + 15);
            textSymbol.setAttribute('y', y + 45);
            textSymbol.setAttribute('fill', color);
            textSymbol.innerHTML = this.symbol;
            svg.appendChild(textSymbol);
        } else {
            const rectBack = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rectBack.setAttribute('width', '48');
            rectBack.setAttribute('height', '68');
            rectBack.setAttribute('x', x + 11);
            rectBack.setAttribute('y', y + 11);
            rectBack.setAttribute('rx', '5');
            rectBack.setAttribute('ry', '5');
            rectBack.setAttribute('fill', 'darkblue');
            rectBack.setAttribute('filter', 'none');
            svg.appendChild(rectBack);
        }
    }
}

/**
 * Starts the game by initializing the game state and dealing cards to the player and dealer.
 */
function start() {
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    player.hands = [];
    dealer.hands = [];

    document.getElementById("betInput").setAttribute("disabled", "disabled");
    document.getElementById("restartButton").innerHTML = "Restart";
    document.getElementById("restartButton").setAttribute('style', 'display: none');
    document.getElementById("status").setAttribute('style', 'color: white');
    document.getElementById("status").innerHTML = "";

    player.bet = Number(document.getElementById("betInput").value);

    deck = Deck.shuffle(Deck.createDeck());

    game.appendChild(dealer.heading);

    let hand = new Hand(dealer);
    hand.hit();
    hand.hit();
    dealer.hands.push(hand)

    game.appendChild(player.heading);
    
    hand = new Hand(player);
    hand.hit();
    hand.hit();
    player.hands.push(hand)

    hand.buttons.setAttribute('style', 'display: inline-block')
    
    if (player.hands[0].score.includes(21)) {
        player.money += player.bet * 3 / 2;
        player.displayScore();
        player.hands[0].displayMessage("Blackjack", "lime");
    }
}

var game = document.getElementById("game");
var deck;
var dealer = new Player("Dealer");
var player = new Player("Player");