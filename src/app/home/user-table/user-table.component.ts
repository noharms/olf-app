import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { EMPTY_USER, User } from 'src/model/user';
import { IUserGameStatistics } from 'src/model/user-game-statistics';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {

  @Input()
  userGameStatistics: IUserGameStatistics = {
    totalGamesPlayed: 0,
    numberOfWins: 0,
    numberOfLosses: function (): number {
      return 0;
    }
  };

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
