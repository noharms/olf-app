import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output()
  onBackendUpdateCompleted: EventEmitter<void> = new EventEmitter<void>();

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
    const requiredAction: InvitationAction | undefined = this.requiredActionUser(invitationStatus, this.user);
    // TODO: this is disabled because this method is continuosly called!!!
    // console.log("Action: " + requiredAction + ", User: " + this.user.name)
    return requiredAction !== undefined;
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
      ).subscribe(
        statuses => {
          this.invitationStatuses = statuses;
          // at the very end, tell the parent component, that the backend was updated
          this.onBackendUpdateCompleted.emit();
        }
      );
    } else {
      // if no action available for the current user, do nothing
    }
  }
}
