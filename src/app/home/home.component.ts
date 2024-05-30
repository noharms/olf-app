import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/model/game';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { EMPTY_USER as UNDEFINED_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics, UserGameStatistics } from 'src/model/user-game-statistics';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
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
  invitationStatuses: GameInvitationStatus[] = [];
  playersForNewGame: User[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private gameService: GameService,
    public matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? UNDEFINED_USER;
        this.fetchFreshData();
      }
    );
  }

  fetchFreshData() {
    this.fetchGamesBackend();
    this.fetchInvitationsBackend();
  }

  private fetchGamesBackend() {
    this.gameService.getGames(this.user.id).subscribe(
      games => {
        this.finishedGames = games.filter(g => g.isFinished());
        this.openGames = games.filter(g => !g.isFinished());
        this.userGameStatistics = UserGameStatistics.from(games, this.user.id);
      }
    );
  }

  private fetchInvitationsBackend() {
    this.gameService.getUpcomingGames(this.user.id).subscribe(
      invitationStatuses => {
        this.invitationStatuses = invitationStatuses;
      }
    );
  }

  startNewGame() {
    const dialogRef = this.matDialog.open(NewGameModalComponent, {
      minWidth: '300px',
      minHeight: '400px',
      panelClass: 'custom-modal-container'
      // Add more options here as needed
    });

    dialogRef.afterClosed().subscribe(newInvitationStatus => {
      this.fetchInvitationsBackend();
      console.log('The dialog was closed. Invitations will be updated.');
      if (newInvitationStatus) {
        console.log(`Home component received new invitation with id ${newInvitationStatus.invitation.id}`)
      }
    });
  }

}