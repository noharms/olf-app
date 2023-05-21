import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Card } from '../card/model/card';
import { RANKS_2_TO_10, Rank } from '../card/model/rank';
import { Suit } from '../card/model/suit';
import { DecoratedCard } from '../card/model/decorated-card';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  initialCardList: DecoratedCard[] = [];
  playerCards: DecoratedCard[] = [];
  computerCards: DecoratedCard[] = [];
  discardPile: DecoratedCard[] = [];

  stagedCards: DecoratedCard[] = [];

  //constructor(private cdr: ChangeDetectorRef) { }  
  constructor() { }

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
    const colorlessCards: DecoratedCard[] = [];
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

  shuffleCards(cards: DecoratedCard[]): void {
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

  toggleCardFaceUp(styledCard: DecoratedCard): void {
    // Toggle the faceUp state of the clicked card
    const cardElement = document.getElementById(`card-${styledCard.card.id}`);
    if (cardElement) {
      cardElement.classList.toggle('face-down');
    }
  }

  stageCard(styledCard: DecoratedCard) {
    // Remove the clicked card from the player's hand
    this.playerCards = this.playerCards.filter((c) => c !== styledCard);

    this.stagedCards.push(styledCard);

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  playStagedCards() {
    this.discardPile.push(...this.stagedCards);
    this.stagedCards = []
  }
}
