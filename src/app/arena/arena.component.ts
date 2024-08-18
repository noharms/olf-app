import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';
import { EMPTY_USER, User } from 'src/model/user';
import { TOP_LEVEL_DOMAIN_NAME } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrl: './arena.component.scss'
})
export class ArenaComponent implements OnInit {

  openGames: Game[] = [];

  user: User = EMPTY_USER;

  constructor(
    private authenticationService: AuthenticationService,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
        if (user === EMPTY_USER) {
          console.log(`No logged-in user found: ${user.name}. Redirecting from personal to login.`);
          this.router.navigate([TOP_LEVEL_DOMAIN_NAME]);
        }
        this.fetchGamesBackend();
      }
    );  
  }

  private fetchGamesBackend() {
    this.gameService.getGames(this.user.id).subscribe(
      games => {
        this.openGames = games.filter(g => !g.isFinished());
      }
    );
  }

}