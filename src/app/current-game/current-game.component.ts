import { Component, OnInit, ViewChild } from '@angular/core';
import { Card, TURN_PASSED_PLACEHOLDER_CARD } from '../../model/card';
import { DecoratedCard, fromCards, toCards } from '../../model/decorated-card';
import { Game, topOfDiscardPile } from '../../model/game';
import { createGame } from '../../model/game-factory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameOverModalComponent } from './game-over-modal/game-over-modal.component';

const COMPUTER_TURN_TIME_IN_MILLISECONDS = 3000;
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

  isComputersTurn: boolean  = false;

  constructor(private modalService: NgbModal) { }

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
    if (!decoratedCard.canBePlayed) {
      return; // the click will have no effect
    }

    // Remove the clicked card from the player's hand
    let stagedCard = this.playerCards.find((c) => c === decoratedCard);
    if (stagedCard === undefined) {
      throw "card not found"
    } else {
      if (stagedCard.staged === false) {        
        if (this.stagedCards.length !== 0) {
          const previouslyStagedCard = this.stagedCards[0];
          previouslyStagedCard.staged = false;
          this.stagedCards = [];
          this.updatePlayersOptions();
        }
        stagedCard.staged = true;
        stagedCard.canBePlayed = false;
        this.stagedCards.push(stagedCard);
      } else {
        stagedCard.staged = false;
        this.stagedCards = this.stagedCards.filter(c => c !== decoratedCard);
        this.updatePlayersOptions();
      }
    }

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  playStagedCards() {
    // this.discardPile = [...this.discardPile, ...this.stagedCards];
    if (this.stagedCards.length == 0) {
      return;
    }
    this.removeStagedCardsFromPlayer();
    this.pushStagedCardsToDiscardPile();
    this.transferStatesToGame();
    this.game.turnCount++;
    if (this.playerCards.length == 0) {
      this.openGameVictoryModal();
    } else {
      this.disablePlayerButtons();
      this.makeComputerTurn();
      this.transferStatesFromGame();
      this.updatePlayersOptions();
    }
  }
  private disablePlayerButtons() {
    this.isComputersTurn = true;
    setTimeout(() => this.isComputersTurn = false, COMPUTER_TURN_TIME_IN_MILLISECONDS);
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
    const unstagedPlayerCards = this.playerCards.filter(c => !c.staged);
    for (const decoratedCard of unstagedPlayerCards) {
      const cardToBeat = topOfDiscardPile(this.game);
      decoratedCard.canBePlayed = decoratedCard.card.rank > cardToBeat.rank;
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

  private openGameVictoryModal() {
    const modalRef = this.modalService.open(
      GameOverModalComponent,
      { backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.message = 'Congratulations! You won the game!';

    modalRef.result.then(
      (result) => {
        if (result === 'new-game') {
          // Handle "New Game" button click
          this.ngOnInit();
        } else if (result === 'my-stats') {
          // Handle "My Stats" button click
          this.navigateToStats();
        }
      },
      (dismissReason) => {
        // Handle modal dismiss
      }
    );
  }

  private navigateToStats() {

  }

}
