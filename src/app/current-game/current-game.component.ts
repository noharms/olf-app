import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Card } from 'src/model/card';
import { CardCombination } from 'src/model/card-combination';
import { CardViewCombination } from 'src/model/card-combination-view';
import { CardView } from 'src/model/card-view';
import { toCardViewCombinations } from 'src/model/model-view-conversions';
import { Stage } from 'src/model/stage';
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

  cardViews: CardView[][] = [];
  stage: Stage = Stage.empty([]);
  isComputersTurn: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private gameService: GameService,
    private aiService: ComputerAiService
  ) { }

  ngOnInit(): void {
    this.stage = Stage.empty(this.game().currentPlayerCards())
    this.updateCardViewsFromGame();
  }

  private game(): Game {
    return this.gameService.getGame();
  }

  // this creates "CardView" objects from the current game, which have a notion of "staged" or not that impacts their representation
  // --> whenever the game or the stage changes, this needs to be called to get an updated view
  updateCardViewsFromGame(): void {
    const cardViews: CardView[][] = new Array(this.game().playerCount());
    for (let i = 0; i < this.game().playerCount(); ++i) {
      cardViews[i] = this.game().cardsPerPlayer[i].map(
        c => {
          const isAlreadyStaged: boolean = this.stage.contains(c);
          const canBeStaged: boolean = this.stage.canStage(c, this.game().topOfDiscardPile());
          return new CardView(c, true, isAlreadyStaged, canBeStaged)
        }
      );
    }
    this.cardViews = cardViews;
  }

  toggleCardFaceUp(cardView: CardView): void {
    cardView.faceUp = !cardView.faceUp;
  }

  toggleStagedProperty(cardView: CardView) {
    if (cardView.staged) {
      this.unstage(cardView);
    } else {
      this.tryStaging(cardView);
    }
    this.updateCardViewsFromGame();

    // Optionally, you can implement additional logic here, such as checking game conditions

    // Manually trigger change detection
    //this.cdr.detectChanges();
  }

  private unstage(...cardViews: CardView[]) {
    for (let c of cardViews) {
      this.stage.unstageCard(c.card);
    }
  }

  private tryStaging(clickedCard: CardView) {
    if (!this.stage.canStage(clickedCard.card, this.game().topOfDiscardPile())) {
      // TODO: side vibration
      return; // the click will have no effect
    } else {
      this.stage.stageCard(clickedCard.card);
    }
  }

  pass(): void {
    this.gameService.handlePlayedCards(CardCombination.TURN_PASSED_PLACEHOLDER);
    this.doAfterPlayersTurn();
  }

  playStagedCards() {
    this.logIfInvalidState();
    this.gameService.handlePlayedCards(new CardCombination(this.stage.stagedCards));
    this.stage.clear();
    this.doAfterPlayersTurn();
  }

  private logIfInvalidState() {
    if (this.stage.isEmpty()) {
      const errorMessage = "Implementation error - check why this method was called.";
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private doAfterPlayersTurn() {
    this.disablePlayerButtons();
    const playerCards: Card[] = this.game().cardsPerPlayer[0];
    if (playerCards.length === 0) {
      this.openGameVictoryModal(true);
    } else {
      this.makeComputerTurn();
      const computerCards: Card[] = this.game().cardsPerPlayer[1];
      if (computerCards.length === 0) {
        this.openGameVictoryModal(false);
      }
    }
    this.updateCardViewsFromGame();
  }

  private disablePlayerButtons(): void {
    this.isComputersTurn = true;
    setTimeout(() => this.isComputersTurn = false, COMPUTER_TURN_TIME_IN_MILLISECONDS);
  }

  // needs to be enhanced - currently using cardsPerPlayer[1]
  private makeComputerTurn(): void {
    this.gameService.handlePlayedCards(this.pickCardsComputer());
  }

  private pickCardsComputer(): CardCombination {
    let cardCombiToBeat: CardCombination = this.game().topOfDiscardPile();
    let cardCombiComputer: CardCombination = this.aiService.cardCombinationFromComputer(this.game().cardsPerPlayer[1], cardCombiToBeat);
    if (cardCombiComputer === CardCombination.TURN_PASSED_PLACEHOLDER) {
      alert("Computer passes");
    }
    return cardCombiComputer;
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

  discardPileView(): CardViewCombination[] {
    return toCardViewCombinations(this.game().discardPile, true, false);
  }

}