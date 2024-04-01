import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_USERS } from 'src/mocks/mock-user-data';
import { Game } from 'src/model/game';
import { EMPTY_USER as UNDEFINED_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics, UserGameStatistics } from 'src/model/user-game-statistics';
import { CURRENT_GAME_PATH } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';
import { UserService } from '../user.service';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    // TODO remove the default login
    this.authenticationService.login(MOCK_USERS[1].name, "dummyPassword");
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
    )
  }

  startNewGame() {
    const path: string = `${CURRENT_GAME_PATH}/-1`;
    this.router.navigate([path]);
  }

  onRowClicked(game: Game) {
    const path: string = `${CURRENT_GAME_PATH}/${game.id}`;
    this.router.navigate([path]);
  }

}