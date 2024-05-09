import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENT_GAME_PATH } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/authentication.service';
import { Game } from 'src/model/game';
import { EMPTY_USER, User } from 'src/model/user';

@Component({
  selector: 'app-open-games-table',
  templateUrl: './open-games-table.component.html',
  styleUrls: ['./open-games-table.component.scss']
})
export class OpenGamesTableComponent {

  @Input()
  openGames: Game[] = [];

  user: User = EMPTY_USER;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
      }
    );
  }

  onRowClicked(game: Game) {
    const path: string = `${CURRENT_GAME_PATH}/${game.id}`;
    this.router.navigateByUrl(path);
  }
}
