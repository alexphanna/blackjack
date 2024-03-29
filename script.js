/**
 * Blackjack in JavaScript
 * Made for AP Computer Science Principles
 */
class Player {
    constructor(name) {
        this.name = name;
        this.money = 1000;
        this.bet = 100;
        this.hands = [];

        this.heading = document.createElement("h3");
        this.displayMoney();
    }
    
    draw() {
        for (let hand of this.hands) {
            hand.draw();
        }
    }
    
    displayMoney() {
        if (this.name == "Dealer") {
            this.heading.innerHTML = `${this.name}`;
        } else {
            this.heading.innerHTML = `${this.name}: $${this.money}`;
        }
    }
}

class Hand {
    constructor(holder, cards = []) {
        this.holder = holder
        this.cards = cards;
        this.bet = 100;

        if (this.holder.name != "Dealer") {
            this.betInput = document.createElement("input");
            game.appendChild(this.betInput);
    
            this.dealButton = document.createElement("button");
            this.dealButton.innerHTML = "Deal";
            this.dealButton.onclick = this.deal.bind(this);
            game.appendChild(this.dealButton);
        }
    }
    
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

    deal() {
        if (this.holder.name != "Dealer") {
            this.bet = Number(this.betInput.value);
            game.removeChild(this.betInput);
            game.removeChild(this.dealButton);
            if (dealer.hands[0].cards.length == 0) {
                dealer.hands[0].deal();
            }
        }

        this.div = document.createElement("div");

        this.status = document.createElement("h2");
        this.div.appendChild(this.status);

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', this.cards.length * 30 + 70);
        this.svg.setAttribute('height', '90');
        this.div.appendChild(this.svg);

        this.scoreText = document.createElement("p");
        this.scoreText.innerHTML = `${this.score}`;
        this.div.appendChild(this.scoreText);

        if (this.holder.name != "Dealer") {
            this.buttons = document.createElement("div");
            this.buttons.setAttribute('style', 'display: inline-block');
            this.div.appendChild(this.buttons);

            const buttonNames = ["Hit", "Stand", "Split", "Double", "Surrender"];
            const buttonFunctions = [this.hit, this.stand, this.split, this.double, this.surrender];
            const buttonTitles = [
                "Take another card",
                "Take no more cards",
                "Create two hands from a starting hand where both cards are the same value. Each new hand gets a second card resulting in two starting hands",
                "Increase the initial bet by 100% and take exactly one more card",
                "Forfeit half the bet and end the hand immediately"
            ]

            for (let i = 0; i < buttonNames.length; i++) {
                const button = document.createElement("button");
                button.title = buttonTitles[i];
                button.onclick = buttonFunctions[i].bind(this);
                button.innerHTML = buttonNames[i];
                this.buttons.appendChild(button);
            }

            this.div.appendChild(this.buttons);
    
            let linebreak = document.createElement("br");
            this.div.appendChild(linebreak);
        }

        game.insertBefore(this.div, this.holder.heading.nextSibling);

        if (this.cards.length == 0) {
            this.hit();
            this.hit();
        }
        else if (this.cards.length == 1) {
            this.hit();
            this.holder.hands[this.holder.hands.length - 2].hit();
        }
        this.holder.draw();
    }
    
