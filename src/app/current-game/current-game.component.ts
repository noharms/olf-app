import { Component, OnInit } from '@angular/core';
import { Card, TURN_PASSED_PLACEHOLDER_CARD } from '../../model/card';
import { DecoratedCard, fromCards, toCards } from '../../model/decorated-card';
import { Game, topOfDiscardPile } from '../../model/game';
import { createGame } from '../../model/game-factory';
import { Rank } from '../../model/rank';
import { Suit } from '../../model/suit';

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
    this.playerCards = fromCards(this.game.cardsPerPlayer[0], true, true);
    this.computerCards = fromCards(this.game.cardsPerPlayer[1], true, false);
    this.discardPile = fromCards(this.game.discardPile, true, false);
  }

  // this or the "playStagedCards()" will later be a call to the server
  // and the server will check if it accepts the move
  private transferStatesToGame() {
    this.game.cardsPerPlayer[0] = toCards(this.playerCards);
    this.game.cardsPerPlayer[1] = toCards(this.computerCards);
    this.game.discardPile = toCards(this.discardPile);
  }

  toggleCardFaceUp(decoratedCard: DecoratedCard): void {
    // Toggle the faceUp state of the clicked card
    const cardElement = document.getElementById(`card-${decoratedCard.card.id}`);
    if (cardElement) {
      cardElement.classList.toggle('face-down');
    }
  }

  stageCard(decoratedCard: DecoratedCard) {
    // check if the clicked card can be staged

    // Remove the clicked card from the player's hand
    let stagedCard = this.playerCards.find((c) => c === decoratedCard);
    if (stagedCard === undefined) {
      throw "card not found"
    } else {
      if (stagedCard.staged === false) {
        stagedCard.staged = true;
        stagedCard.canBePlayed = false;
        this.stagedCards.push(stagedCard);
      }
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
    this.updatePlayersOptions();
  }

  private removeStagedCardsFromPlayer() {
    // when this will be done on the server, we need to check against
    // the discard pile if the staged cards can really be played
    // (to prevent corrupting the game state)
    this.playerCards = this.playerCards.filter(c => !c.staged);
  }

  private pushStagedCardsToDiscardPile() {
    for (const card of this.stagedCards) {
      this.discardPile.push(card);
      card.staged = false;
    }
    this.stagedCards = []
  }

  // needs to be enhanced - currently using cardsPerPlayer[1]
  private makeComputerTurn() {
    let topCard: Card = topOfDiscardPile(this.game);
    let playCard: Card | undefined = this.nextHigherCardFromComputer(topCard);
    if (playCard === undefined) {
      this.makeComputerPass();
    } else {
      this.game.cardsPerPlayer[1] = this.game.cardsPerPlayer[1].filter(c => c !== playCard);
      this.game.discardPile.push(playCard);
    }
  }
  
  private nextHigherCardFromComputer(topCard: Card): Card | undefined {
    for (const card of this.game.cardsPerPlayer[1]) {
      if (card.rank > topCard.rank) {
        return card;
      }
    }
    return undefined;
  }
  
  private makeComputerPass() {
    this.game.discardPile.push(TURN_PASSED_PLACEHOLDER_CARD);
    alert("Computer passes");
  }

  private updatePlayersOptions() {
    for (const decoratedCard of this.playerCards) {
      decoratedCard.canBePlayed = decoratedCard.card.rank > topOfDiscardPile(this.game).rank;
    }
  }

  pass() {    
    this.stagedCards = [];
    this.game.discardPile.push(TURN_PASSED_PLACEHOLDER_CARD);
    this.game.turnCount++;
    this.makeComputerTurn();
    this.transferStatesFromGame();
    this.updatePlayersOptions();
  }
  
}
