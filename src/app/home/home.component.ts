import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';
import { EMPTY_USER as UNDEFINED_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics, UserGameStatistics } from 'src/model/user-game-statistics';
import { CURRENT_GAME_PATH } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { NewGameModalComponent } from './new-game-modal/new-game-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  user: User = UNDEFINED_USER;
  userGameStatistics: IUserGameStatistics = EMPTY_USER_STATISTICS;
  finishedGames: Game[] = [];
  openGames: Game[] = [];
  playersForNewGame: User[] = [];

  private readonly MINIMUM_PLAYERS_PER_GAME: number = 2;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private gameService: GameService,
    public matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(
      user => {
        this.user = user ?? UNDEFINED_USER;
        this.gameService.getAllGames(this.user.id).subscribe(
          games => {
            this.finishedGames = games.filter(g => g.isFinished());
            this.openGames = games.filter(g => !g.isFinished());
            this.userGameStatistics = UserGameStatistics.from(games, this.user.id);
          }
        )
      }
    );
  }

  startNewGame() {
    const dialogRef = this.matDialog.open(NewGameModalComponent, {
      minWidth: '300px', // Customize modal width here
      minHeight: '400px', // Customize modal width here
      // Add more options here as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed
    });
  }

  onRowClicked(game: Game) {
    const path: string = `${CURRENT_GAME_PATH}/${game.id}`;
    this.router.navigateByUrl(path);
  }

}