    draw() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].draw(this.svg, i * 30 + 0, 0);
        }
        this.updateScore();
    }
    
    updateScore() {
        const score = this.score;
        if (score.length == 0) {
            this.scoreText.setAttribute('style', 'color: red');
            this.scoreText.innerHTML = `> 21`;
        }
        else {
            this.scoreText.setAttribute('style', 'color: white');
            this.scoreText.innerHTML = `${score}`;
        }
    }
    
    hit() {
        let card = deck.pop();
        if (this.holder.name == "Dealer" && this.cards.length == 0) {
            card.flip();
        }
        this.cards.push(card);
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        card.draw(this.svg, (this.cards.length - 1) * 30 + 0, 0);
        this.updateScore();
        if (this.holder.name != "Dealer") {
            if (this.score.length == 0) {
                this.holder.money -= this.bet;
                this.displayMessage("Busted", "red");
                this.stand();
            }
            else if (this.score.length > 2 && this.score[this.score.length - 1] == 21) {
                this.stand();
            }
        }
    }
    
    stand() {
        this.buttons.setAttribute('style', 'display: none');
        for (let hand of this.holder.hands) {
            if (hand.buttons.style.display != "none") {
                return;
            }
        }
        this.reveal();
        const dealerTurnInterval = setInterval(() => {
            let dealerScore = dealer.hands[0].score;
            if (dealerScore[dealerScore.length - 1] < 17 && dealerScore.length > 0) {
                dealer.hands[0].hit();
                dealerScore = dealer.hands[0].score;
            }
            if (dealerScore[dealerScore.length - 1] >= 17 || dealerScore.length == 0) {
                clearInterval(dealerTurnInterval);
                for (let hand of this.holder.hands) {
                    if (hand.score.length == 0) {
                        continue;
                    }
                    const score = hand.score;
                    if (score.length == 0 || score[score.length - 1] < dealerScore[dealerScore.length - 1]) {
                        hand.holder.money = hand.holder.money - hand.bet;
                        hand.displayMessage("You lose!", "red");
                    }
                    else if (dealerScore.length == 0 || score[score.length - 1] > dealerScore[dealerScore.length - 1]) {
                        hand.holder.money = hand.holder.money + hand.bet;
                        hand.displayMessage("You win!", "lime");
                    }
                    else {
                        hand.displayMessage("Push", "yellow");
                    }
                }
            }
        }, 1000);
    }
    
    double() {
        this.bet *= 2;
        this.hit();
        if (this.score[this.score.length - 1] <= 21) {
            this.stand();
        }
    }
    
    split() {
        if (true || (this.cards.length == 2 && this.cards[0].points == this.cards[1].points)) {
            const newHand = new Hand(this.holder);
            newHand.cards.push(this.cards.pop());
            this.holder.hands.push(newHand);
        }
    }
    
    surrender() {
        this.reveal();
        this.holder.money -= this.bet / 2;
        this.displayMessage("Surrendered", "yellow");
    }
    
    reveal() {
        const dealerHand = dealer.hands[0];
        if (!dealerHand.cards[0].faceUp) {
            dealerHand.cards[0].flip();
        }
        dealerHand.updateScore();
        dealerHand.draw();
    }
    
    displayMessage(message, color) {
        this.holder.displayMoney();
        this.status.setAttribute('style', `color: ${color}`);
        this.status.innerHTML = message;
        this.buttons.setAttribute('style', 'display: none');
        document.getElementById("restartButton").setAttribute('style', 'display: inline-block');
    }
}

class Deck {
    static createDeck() {
        let cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(suit, value));
            }
        }
        return cards;
    }
    
    static shuffle(oldCards) {
        let newCards = [...oldCards];
        for (let i = 0; i < oldCards.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            if (j != i) {
                newCards[i] = newCards[j];
            }
            newCards[j] = oldCards[i];
        }
        return newCards;
    }
}

class Card {
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
    
    flip() {
        this.faceUp = !this.faceUp;
    }
    
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

function start() {
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    player.hands = [];
    dealer.hands = [];
    
    document.getElementById("restartButton").innerHTML = "Restart";
    document.getElementById("restartButton").setAttribute('style', 'display: none');

    deck = Deck.shuffle(Deck.createDeck());

    game.appendChild(dealer.heading);

    let hand = new Hand(dealer);
    dealer.hands.push(hand)

    game.appendChild(player.heading);
    
    hand = new Hand(player);
    player.hands.push(hand)
    
    if (player.hands[0].score.includes(21)) {
        player.money += player.hands[0].bet * 3 / 2;
        player.hands[0].displayMessage("Blackjack", "lime");
    }
}

let game = document.getElementById("game");
let deck;
let dealer = new Player("Dealer");
let player = new Player("Player");