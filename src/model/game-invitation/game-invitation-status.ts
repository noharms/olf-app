import { User } from "../user";
import { GameInvitation } from "./game-invitation";
import { InvitationAction, UserResponse } from "./user-response";

export class GameInvitationStatus {

    constructor(
        private _invitation: GameInvitation,
        private userResponses: UserResponse[]
    ) { }

    public get invitation(): GameInvitation {
        return this._invitation;
    }

    usersNotResponded(): User[] {
        const usersWhoResponded: User[] = this.usersWhoResponded();
        return this.invitation.invitedPlayers.filter(
            invitedUser => usersWhoResponded.includes(invitedUser)
        );
    }

    usersWhoResponded(): User[] {
        return this.userResponses.map(response => response.user);
    }

    private allResponded(): boolean {
        return this.usersNotResponded().length === 0;
    }

    requiredActions(): [User, InvitationAction][] {
        if (this.allResponded()) {
            return [[this.invitation.creator, InvitationAction.START]];
        } else {
            return this.usersNotResponded().map(user => [user, InvitationAction.ACCEPT]);
        }
    }

}