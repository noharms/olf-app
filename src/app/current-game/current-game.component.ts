import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/model/card';
import { CardCombination } from 'src/model/card-combination';
import { CardViewCombination } from 'src/model/card-combination-view';
import { CardView } from 'src/model/card-view';
import { toCardViewCombinations } from 'src/model/model-view-conversions';
import { Player } from 'src/model/player';
import { Stage } from 'src/model/stage';
import { Tab } from 'src/model/tabs';
import { User } from 'src/model/user';
import { decrementOrWrapAround, incrementOrWrapAround } from 'src/utils/array-utils';
import { concatWords } from 'src/utils/string-utils';
import { Game } from '../../model/game';
import { DASHBOARD_PATH, GAME_ID_URL_PARAMETER_NAME } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { ComputerAiService } from '../computer-ai.service';
import { GameService } from '../game.service';
import { TabService } from '../tab.service';
import { GameOverModalComponent, NEW_GAME_KEY, REDIRECT_TO_STATS_KEY } from './game-over-modal/game-over-modal.component';

const COMPUTER_TURN_TIME_IN_MILLISECONDS = 500;

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  loggedInPlayerIndex: number = -1;
  focusedOpponentIndex: number = -1;
  opponentLeftFromFocused: Player | undefined;
  opponentRightFromFocused: Player | undefined;
  gameId: number | undefined;
  game: Game = Game.EMPTY_GAME;
  cardViews: CardView[][] = [];
  stage: Stage = Stage.empty();
  isLoggedInPlayerOnTurn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private gameService: GameService,
    private authService: AuthenticationService,
    private tabService: TabService
  ) {
    this.tabService.selectWithoutRedirect(Tab.ARENA);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const substring: string | null = params.get(GAME_ID_URL_PARAMETER_NAME);
      this.gameId = substring ? Number(substring) : undefined;
      console.log("Path " + this.route.outlet + " was parsed to get gameId: " + this.gameId);
      console.log("... now loading the game");
      if (this.gameId) {
        this.loadGameThenUpdateView(this.gameId);
      }
    }
    );
  }

  private loadGameThenUpdateView(gameId: number): void {
    this.gameService.getGame(gameId).subscribe(
      game => {
        if (!game) {
          console.log(`Game id ${gameId} not found on server.`);
        } else {
          this.updateViewFields(game);
        }
      }
    );
  }

  private updateViewFields(game: Game): void {
    // Caveat: below computations rely on order! e.g. many of them use this.game
    this.game = game;

    const loggedInUser: User | null = this.authService.currentUser;
    this.loggedInPlayerIndex = game.playerIndex(loggedInUser as Player);

    this.stage = Stage.empty();
    this.isLoggedInPlayerOnTurn = this.loggedInPlayerIndex === game.playerIndexOnTurn();
    this.cardViews = this.createCardViews();
    this.focusedOpponentIndex = this.focusedOpponentIndex !== -1
      ? this.focusedOpponentIndex
      : this.initializeFocussedOpponent();
    if (this.loggedInPlayerIndex >= 0 && this.focusedOpponentIndex >= 0) {
      this.updateViewFieldsFocusChanged();
    } else {
      console.log(
        `Could not retrieve logged in players index ${this.loggedInPlayerIndex} or focused opponent index ${this.focusedOpponentIndex}`
      );
    }
  }

  private initializeFocussedOpponent(): number {
    return this.isLoggedInPlayerOnTurn
      ? incrementOrWrapAround(this.loggedInPlayerIndex, this.game.playerCount())
      : this.game.playerIndexOnTurn();
  }

  private updateViewFieldsFocusChanged() {
    const indexNextLeft: number = decrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    this.opponentLeftFromFocused = this.game.players[indexNextLeft];
    const indexNextRight: number = incrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    this.opponentRightFromFocused = this.game.players[indexNextRight];
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
          const canBeStaged: boolean = (i === this.loggedInPlayerIndex) && this.isLoggedInPlayerOnTurn && this.stage.canStage(c, this.game.topOfDiscardPile());
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
    this.isLoggedInPlayerOnTurn = false;
    this
      .gameService
      .commitStagedCards(
        this.game.id,
        CardCombination.TURN_PASSED_PLACEHOLDER
      ).subscribe(
        game => {
          this.game = game;
          this.stage.clear();
          this.doAfterPlayersTurn();
        }
      );
  }

  playStagedCards() {
    this.logIfInvalidState();
    this.isLoggedInPlayerOnTurn = false;
    this.gameService.commitStagedCards(
      this.game.id,
      new CardCombination(this.stage.stagedCards)
    ).subscribe(
      game => {
        this.game = game;
        this.stage.clear();
        this.doAfterPlayersTurn();
      }
    );
  }

  private logIfInvalidState() {
    if (this.stage.isEmpty()) {
      const errorMessage = "Implementation error - check why this method was called.";
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private doAfterPlayersTurn() {
    const playerCards: Card[] = this.game.cardsPerPlayer[this.loggedInPlayerIndex];
    if (playerCards.length === 0) {
      this.openGameVictoryModal(true);
    }
    this.cardViews = this.createCardViews();
  }

  // TODO: it is not enough to check top of discard pile!
  // TODO: because imagine in 3 player game first player played, 2nd one passed!
  makeComputerTurn(): void {
    const playerIndex: number = this.game.playerIndexOnTurn();
    const moveComputer: CardCombination = this.pickCardsComputer(playerIndex);
    this.gameService.commitStagedCards(this.game.id, moveComputer).subscribe(
      game => {
        this.game = game;
        const cardsAfterMove: Card[] = this.game.cardsPerPlayer[playerIndex];
        if (cardsAfterMove.length === 0) {
          this.openGameVictoryModal(false);
        }
        this.isLoggedInPlayerOnTurn = this.game.playerIndexOnTurn() === this.loggedInPlayerIndex;
        this.cardViews = this.createCardViews();
      }
    );
  }

  private pickCardsComputer(playerIndex: number): CardCombination {
    let cardCombiToBeat: CardCombination = this.game.topOfDiscardPile();
    let cardCombiComputer: CardCombination = ComputerAiService.chooseCards(
      this.game.cardsPerPlayer[playerIndex],
      cardCombiToBeat
    );
    if (cardCombiComputer === CardCombination.TURN_PASSED_PLACEHOLDER) {
      alert(`Computer player ${playerIndex} passes`);
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
        this.ngOnInit(); // TODO: rather a method that gives a new game from the backend
      } else if (result === REDIRECT_TO_STATS_KEY) {
        this.navigateToStats();
      }
    });
  }

  private navigateToStats() {
    this.router.navigateByUrl(DASHBOARD_PATH);
  }

  discardPileView(): CardViewCombination[] {
    // TODO: rather show history here to include also player name
    return toCardViewCombinations(this.game?.history.map(move => move.cardCombi) ?? [], true, false);
  }

  moveHistory(): string {
    // TODO: rather show history here to include also player name
    return this.game?.getHistoryString() ?? "";
  }

  isStageValid(): boolean {
    const stagedCardCombi: CardCombination = new CardCombination(this.stage.stagedCards);
    const cardCombiToBeat: CardCombination = this.game.topOfDiscardPile();
    return !this.stage.isEmpty() && stagedCardCombi.canBeat(cardCombiToBeat);
  }

  opponentLeftFromFocus(): string {
    return this.opponentLeftFromFocused?.playerName() ?? "no player found";
  }

  nextOpponentName(): string {
    return this.opponentRightFromFocused?.playerName() ?? "no player found";
  }

  onLeftArrowClick(): void {
    this.focusedOpponentIndex = decrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    if (this.focusedOpponentIndex === this.loggedInPlayerIndex) {
      this.focusedOpponentIndex = decrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    }
    this.updateViewFieldsFocusChanged();
  }

  onRightArrowClick(): void {
    this.focusedOpponentIndex = incrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    if (this.focusedOpponentIndex === this.loggedInPlayerIndex) {
      this.focusedOpponentIndex = incrementOrWrapAround(this.focusedOpponentIndex, this.game.playerCount());
    }
    this.updateViewFieldsFocusChanged();
  }

}