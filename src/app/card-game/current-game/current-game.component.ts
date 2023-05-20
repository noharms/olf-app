import { Component, OnInit } from '@angular/core';
import { Card } from '../card/card.model';
import { RANKS_2_TO_10, Rank } from '../card/rank.model';
import { Suit } from '../card/suit.model';
import { CardImpl } from '../card/card-impl.model';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  initialCardList: Card[] = [];
  playerCards: Card[] = [];
  computerCards: Card[] = [];
  discardPile: Card[] = [];

  
  // Optional: Add a highlighted card functionality if needed
  highlightedCard: Card | null = null;

  constructor() { }

  ngOnInit(): void {
    this.createGame();
    this.distributeInitialCards();
  }

  createGame(): void {
    // Create cards for the initial game stack
    const suits = [Suit.Blue, Suit.Green, Suit.Colorless];
    const ranks = RANKS_2_TO_10;
    for (const suit of suits) {
      for (const rank of ranks) {
        this.initialCardList.push({ rank: rank, suit: suit, faceUp: false });
      }
    }
    const colorlessCards: Card[] = Array.from(
      { length: 4 },
      //() => (new CardImpl(Rank.One, Suit.Colorless ))
      () => ({ rank: Rank.One, suit: Suit.Colorless, faceUp: false})
    );
    this.initialCardList.push(...colorlessCards);
    this.shuffleCards(this.initialCardList);
  }

  distributeInitialCards(): void {
    this.playerCards = this.initialCardList.splice(0, 13);
    this.computerCards = this.initialCardList.splice(0, 13);
    this.revealCards(this.playerCards);
    this.revealCards(this.computerCards);
  }

  revealCards(cards: Card[]) {
    cards.forEach(card => {
      card.faceUp = true;
      return;
    });
  }

  shuffleCards(cards: Card[]): void {
    // Shuffle the cards using Fisher-Yates algorithm
    let currentIndex = cards.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }
  }

  
  playCard(card: Card): void {
    // Remove the clicked card from the player's hand
    const cardIndex = this.playerCards.indexOf(card);
    if (cardIndex !== -1) {
      this.playerCards.splice(cardIndex, 1);
    }

    // Add the card to the top of the discard pile
    this.discardPile.push(card);

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Clear any highlighted card
    this.clearHighlightedCard();
  }

  toggleCardFaceUp(card: Card): void {
    // Toggle the faceUp state of the clicked card
    card.faceUp = !card.faceUp;
  }

  isHighlighted(card: Card): boolean {
    // Check if the card is the highlighted card
    return card === this.highlightedCard;
  }

  setHighlightedCard(card: Card | null): void {
    this.highlightedCard = card;
  }

  clearHighlightedCard(): void {
    this.highlightedCard = null;
  }
}
