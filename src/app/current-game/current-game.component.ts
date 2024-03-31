import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
export const GAME_ID_URL_PARAMETER_NAME = 'gameId';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  game!: Game;
  cardViews: CardView[][] = [];
  stage: Stage = Stage.empty([]);
  isComputersTurn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private gameService: GameService
  ) {
  }

  ngOnInit(): void {
    const substring: string | null = this.route.snapshot.paramMap.get(GAME_ID_URL_PARAMETER_NAME);
    const gameId: number = Number(substring);
    this.gameService.getGame(gameId).subscribe(
      game => {
        if (!game) {
          console.log(`Game id ${gameId} not found. Going back to home.`)
          this.router.navigateByUrl("/");
        } else {
          this.game = game;
          this.stage = Stage.empty(this.game.currentPlayerCards())
          this.cardViews = this.createCardViews();
        }
      }
    );
  }

  // this creates "CardView" objects from the current game and stage;
  // the "CardView"s have a notion of "staged" that impacts their representation
  // --> whenever the game or the stage changes, this needs to be called to get an updated view
  private createCardViews(): CardView[][] {
    const cardViews: CardView[][] = new Array(this.game.playerCount());
    for (let i = 0; i < this.game.playerCount(); ++i) {
      cardViews[i] = this.game.cardsPerPlayer[i].map(
        c => {
          const isAlreadyStaged: boolean = this.stage.contains(c);
          const canBeStaged: boolean = this.stage.canStage(c, this.game.topOfDiscardPile());
          return new CardView(c, true, isAlreadyStaged, canBeStaged);
        }
      );
    }
    return cardViews;
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
    this.cardViews = this.createCardViews();

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
    if (!this.stage.canStage(clickedCard.card, this.game.topOfDiscardPile())) {
      // TODO: side vibration
      return; // the click will have no effect
    } else {
      this.stage.stageCard(clickedCard.card);
    }
  }

  pass(): void {
    this.gameService.commitStagedCards(this.game.id, CardCombination.TURN_PASSED_PLACEHOLDER).subscribe(
      game => this.game = game
    );
    this.doAfterPlayersTurn();
  }

  playStagedCards() {
    this.logIfInvalidState();
    this.gameService.commitStagedCards(this.game.id, new CardCombination(this.stage.stagedCards)).subscribe(
      game => this.game = game
    );
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
    const playerCards: Card[] = this.game.cardsPerPlayer[0];
    if (playerCards.length === 0) {
      this.openGameVictoryModal(true);
    } else {
      this.makeComputerTurn();
      const computerCards: Card[] = this.game.cardsPerPlayer[1];
      if (computerCards.length === 0) {
        this.openGameVictoryModal(false);
      }
    }
    this.cardViews = this.createCardViews();
  }

  private disablePlayerButtons(): void {
    this.isComputersTurn = true;
    setTimeout(() => this.isComputersTurn = false, COMPUTER_TURN_TIME_IN_MILLISECONDS);
  }

  // needs to be enhanced - currently using cardsPerPlayer[1]
  private makeComputerTurn(): void {
    this.gameService.commitStagedCards(this.game.id, this.pickCardsComputer()).subscribe(
      game => this.game = game
    );
  }

  private pickCardsComputer(): CardCombination {
    let cardCombiToBeat: CardCombination = this.game.topOfDiscardPile();
    let cardCombiComputer: CardCombination = ComputerAiService.chooseCards(
      this.game.cardsPerPlayer[1],
      cardCombiToBeat
    );
    if (cardCombiComputer === CardCombination.TURN_PASSED_PLACEHOLDER) {
      alert("Computer passes");
    }
    return cardCombiComputer;
  }

  private openGameVictoryModal(hasPlayerWon: boolean): void {
    const dialogRef = this.dialog.open(
      GameOverModalComponent,
      {
        disableClose: true,
        data: { message: hasPlayerWon ? 'Congratulations! You won the game!' : 'You have lost this game.' }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result === NEW_GAME_KEY) {
        this.ngOnInit();
      } else if (result === REDIRECT_TO_STATS_KEY) {
        this.navigateToStats();
      }
    });
  }

  private navigateToStats() {
    this.router.navigate(['/olf/home']);
  }

  discardPileView(): CardViewCombination[] {
    return toCardViewCombinations(this.game?.discardPile ?? [], true, false);
  }

}