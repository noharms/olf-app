import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Card } from '../card/model/card';
import { RANKS_2_TO_10, Rank } from '../card/model/rank';
import { Suit } from '../card/model/suit';
import { StyledCard } from '../card/model/styled-card';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  initialCardList: StyledCard[] = [];
  playerCards: StyledCard[] = [];
  computerCards: StyledCard[] = [];
  discardPile: StyledCard[] = [];


  // Optional: Add a highlighted card functionality if needed
  highlightedCard: StyledCard | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.createGame();
    this.distributeInitialCards();
  }

  createGame(): void {
    // Create cards for the initial game stack
    let id = 0;
    const suits = [Suit.Blue, Suit.Green, Suit.Colorless];
    const ranks = RANKS_2_TO_10;
    for (const suit of suits) {
      for (const rank of ranks) {
        const newCard = { id: id, rank: rank, suit: suit };
        const newStyledCard = { card: newCard, faceUp: true };
        this.initialCardList.push(newStyledCard);
        ++id;
      }
    }
    const colorlessCards: StyledCard[] = [];
    for (let i = 0; i < 4; i++) {
      const newCard = { id: id + i, rank: Rank.One, suit: Suit.Colorless };
      const newStyledCard = { card: newCard, faceUp: true};
      colorlessCards.push(newStyledCard);
    }
    this.initialCardList.push(...colorlessCards);
    this.shuffleCards(this.initialCardList);
  }

  distributeInitialCards(): void {
    this.playerCards = this.initialCardList.splice(0, 13);
    this.computerCards = this.initialCardList.splice(0, 13);
  }

  shuffleCards(cards: StyledCard[]): void {
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


  playCard(styledCard: StyledCard): void {
    // Remove the clicked card from the player's hand
    this.playerCards = this.playerCards.filter((c) => c !== styledCard);

    // Add the card to the top of the discard pile
    this.discardPile.push(styledCard);

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Clear any highlighted card
    this.clearHighlightedCard();

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  toggleCardFaceUp(styledCard: StyledCard): void {
    // Toggle the faceUp state of the clicked card
    const cardElement = document.getElementById(`card-${styledCard.card.id}`);
    if (cardElement) {
      cardElement.classList.toggle('face-down');
    }
  }

  isHighlighted(styledCard: StyledCard): boolean {
    // Check if the card is the highlighted card
    return styledCard === this.highlightedCard;
  }

  setHighlightedCard(styledCard: StyledCard | null): void {
    this.highlightedCard = styledCard;
  }

  clearHighlightedCard(): void {
    this.highlightedCard = null;
  }
}
