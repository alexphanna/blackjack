class Deck {
    constructor() {
        this.cards = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 2; value <= 14; value++) {
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
}

window.onload = function () {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d");
    var deck = new Deck();
    deck.shuffle();
    let card = deck.draw();
    drawCard(ctx, 100, 100, card);
}

function drawCard(ctx, x, y, card) {
    ctx.strokeStyle = "black";
    ctx.roundRect(x, y, 50, 70, 5);
    ctx.stroke();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(card.suit, x + 5, y + 20);
    ctx.fillText(card.value, x + 5, y + 40);
}
