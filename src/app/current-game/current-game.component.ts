import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as lodash from 'lodash';
import { CardCombination } from 'src/model/card-combination';
import { CardViewCombination } from 'src/model/card-combination-view';
import { CardView } from 'src/model/card-view';
import { toCardCombinations, toCardViewCombinations, toCardViews, toCards } from 'src/model/model-view-conversions';
import { Card, allSameRank } from '../../model/card';
import { Game } from '../../model/game';
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
  // alternatively: create GameBackend and GameRepresentation classes, where the representation has the cardView
  playerCards: CardView[] = [];
  computerCards: CardView[] = [];
  discardPile: CardViewCombination[] = [];

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
    this.playerCards = toCardViews(this.game.cardsPerPlayer[0], true, false);
    this.computerCards = toCardViews(this.game.cardsPerPlayer[1], true, false);
    this.discardPile = toCardViewCombinations(this.game.discardPile, true, false);
  }

  // this or the "playStagedCards()" will later be a call to the server
  // and the server will check if it accepts the move
  private transferStatesToGame() {
    this.game.cardsPerPlayer[0] = toCards(this.playerCards);
    this.game.cardsPerPlayer[1] = toCards(this.computerCards);
    this.game.discardPile = toCardCombinations(this.discardPile);
  }

  toggleCardFaceUp(cardView: CardView): void {
    // Toggle the faceUp state of the clicked card
    const cardElement = document.getElementById(`card-${cardView.card.id}`);
    if (cardElement) {
      cardElement.classList.toggle('face-down');
    }
  }

  toggleStagedProperty(cardView: CardView) {
    if (cardView.staged) {
      this.unstage(cardView);
    } else {
      this.tryStaging(cardView);
    }
    this.updatePlayerCardsCanBeStaged();

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  private unstage(...cardViews: CardView[]) {
    cardViews.forEach(c => c.staged = false);
  }

  private tryStaging(clickedCard: CardView) {
    if (!clickedCard.canBeStaged) {
      // TODO: side vibration
      return; // the click will have no effect
    } else {
      this.stageCard(clickedCard);
    }
  }

  private stageCard(clickedCard: CardView) {
    clickedCard.staged = true;
  }

  playStagedCards() {
    this.logIfInvalidState();
    const stagedCards: CardView[] = this.stagedCards();
    this.unstage(...stagedCards);
    const cardViewCombination: CardViewCombination = new CardViewCombination(stagedCards);
    this.addToDiscardPile(cardViewCombination);
    this.removeFromPlayer(stagedCards);
    this.transferStatesToGame();
    this.game.turnCount++;
    this.doAfterPlayersTurn();
  }

  private logIfInvalidState() {
    if (this.stagedCards().length == 0) {
      const errorMessage = "Implementation error - check why this method was called.";
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private addToDiscardPile(cardViewCombination: CardViewCombination): void {
    this.discardPile.push(cardViewCombination);
  }

  private removeFromPlayer(cardsToRemove: CardView[]): void {
    // when this will be done on the server, we need to check against
    // the discard pile if the staged cards can really be played
    // (to prevent corrupting the game state)
    this.playerCards = this.playerCards.filter(playerCard => !cardsToRemove.includes(playerCard));
  }

  private doAfterPlayersTurn() {
    this.disablePlayerButtons();
    if (this.playerCards.length === 0) {
      this.openGameVictoryModal(true);
    } else {
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

  // needs to be enhanced - currently using cardsPerPlayer[1]
  private makeComputerTurn(): void {
    let cardCombinationToBeat: CardCombination = this.game.topOfDiscardPile();
    let cardCombinationToPlay: CardCombination | undefined = this.nextHigherCardFromComputer(cardCombinationToBeat);
    if (cardCombinationToPlay === undefined) {
      this.makeComputerPass();
    } else {
      this.game.cardsPerPlayer[1] = this.game.cardsPerPlayer[1].filter(c => !lodash.includes(cardCombinationToPlay?.cards, c));
      this.game.discardPile.push(cardCombinationToPlay);
    }
  }

  // TODO: not return undefined but a special CardCombination object?
  private nextHigherCardFromComputer(cardCombination: CardCombination): CardCombination | undefined {
    const computerCards: Card[] = this.game.cardsPerPlayer[1];
    // for now, let the computer always pass if the player played a combination instead of a single card
    if (cardCombination.cards.length > 1) {
      return undefined;
    } else {
      const cardToBeat: Card = cardCombination.cards[0];
      // for now, simply take the first encountered card that is higher than the card to beat
      for (const card of computerCards) {
        if (card.rank > cardToBeat.rank) {
          return new CardCombination([card]);
        }
      }
    }
    return undefined;
  }

  private makeComputerPass(): void {
    this.game.discardPile.push(CardCombination.TURN_PASSED_PLACEHOLDER);
    alert("Computer passes");
  }

  private updatePlayerCardsCanBeStaged(): void {
    for (const playerCard of this.playerCards) {
      playerCard.canBeStaged = this.isCompatibleWithDiscardPile(playerCard) && this.isCompatibleWithStage(playerCard);
    }
  }

  private isCompatibleWithDiscardPile(playerCard: CardView): boolean {
    const combinationToBeat: CardCombination = this.game.topOfDiscardPile();
    return playerCard.isRankHigherThan(combinationToBeat);
  }

  private isCompatibleWithStage(cardView: CardView): boolean {
    // TODO handle more than single cards: for now, we simply allow staging, if nothing else was staged yet
    // logic:
    // if player starts a new round (last played cards were "pass" by all predecessors)
    // or if the new combination are all of the same rank 
    return this.isStageEmpty() ||
           allSameRank(...toCards(this.stagedCards()), cardView.card);
  }

  private isStageEmpty(): boolean {
    return this.stagedCards().length === 0;
  }

  pass(): void {
    this.game.discardPile.push(CardCombination.TURN_PASSED_PLACEHOLDER);
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

  stagedCards(): CardView[] {
    return this.playerCards.filter(card => card.staged);
  }

}