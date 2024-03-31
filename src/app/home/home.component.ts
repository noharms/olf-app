import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';
import { EMPTY_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics, UserGameStatistics } from 'src/model/user-game-statistics';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { CURRENT_GAME_BASE_PATH } from '../app-routing.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  user: User = EMPTY_USER;
  userGameStatistics: IUserGameStatistics = EMPTY_USER_STATISTICS;
  finishedGames: Game[] = [];
  openGames: Game[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    const userId: number = 1;
    this.userService.getUserById(userId).subscribe(
      user => {
        this.user = user;
      }
    );
    this.gameService.getAllGames(userId).subscribe(
      games => {
        this.finishedGames = games.filter(g => g.isFinished());
        this.openGames = games.filter(g => !g.isFinished());
        this.userGameStatistics = UserGameStatistics.from(games, userId);
      }
    )
  }

  startNewGame() {
    const path: string = `${CURRENT_GAME_BASE_PATH}/-1`;
    this.router.navigate([path]);
  }

  onRowClicked(game: Game) {
    const path: string = `${CURRENT_GAME_BASE_PATH}/${game.id}`;
    this.router.navigate([path]);
  }

}