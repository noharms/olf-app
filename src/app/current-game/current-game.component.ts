import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Card, TURN_PASSED_PLACEHOLDER_CARD } from '../../model/card';
import { DecoratedCard, fromCards, toCards } from '../../model/decorated-card';
import { Game, topOfDiscardPile } from '../../model/game';
import { createGame } from '../../model/game-factory';
import { GameOverModalComponent, NEW_GAME_KEY, REDIRECT_TO_STATS_KEY } from './game-over-modal/game-over-modal.component';

const COMPUTER_TURN_TIME_IN_MILLISECONDS = 3000;
@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  game!: Game;
  // TODO: remove these references and use game.x fields directly? check out "transferStates" methods below. also, can we do this in the html?
  playerCards: DecoratedCard[] = [];
  computerCards: DecoratedCard[] = [];
  discardPile: DecoratedCard[] = [];

  isComputersTurn: boolean = false;

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.game = createGame();
    this.transferStatesFromGame();
    // this sets properties on the cards that control visual effects like pulsation of cards that can be staged
    // -> consider making that static methods instead of state on the cards
    this.updatePlayerCardsCanBeStaged();
  }

  private transferStatesFromGame() {
    this.playerCards = fromCards(this.game.cardsPerPlayer[0], true, false);
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

  toggleStagedProperty(decoratedCard: DecoratedCard) {
    if (decoratedCard.staged) {
      this.unstage(decoratedCard);
    } else {
      this.tryStaging(decoratedCard);
    }
    this.updatePlayerCardsCanBeStaged();

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  private unstage(decoratedCard: DecoratedCard) {
    decoratedCard.staged = false;
  }

  private tryStaging(clickedCard: DecoratedCard) {
    if (!clickedCard.canBeStaged) {
      // TODO: side vibration
      return; // the click will have no effect
    } else {
      this.stageCard(clickedCard);
    }
  }

  private stageCard(clickedCard: DecoratedCard) {
    const stagedCards: DecoratedCard[] = this.stagedCards();
    if (stagedCards.length !== 0) {
      // there can be always only one card staged at the moment
      this.unstage(stagedCards[0]);
    }
    clickedCard.staged = true;
  }

  playStagedCards() {
    const stagedCards: DecoratedCard[] = this.stagedCards();
    // this.discardPile = [...this.discardPile, ...this.stagedCards];
    if (stagedCards.length == 0) {
      return;
    }
    this.pushToDiscardPile(stagedCards);
    this.removeFromPlayer(stagedCards);
    this.transferStatesToGame();
    this.game.turnCount++;
    if (this.playerCards.length === 0) {
      this.openGameVictoryModal(true);
    } else {
      this.disablePlayerButtons();
      this.makeComputerTurn();
      this.transferStatesFromGame();
      if (this.computerCards.length === 0) {
        this.openGameVictoryModal(false);
      } else {
        this.updatePlayerCardsCanBeStaged();
      }
    }
  }

  private disablePlayerButtons(): void {
    this.isComputersTurn = true;
    setTimeout(() => this.isComputersTurn = false, COMPUTER_TURN_TIME_IN_MILLISECONDS);
  }

  private removeFromPlayer(cardsToRemove: DecoratedCard[]): void {
    // when this will be done on the server, we need to check against
    // the discard pile if the staged cards can really be played
    // (to prevent corrupting the game state)
    this.playerCards = this.playerCards.filter(playerCard => !cardsToRemove.includes(playerCard));
  }

  private pushToDiscardPile(cardsToDiscard: DecoratedCard[]): void {
    for (const card of cardsToDiscard) {
      this.discardPile.push(card);
      this.unstage(card);
    }
  }

  // needs to be enhanced - currently using cardsPerPlayer[1]
  private makeComputerTurn(): void {
    let cardToBeat: Card = topOfDiscardPile(this.game);
    let cardToPlay: Card | undefined = this.nextHigherCardFromComputer(cardToBeat);
    if (cardToPlay === undefined) {
      this.makeComputerPass();
    } else {
      this.game.cardsPerPlayer[1] = this.game.cardsPerPlayer[1].filter(c => c !== cardToPlay);
      this.game.discardPile.push(cardToPlay);
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

  private makeComputerPass(): void {
    this.game.discardPile.push(TURN_PASSED_PLACEHOLDER_CARD);
    alert("Computer passes");
  }

  private updatePlayerCardsCanBeStaged(): void {
    for (const playerCard of this.playerCards) {
      playerCard.canBeStaged = this.isHigherThanTopOfDiscardPile(playerCard) && this.isCompatibleWithStage(playerCard);
    }
  }

  private isHigherThanTopOfDiscardPile(playerCard: DecoratedCard): boolean {
    const cardToBeat = topOfDiscardPile(this.game);
    return playerCard.card.rank > cardToBeat.rank;
  }

  private isCompatibleWithStage(playerCard: DecoratedCard): boolean {
    // TODO handle more than single cards: for now, we simply allow staging, if nothing else was staged yet
    return this.stagedCards().length === 0;
  }

  pass(): void {
    this.game.discardPile.push(TURN_PASSED_PLACEHOLDER_CARD);
    this.game.turnCount++;
    this.makeComputerTurn();
    this.transferStatesFromGame();
    if (this.computerCards.length === 0) {
      this.openGameVictoryModal(false);
    } else {
      this.updatePlayerCardsCanBeStaged();
    }
  }

  private openGameVictoryModal(hasPlayerWon: boolean): void {
    const modalRef = this.modalService.open(
      GameOverModalComponent,
      { backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.message = hasPlayerWon ? 'Congratulations! You won the game!' : 'You have lost this game.';

    modalRef.result.then(
      (result) => {
        if (result === NEW_GAME_KEY) {
          this.ngOnInit();
        } else if (result === REDIRECT_TO_STATS_KEY) {
          this.navigateToStats();
        }
      },
      (dismissReason) => {
        // Handle modal dismiss
      }
    );
  }

  private navigateToStats() {
    this.router.navigate(['/olf/home']);
  }

  stagedCards(): DecoratedCard[] {
    return this.playerCards.filter(card => card.staged);
  }

}

