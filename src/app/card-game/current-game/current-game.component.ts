import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Card } from '../card/model/card';
import { RANKS_2_TO_10, Rank } from '../card/model/rank';
import { Suit } from '../card/model/suit';
import { DecoratedCard, fromCards } from '../card/model/decorated-card';
import { Game } from '../model/game';
import { createGame } from '../model/game-factory';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  game: Game | undefined; 
  playerCards: DecoratedCard[] = [];
  computerCards: DecoratedCard[] = [];
  discardPile: DecoratedCard[] = [];

  stagedCards: DecoratedCard[] = [];

  //constructor(private cdr: ChangeDetectorRef) { }  
  constructor() { }

  ngOnInit(): void {
    this.game = createGame();

    this.playerCards = fromCards(this.game.cardsPerPlayer[0], true);
    this.computerCards = fromCards(this.game.cardsPerPlayer[1], true);
    this.discardPile = fromCards(this.game.discardPile, true);
        
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
    let stagedCard = this.playerCards.find((c) => c === styledCard);
    if (stagedCard === undefined) {
      throw "card not found"
    } else {
      stagedCard.staged = true;
      this.stagedCards.push(stagedCard);
    }

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  playStagedCards() {
    // this.discardPile = [...this.discardPile, ...this.stagedCards];
    this.playerCards = this.playerCards.filter(c => !c.staged);
    for (const card of this.stagedCards) {
      this.discardPile.push(card);
      card.staged = false;
    }
    this.stagedCards = []
  }
}
