class Player {
    constructor(name, hand = []) {
        this.name = name;
        this.hand = hand;
        this.score = 0;
        this.standed = false;

        // Create score display

        this.scoreDisplay = document.createElement("div");
        this.scoreDisplay.innerHTML = `<b>${this.name}</b>: ${this.score}`;
        document.body.appendChild(this.scoreDisplay);

        // Create canvas for cards

        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 100;
        document.body.appendChild(this.canvas);

    }
    hit() {
        let card = deck.pop();
        if (this.name == "Dealer" && this.hand.length == 0) {
            card.flip();
        }
        card.draw(this.canvas.getContext("2d"), this.hand.length * 30 + 15, 15);
        this.hand.push(card);
        if (card.value > 10) {
            this.score += 10;
        }
        else {
            this.score += card.value;
        }
        this.scoreDisplay.innerHTML = `<b>${this.name}</b>: ${this.score}`;
    }
    stand() {
        this.standed = true;
    }
    double() {
        this.hit();
        this.stand();
    }
    split() {
        // do nothing
    }
    surrender() {
        // do nothing
    }

}

class Deck {
    static default() {
        var cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(suit, value));
            }
        }
        return cards;
    }
    static shuffle(oldCards) {
        var newCards = oldCards;
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
                return "♦";
            case 3:
                return "♣";
        }
    }
    draw(ctx, x, y) {
        if (this.faceUp) {
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, 50, 70);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, 50, 70);
            ctx.font = "20px Arial";
            if (this.suit == 1 || this.suit == 2) {
                ctx.fillStyle = "red";
            }
            else {
                ctx.fillStyle = "black";
            }
            ctx.fillText(this.rank, x + 5, y + 20);
            ctx.fillText(this.symbol, x + 5, y + 40);
        }
        else {
            ctx.fillStyle = "darkblue";
            ctx.fillRect(x, y, 50, 70);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, 50, 70);
        }
    }
    flip() {
        this.faceUp = !this.faceUp;
    }
}

var deck = Deck.default();
deck = Deck.shuffle(deck);

let dealer = new Player("Dealer");
let player = new Player("Player");

dealer.hit();
dealer.hit();