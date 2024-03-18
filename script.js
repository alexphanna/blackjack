class Deck {
    constructor() {
        this.cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                this.cards.push(new Card(suit, value));
            }
        }
    }
    shuffle() {
        for (let i = 0; i < this.cards.length; i++) {
            let j = Math.floor(Math.random() * this.cards.length);
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    draw() {
        return this.cards.pop();
    }

}

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
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
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.roundRect(x, y, 50, 70, 5);
        ctx.stroke();
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
}

i = 0;
var deck = new Deck();
deck.shuffle();

function hit() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d");
    let card = deck.draw();
    card.draw(ctx, i++ * 60, 100);
}