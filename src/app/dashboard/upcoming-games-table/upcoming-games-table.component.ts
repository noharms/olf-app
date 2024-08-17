import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { GameService } from 'src/app/game.service';
import { GameInvitationStatus, userToActionString } from 'src/model/game-invitation/game-invitation-status';
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

  @Input()
  isInvitationPulsating: boolean[] = [];

  @Output()
  onBackendUpdateCompleted: EventEmitter<void> = new EventEmitter<void>();

  user: User = EMPTY_USER;

  constructor(
    private authenticationService: AuthenticationService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.validateInputFields();
    this.authenticationService.currentUser$.subscribe(
      user => {
        this.user = user ?? EMPTY_USER;
      }
    );
  }

  private validateInputFields() {
    if (this.invitationStatuses.length != this.isInvitationPulsating.length) {
      console.warn(`Unexpected behaviour: ${this.invitationStatuses.length} != ${this.isInvitationPulsating.length} but there should be a pulsating flag for each input game.`);
    }
  }

  requiredActions(invitationStatus: GameInvitationStatus): string {
    const canUserAct: boolean = this.canCurrentUserAct(invitationStatus);
    return canUserAct
      ? `${this.user.name}: ${this.requiredActionUser(invitationStatus, this.user)?.toString()}`
      : userToActionString(invitationStatus);
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
        updatedStatuses => {
          this.invitationStatuses = updatedStatuses;
          // at the very end, tell the parent component, that the backend was updated
          this.onBackendUpdateCompleted.emit();
        }
      );
    } else {
      // if no action available for the current user, do nothing
    }
  }

}

