import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { GameService } from 'src/app/game.service';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { InvitationAction } from 'src/model/game-invitation/user-response';
import { EMPTY_USER, User } from 'src/model/user';

@Component({
  selector: 'app-upcoming-games-table',
  templateUrl: './upcoming-games-table.component.html',
  styleUrls: ['./upcoming-games-table.component.scss']
})
export class UpcomingGamesTableComponent {

  @Input()
  invitationStatuses: GameInvitationStatus[] = [];

  user: User = EMPTY_USER;

  constructor(
    private authenticationService: AuthenticationService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
      }
    );
  }

  requiredActions(invitationStatus: GameInvitationStatus): string {
    return this.canCurrentUserAct(invitationStatus)
      ? `${this.user.name}: ${this.requiredActionUser(invitationStatus, this.user)?.toString()}`
      : Array.from(invitationStatus.requiredActions().entries()).map(
        ([user, action]) => `${user.name}: ${action.toString()}`
      ).join(', ');
  }

  canCurrentUserAct(invitationStatus: GameInvitationStatus): boolean {
    return invitationStatus.isCreator(this.user) || this.requiredActionUser(invitationStatus, this.user) !== undefined;
  }

  private requiredActionUser(invitationStatus: GameInvitationStatus, user: User) {
    const allRequiredActions: Map<User, InvitationAction> = invitationStatus.requiredActions();
    return allRequiredActions.get(user)
  }

  handleActionClick(invitationStatus: GameInvitationStatus): void {
    const allRequiredActions: Map<User, InvitationAction> = invitationStatus.requiredActions();
    const requiredActionUser: InvitationAction | undefined = allRequiredActions.get(this.user);
    if (requiredActionUser !== undefined) {
      this.gameService.updateInvitationWith(
        invitationStatus.invitation.id,
        requiredActionUser,
        this.user
      );
    } else {
      // if no action available for the current user, do nothing
    }


  }
}
