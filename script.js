class Player {
    constructor(name) {
        this.name = name 
        this.hands = []
    }
}
class Hand {
    constructor(cards = []) {
        this.cards = cards;

        /*this.heading = document.createElement("h2");
        this.heading.innerHTML = `${this.score}`;
        document.body.appendChild(this.heading);*/

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', this.cards.length * 30 + 50);
        this.svg.setAttribute('height', '70');
        document.body.appendChild(this.svg);

        let linebreak = document.createElement("br");
        document.body.appendChild(linebreak);

        this.hitButton = document.createElement("button");
        this.hitButton.onclick = () => this.hit();
        this.hitButton.innerHTML = "Hit";
        document.body.appendChild(this.hitButton);

        this.standButton = document.createElement("button");
        this.standButton.onclick = () => this.stand();
        this.standButton.innerHTML = "Stand";
        document.body.appendChild(this.standButton);

        this.splitButton = document.createElement("button");
        this.splitButton.onclick = () => this.split();
        this.splitButton.innerHTML = "Split";
        document.body.appendChild(this.splitButton);

        linebreak = document.createElement("br");
        document.body.appendChild(linebreak);
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
    hit() {
        let card = deck.pop();
        this.cards.push(card);
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 50);
        card.draw(this.svg, (this.cards.length - 1) * 30 + 0, 0);
    }
    stand() {
        dealer.cards[0].flip();
        dealer.drawCard();
        dealer.heading.innerHTML = `<b>${dealer.name}</b>: ${dealer.score}`;
        // While dealer's highest score is less than 17, hit
        while (dealer.score[dealer.score.length - 1] < 17) {
            dealer.hit();
        }
        document.getElementById("buttons").style.display = "none";
        document.getElementById("restartButton").style.display = "inline";
        if (heading.innerHTML == "Blackjack") {
            if (player.score[player.score.length - 1] > dealer.score[dealer.score.length - 1]) {
                heading.style.color = "lime";
                heading.innerHTML = "You win!";
            }
            else if (dealer.score[dealer.score.length - 1] > player.score[player.score.length - 1]) {
                heading.style.color = "red";
                heading.innerHTML = "You lose!";
            }
            else {
                heading.style.color = "black";
                heading.innerHTML = "Draw";
            }
        }
    }
    double() {
        // do nothing
    }
    split() {
        // do nothing
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
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        rect.setAttribute('fill', 'white');
        svg.appendChild(rect);

        var color = this.suit % 2 == 0 ? "black" : "red";
    
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('dominant-baseline', 'hanging');
        text.setAttribute('x', x + 5);
        text.setAttribute('y', y + 5);
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('font-size', '20');
        text.setAttribute('fill', color);
        text.innerHTML = this.rank;
        svg.appendChild(text);
    
        text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', x + 5);
        text.setAttribute('y', y + 35);
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('font-size', '20');
        text.setAttribute('fill', color);
        text.innerHTML = this.symbol;
        svg.appendChild(text);
    }
}

var deck = Deck.shuffle(Deck.createDeck());

var hand = new Hand();
hand.hit();
hand.hit();

var dealer = new Hand();
dealer.hit();
dealer.hit();