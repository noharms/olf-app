import { User } from "../user";


export enum InvitationAction {
    ACCEPT = "Accept",
    DECLINE = "Decline",
    START = "Start Game",
    // REVOKE, to allow creator revoking the invitation
}

export interface CompletedAction {
    registeredAt: Date,
    user: User,
    action: InvitationAction,
}