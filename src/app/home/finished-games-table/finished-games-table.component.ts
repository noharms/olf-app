import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Game } from 'src/model/game';
import { EMPTY_USER, User } from 'src/model/user';

@Component({
  selector: 'app-finished-games-table',
  templateUrl: './finished-games-table.component.html',
  styleUrls: ['./finished-games-table.component.scss']
})
export class FinishedGamesTableComponent {

  @Input()
  finishedGames: Game[] = [];

  user: User = EMPTY_USER;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
      }
    );
  }
}
