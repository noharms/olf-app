import { User } from "../user";


export interface GameInvitation {
    createdAt: Date,
    creator: User,
    invitedPlayers: User[], // the creator is not part of the invited players
}