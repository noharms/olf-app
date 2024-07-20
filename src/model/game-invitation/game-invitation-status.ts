import { concatPlayerNames } from "src/utils/user-utils";
import { User } from "../user";
import { GameInvitation } from "./game-invitation";
import { InvitationAction, CompletedAction } from "./user-response";
import { createComputerPlayers } from "../game-factory";
import { Player } from "../player";

export class GameInvitationStatus {

    constructor(
        private _invitation: GameInvitation,
        private completedUserActions: CompletedAction[]
    ) { }

    public get invitation(): GameInvitation {
        return this._invitation;
    }

    isCreator(user: User): boolean {
        return user === this.invitation.creator;
    }

    getInvolvedUsers(): User[] {
        return [this._invitation.creator, ...this._invitation.invitees];
    }

    getPlayersString(): string {
        const humanPlayers: Player[] = this.getInvolvedUsers() as Player[];
        return concatPlayerNames(humanPlayers.concat(this.getComputerPlayers()));
    }

    getComputerPlayers(): Player[] {
        return createComputerPlayers(this._invitation.nComputerPlayers);
    }

    userIds(): number[] {
        return [this.invitation.creator.id, ...this.inviteesIds()]
    }

    inviteesIds(): number[] {
        return this.invitation.invitees.map(p => p.id);
    }

    inviteesNotResponded(): User[] {
        const usersWhoResponded: User[] = this.inviteesWhoResponded();
        return this.invitation.invitees.filter(u => !usersWhoResponded.includes(u));
    }

    inviteesWhoResponded(): User[] {
        return this
            .completedUserActions
            .filter(action => action.user !== this._invitation.creator)
            .filter(action => action.action === InvitationAction.ACCEPT || action.action === InvitationAction.DECLINE)
            .map(action => action.user);
    }

    private allResponded(): boolean {
        return this.inviteesWhoResponded().length === this._invitation.invitees.length;
    }

    requiredActions(): Map<User, InvitationAction> {
        if (this.allResponded()) {
            return new Map<User, InvitationAction>([
                [this.invitation.creator, InvitationAction.START]
            ]);
        } else {
            return new Map<User, InvitationAction>(
                this.inviteesNotResponded().map(user => [user, InvitationAction.ACCEPT])
            );
        }
    }

    addResponse(newResponse: CompletedAction) {
        this.completedUserActions.push(newResponse);
    }
}