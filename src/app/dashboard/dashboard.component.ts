import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { EMPTY_USER as UNDEFINED_USER, User } from 'src/model/user';
import { EMPTY_USER_STATISTICS, IUserGameStatistics, UserGameStatistics } from 'src/model/user-game-statistics';
import { TOP_LEVEL_DOMAIN_NAME } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { NewGameModalComponent } from './new-game-modal/new-game-modal.component';
import { TabService } from '../tab.service';
import { Tab } from 'src/model/tabs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  user: User = UNDEFINED_USER;
  userGameStatistics: IUserGameStatistics = EMPTY_USER_STATISTICS;
  finishedGames: Game[] = [];
  openGames: Game[] = [];
  invitationStatuses: GameInvitationStatus[] = [];
  isInvitationPulsating: boolean[] = [];
  playersForNewGame: User[] = [];

  private readonly PULSATE_PERIOD_IN_SECONDS = 5;

  constructor(
    private authenticationService: AuthenticationService,
    private tabService: TabService,
    private userService: UserService,
    private gameService: GameService,
    public matDialog: MatDialog,
    private router: Router
  ) {
    this.tabService.selectWithoutRedirect(Tab.PERSONAL);
  }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? UNDEFINED_USER;
        if (user === UNDEFINED_USER) {
          console.log(`No logged-in user found: ${user.name}. Redirecting from personal to login.`);
          this.router.navigate([TOP_LEVEL_DOMAIN_NAME]);
        }
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
        this.isInvitationPulsating = invitationStatuses.map(
          status => this.isLessThanXSecondsOld(status.invitation.createdAt, this.PULSATE_PERIOD_IN_SECONDS)
        )
        const delaySwitchOffInMs: number = (this.PULSATE_PERIOD_IN_SECONDS + 1) * 1000;
        // note: after some initial pulsating animation for newly created upcoming games
        // we want to stop pulsation; therefore, we re-render the view of the upcoming games
        // with all pulsation turned off after a given delay
        setTimeout(
          () => this.isInvitationPulsating = [...Array(this.invitationStatuses.length).keys()].map(i => false),
          delaySwitchOffInMs
        );
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
        console.log(`Dashboard component received new invitation with id ${newInvitationStatus.invitation.id}`)
      }
    });
  }

  private isLessThanXSecondsOld(date: Date, xInSeconds: number): boolean {
    const now = new Date();
    const xInMilliseconds: number = xInSeconds * 1000;
    const ageOfDateInMilliSeconds: number = now.getTime() - date.getTime();
    return ageOfDateInMilliSeconds < xInMilliseconds;
  }

}