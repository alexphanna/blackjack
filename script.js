class Player {
    constructor(name) {
        this.name = name 
        this.hands = []
    }
}
class Hand {
    constructor(cards = []) {
        this.cards = cards;
        this.canvas = document.getElementById(name.toLowerCase() + "-canvas");
    }
    
    get score() {
        var sum = [0];
        for (let card of this.hand) {
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
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].draw(this.canvas.getContext("2d"), (200 - (this.cards.length - 1) * 15 - 25) + (i * 30), 15);
        }
    }
    hit() {
        let card = deck.pop();
        if (this.name == "Dealer" && this.cards.length == 0) {
            card.flip();
        }
        this.cards.push(card);
        this.heading.innerHTML = `<b>${this.name}</b>: ${this.score}`;
        this.drawCard();
        if (this.score.length == 0) {
            document.getElementById("buttons").style.display = "none";
            document.getElementById("restartButton").style.display = "inline";
            if (this.name == "Player") {
                heading.style.color = "red";
                heading.innerHTML = "Bust!"
            }
            else {
                heading.style.color = "lime";
                heading.innerHTML = "You win!"
            }
        }
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
                return "♦";
            case 3:
                return "♣";
        }
    }
    // Flip the card
    flip() {
        this.faceUp = !this.faceUp;
    }
}

function draw() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('width', '50');
    rect.setAttribute('height', '70');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '20');
    rect.setAttribute('rx', '5');
    rect.setAttribute('ry', '5');
    rect.setAttribute('fill', 'white');
    svg.appendChild(rect);

    document.body.appendChild(svg);
}

draw();