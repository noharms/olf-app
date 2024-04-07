import { User } from "../user";


export enum InvitationAction {
    ACCEPT,
    DECLINE,
    START,
    // REVOKE, to allow creator revoking the invitation
}

export interface UserResponse {
    registeredAt: Date,
    user: User,
    action: InvitationAction,
}