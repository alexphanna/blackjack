class Player {
    constructor(name) {
        this.name = name;
        this.money = 1000;
        this.bet = 100;
        this.hands = [];

        this.heading = document.createElement("h3");
        this.update();
    }
    draw() {
        for (let hand of this.hands) {
            hand.draw()
        }
    }
    update() {
        if (this.name == "Dealer") {
            this.heading.innerHTML = `${this.name}`;
        }
        else {
            this.heading.innerHTML = `${this.name}: ${this.money}`;
        }
    }
}
class Hand {
    constructor(holder, cards = []) {
        this.holder = holder
        this.cards = cards;

        this.div = document.createElement("div");

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', this.cards.length * 30 + 70);
        this.svg.setAttribute('height', '90');
        this.svg.setAttribute('style', 'display: inline-block');
        this.div.appendChild(this.svg);

        this.scoreText = document.createElement("p");
        this.scoreText.innerHTML = `${this.score}`;
        this.scoreText.setAttribute('style', 'display: inline-block');
        this.div.appendChild(this.scoreText);

        game.appendChild(this.div);


        let linebreak = document.createElement("br");
        game.appendChild(linebreak);

        if (this.holder.name != "Dealer") {
            this.buttons = document.createElement("div");
            this.buttons.setAttribute('style', 'display: inline-block');
            game.appendChild(this.buttons);

            this.hitButton = document.createElement("button");
            this.hitButton.onclick = () => this.hit();
            this.hitButton.innerHTML = "Hit";
            this.buttons.appendChild(this.hitButton);
    
            this.standButton = document.createElement("button");
            this.standButton.onclick = () => this.stand();
            this.standButton.innerHTML = "Stand";
            this.buttons.appendChild(this.standButton);
    
            this.splitButton = document.createElement("button");
            this.splitButton.onclick = () => this.split();
            this.splitButton.innerHTML = "Split";
            this.buttons.appendChild(this.splitButton);
    
            this.doubleButton = document.createElement("button");
            this.doubleButton.onclick = () => this.double();
            this.doubleButton.innerHTML = "Double";
            this.buttons.appendChild(this.doubleButton);
    
            this.surrenderButton = document.createElement("button");
            this.surrenderButton.onclick = () => this.surrender();
            this.surrenderButton.innerHTML = "Surrender";
            this.buttons.appendChild(this.surrenderButton);

            game.appendChild(this.buttons);
    
            linebreak = document.createElement("br");
            this.buttons.appendChild(linebreak);
        }
    }
    
    get score() {
        var sum = [0];
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
    draw() {
        // remove all children from an element
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].draw(this.svg, i * 30 + 0, 0);
        }
        this.scoreText.innerHTML = `${this.score}`;
    }
    hit() {
        let card = deck.pop();
        if (this.holder.name == "Dealer" && this.cards.length == 0) {
            card.flip();
        }
        this.cards.push(card);
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        card.draw(this.svg, (this.cards.length - 1) * 30 + 0, 0);
        this.scoreText.innerHTML = `${this.score}`;
        if (this.holder.name != "Dealer" && this.score.length == 0) {
            this.holder.money -= this.holder.bet;
            this.holder.update();
            this.buttons.setAttribute('style', 'display: none');
        }
    }
    stand() {
        dealer.hands[0].cards[0].flip();
        dealer.hands[0].scoreText.innerHTML = `${dealer.hands[0].score}`;
        dealer.hands[0].draw();
        // While dealer's highest score is less than 17, hit
        while (dealer.hands[0].score[dealer.hands[0].score.length - 1] < 17) {
            dealer.hands[0].hit();
        }
        if (this.score.length == 0 || this.score[this.score.length - 1] < dealer.hands[0].score[dealer.hands[0].score.length - 1]) {
            this.holder.money -= this.holder.bet;
        }
        else if (dealer.hands[0].score.length == 0 || this.score[this.score.length - 1] > dealer.hands[0].score[dealer.hands[0].score.length - 1]) {
            this.holder.money += this.holder.bet;
        }
        this.holder.update();
        this.buttons.setAttribute('style', 'display: none');
    }
    double() {
        this.bet = 200;
        this.hit();
        this.stand();
    }
    split() {
        if (this.cards.length == 2 && this.cards[0].points == this.cards[1].points) {
            var newHand = new Hand(this.holder);
            this.holder += newHand;
            newHand.cards.push(this.cards.pop());
            this.draw();
            newHand.draw();
        }
    }
    surrender() {
        // do nothing
    }

}

class Deck {
    // Create an unshuffled deck of cards
    static createDeck() {
        var cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(suit, value));
            }
        }
        return cards;
    }
    // Shuffle the deck
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
    // Flip the card
    flip() {
        this.faceUp = !this.faceUp;
    }

    draw(svg, x, y) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '70');
        rect.setAttribute('x', x + 10);
        rect.setAttribute('y', y + 10);
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        rect.setAttribute('fill', this.faceUp ? 'white' : 'white');
        svg.appendChild(rect);

        if (this.faceUp) {
            var color = this.suit % 2 == 0 ? "black" : "red";
        
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('dominant-baseline', 'hanging');
            text.setAttribute('x', x + 15);
            text.setAttribute('y', y + 15);
            text.setAttribute('fill', color);
            text.innerHTML = this.rank;
            svg.appendChild(text);
        
            text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', x + 15);
            text.setAttribute('y', y + 45);
            text.setAttribute('fill', color);
            text.innerHTML = this.symbol;
            svg.appendChild(text);
        }
        else {
            rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('width', '48');
            rect.setAttribute('height', '68');
            rect.setAttribute('x', x + 11);
            rect.setAttribute('y', y + 11);
            rect.setAttribute('rx', '5');
            rect.setAttribute('ry', '5');
            rect.setAttribute('fill', 'darkblue');
            rect.setAttribute('filter', 'none');
            svg.appendChild(rect);
        }
    }
}

function start() {
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    player.hands = [];
    dealer.hands = [];

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
    
    // Check for blackjack on deal
    
    if (player.hands[0].score.includes(21)) {
        player.money += player.bet;
        player.update();
        player.hands[0].buttons.setAttribute('style', 'display: none');
    }
}

var game = document.getElementById("game");
var deck;
var dealer = new Player("Dealer");
var player = new Player("Alex");

start();