class Player {
    constructor(name) {
        this.name = name 
        this.hands = []

        this.heading = document.createElement("h2");
        this.heading.innerHTML = `${this.name}`;
        document.body.appendChild(this.heading);
    }
    draw() {
        for (let hand of this.hands) {
            hand.draw()
        }
    }
}
class Hand {
    constructor(isDealer = false, cards = []) {
        this.cards = cards;

        this.div = document.createElement("div");

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', this.cards.length * 30 + 70);
        this.svg.setAttribute('height', '90');
        this.svg.setAttribute('style', 'display: inline-block');
        this.div.appendChild(this.svg);

        this.heading = document.createElement("p");
        this.heading.innerHTML = `${this.score}`;
        this.heading.setAttribute('style', 'display: inline-block');
        this.div.appendChild(this.heading);

        document.body.appendChild(this.div);


        let linebreak = document.createElement("br");
        document.body.appendChild(linebreak);

        if (!isDealer) {
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
        if (this.isDealer && this.cards.length == 0) {
            card.flip();
        }
        this.cards.push(card);
        this.svg.setAttribute('width', (this.cards.length - 1) * 30 + 70);
        card.draw(this.svg, (this.cards.length - 1) * 30 + 0, 0);
        this.heading.innerHTML = `${this.score}`;
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

var deck = Deck.shuffle(Deck.createDeck());


var dealer = new Player("Dealer");

var hand2 = new Hand(true);
hand2.hit();
hand2.hit();
dealer.hands.push(hand2)

var alex = new Player("Alex");

var hand = new Hand();
hand.hit();
hand.hit();
alex.hands.push(hand)