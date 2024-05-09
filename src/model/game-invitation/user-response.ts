import { User } from "../user";


export enum InvitationAction {
    ACCEPT = "Accept",
    DECLINE = "Decline",
    START = "Start Game",
    CANCEL = "Cancel Game"
}

export interface CompletedAction {
    registeredAt: Date,
    user: User,
    action: InvitationAction,
}