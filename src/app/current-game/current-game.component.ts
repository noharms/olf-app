import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardCombination } from 'src/model/card-combination';
import { CardViewCombination } from 'src/model/card-combination-view';
import { CardView } from 'src/model/card-view';
import { toCardCombinations, toCardViewCombinations, toCardViews, toCards } from 'src/model/model-view-conversions';
import { allSameRank } from '../../model/card';
import { Game } from '../../model/game';
import { ComputerAiService } from '../computer-ai.service';
import { GameService } from '../game.service';
import { GameOverModalComponent, NEW_GAME_KEY, REDIRECT_TO_STATS_KEY } from './game-over-modal/game-over-modal.component';

const COMPUTER_TURN_TIME_IN_MILLISECONDS = 3000;
@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  // TODO: remove these references and use game.x fields directly? check out "transferStates" methods below. also, can we do this in the html?
  // alternatively: create GameBackend and GameRepresentation classes, where the representation has the cardView
  playerCards: CardView[] = [];
  computerCards: CardView[] = [];
  discardPile: CardViewCombination[] = [];

  isComputersTurn: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private gameService: GameService,
    private aiService: ComputerAiService
  ) { }

  ngOnInit(): void {
    this.transferStatesFromGame();
    // this sets properties on the cards that control visual effects like pulsation of cards that can be staged
    // -> consider making that static methods instead of state on the cards
    this.updatePlayerCardsCanBeStaged();
  }

  private game(): Game {
    return this.gameService.getGame();
  }

  private transferStatesFromGame() {
    this.playerCards = toCardViews(this.game().cardsPerPlayer[0], true, false);
    this.computerCards = toCardViews(this.game().cardsPerPlayer[1], true, false);
    this.discardPile = toCardViewCombinations(this.game().discardPile, true, false);
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
  
  pass(): void {
    this.gameService.handlePlayedCards(CardCombination.TURN_PASSED_PLACEHOLDER);
    this.doAfterPlayersTurn();
  }

  playStagedCards() {
    this.logIfInvalidState();
    const stagedCards: CardView[] = this.stagedCards();
    this.unstage(...stagedCards);
    const cardViewCombination: CardViewCombination = new CardViewCombination(stagedCards);
    this.gameService.handlePlayedCards(cardViewCombination.toModel());
    this.doAfterPlayersTurn();
  }

  private logIfInvalidState() {
    if (this.stagedCards().length == 0) {
      const errorMessage = "Implementation error - check why this method was called.";
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
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
    let cardCombiToBeat: CardCombination = this.game().topOfDiscardPile();
    let cardCombiComputer: CardCombination | undefined = this.aiService.cardCombinationFromComputer(this.game().cardsPerPlayer[1], cardCombiToBeat);
    if (cardCombiComputer === undefined) {
      cardCombiComputer = CardCombination.TURN_PASSED_PLACEHOLDER;
      alert("Computer passes");
    }
    this.gameService.handlePlayedCards(cardCombiComputer);    
  }

  canPlayStagedCards(): boolean {
    let cardCombi: CardCombination = new CardCombination(this.stagedCards().map(cardView => cardView.card));
    let cardCombiToBeat: CardCombination = this.game().topOfDiscardPile();
    return this.game().discardPile.length === 0 || cardCombiToBeat === CardCombination.TURN_PASSED_PLACEHOLDER || cardCombi.canBeat(cardCombiToBeat);
  }

  private updatePlayerCardsCanBeStaged(): void {
    for (const playerCard of this.playerCards) {
      playerCard.canBeStaged = this.isCompatibleWithDiscardPile(playerCard) && this.isCompatibleWithStage(playerCard);
    }
  }

  private isCompatibleWithDiscardPile(playerCard: CardView): boolean {
    const combinationToBeat: CardCombination = this.game().topOfDiscardPile();
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