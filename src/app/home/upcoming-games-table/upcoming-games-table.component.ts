import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
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
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
      }
    );
  }

  requiredActionCurrentUser(invitationStatus: GameInvitationStatus): string {
    const allRequiredActions: Map<User, InvitationAction> = invitationStatus.requiredActions();
    const requiredActionUser: InvitationAction | undefined = allRequiredActions.get(this.user);
    return requiredActionUser !== undefined
      ? `${this.user.name}: ${requiredActionUser?.toString()}`
      : Array.from(allRequiredActions.entries()).map(
        ([user, action]) => `${user.name}: ${action.toString()}`
      ).join(', ');
  }
}
