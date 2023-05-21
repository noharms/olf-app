import { Component, OnInit } from '@angular/core';
import { Card } from '../card/model/card';
import { DecoratedCard, fromCards, toCards } from '../card/model/decorated-card';
import { Game, topOfDiscardPile } from '../model/game';
import { createGame } from '../model/game-factory';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  game!: Game;
  playerCards: DecoratedCard[] = [];
  computerCards: DecoratedCard[] = [];
  discardPile: DecoratedCard[] = [];

  stagedCards: DecoratedCard[] = [];

  //constructor(private cdr: ChangeDetectorRef) { }  
  constructor() { }

  ngOnInit(): void {
    this.game = createGame();
    this.transferStatesFromGame();
  }

  private transferStatesFromGame() {
    this.playerCards = fromCards(this.game.cardsPerPlayer[0], true);
    this.computerCards = fromCards(this.game.cardsPerPlayer[1], true);
    this.discardPile = fromCards(this.game.discardPile, true);
  }

  // this or the "playStagedCards()" will later be a call to the server
  // and the server will check if it accepts the move
  private transferStatesToGame() {
    this.game.cardsPerPlayer[0] = toCards(this.playerCards);
    this.game.cardsPerPlayer[1] = toCards(this.computerCards);
    this.game.discardPile = toCards(this.discardPile);
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
    this.removeStagedCardsFromPlayer();
    this.pushStagedCardsToDiscardPile();
    this.transferStatesToGame();
    this.game.turnCount++;
    this.makeComputerTurn();
    this.transferStatesFromGame();
  }

  private pushStagedCardsToDiscardPile() {
    for (const card of this.stagedCards) {
      this.discardPile.push(card);
      card.staged = false;
    }
    this.stagedCards = []
  }

  private removeStagedCardsFromPlayer() {
    this.playerCards = this.playerCards.filter(c => !c.staged);
  }

  // needs to be enhanced - currently using cardsPerPlayer[1]
  makeComputerTurn() {
    let topCard: Card = topOfDiscardPile(this.game);
    let playCard: Card | undefined = this.nextHigherCardFromComputer(topCard);
    if (playCard === undefined) {
      this.makeComputerPass();
    } else {
      this.game.cardsPerPlayer[1] = this.game.cardsPerPlayer[1].filter(c => c !== playCard);
      this.game.discardPile.push(playCard);
    }
  }

  makeComputerPass() {
    // throw new Error('Method not implemented.');
    alert("Computer passes");
  }

  private nextHigherCardFromComputer(topCard: Card): Card | undefined {
    for (const card of this.game.cardsPerPlayer[1]) {
      if (card.rank > topCard.rank) {
        return card;
      }
    }
    return undefined;
  }
}
