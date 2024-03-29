import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';
import { EMPTY_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics } from 'src/model/user-game-statistics';
import { GameService } from '../game.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: User = EMPTY_USER;
  userGameStatistics: IUserGameStatistics = EMPTY_USER_STATISTICS;
  games: Game[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    const userId: number = 0;
    this.userService.getUserById(userId).subscribe(
      user => {
        this.user = user;
      }
    );
    this.gameService.getAllGames(userId).subscribe(
      games => {
        this.games = games;
      }
    )
  }

  startNewGame() {
    this.router.navigate(['olf/cardgame']);
  }

}