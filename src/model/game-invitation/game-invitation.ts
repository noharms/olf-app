import { User } from "../user";


export interface GameInvitation {
    id: number, // invitations get separate ids from the potential game spawned from it
    createdAt: Date,
    creator: User,
    invitees: User[], // the creator is not part of the invited players
    nComputerPlayers: number
}