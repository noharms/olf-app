import { Observable, of } from "rxjs";
import { Card } from "src/model/card";
import { CardCombination } from "src/model/card-combination";
import { Game } from "src/model/game";
import { createFinishedGame, createGame } from "src/model/game-factory";
import { GameInvitation } from "src/model/game-invitation/game-invitation";
import { GameInvitationStatus } from "src/model/game-invitation/game-invitation-status";
import { CompletedAction, InvitationAction } from "src/model/game-invitation/user-response";
import { User } from "src/model/user";
import { MOCK_USERS, PLAYER1, PLAYER2 } from "./mock-user-data";

export const MOCK_GAMES: Game[] = [
    createGame(1, [PLAYER1, PLAYER2]),
    createGame(2, [...MOCK_USERS]),
    createFinishedGame(3, [...MOCK_USERS]),
    // Add more mock games as needed
];

export const MOCK_INVITATION_STATUS: GameInvitationStatus[] = [
    new GameInvitationStatus(
        {
            id: 1,
            createdAt: new Date(),
            creator: MOCK_USERS[0],
            invitees: MOCK_USERS.slice(1, 3)
        },
        []
    ),
    new GameInvitationStatus(
        {
            id: 2,
            createdAt: new Date(),
            creator: MOCK_USERS[0],
            invitees: MOCK_USERS.slice(1, 3)
        },
        [
            {
                registeredAt: new Date(),
                user: MOCK_USERS[1],
                action: InvitationAction.ACCEPT
            },
            {
                registeredAt: new Date(),
                user: MOCK_USERS[2],
                action: InvitationAction.ACCEPT
            }
        ]
    )
];

export function createMockGame(players: User[]): Game {
    return createGame(MOCK_GAMES.length, players);
}

export function createMockInvitation(creator: User, invitees: User[]): GameInvitation {
    return {
        id: MOCK_INVITATION_STATUS.length + 1,
        createdAt: new Date(),
        creator: creator,
        invitees: invitees
    };
}

export function updateBackendGame(gameId: number, cardsPlayed: CardCombination): Observable<Game> {
    const gameIndex: number = MOCK_GAMES.findIndex(game => game.id === gameId);
    MOCK_GAMES[gameIndex] = updateGame(MOCK_GAMES[gameIndex], cardsPlayed);
    return of(MOCK_GAMES[gameIndex]);
}

// TODO once we have a backend, this should be done in the backend
export function updateGame(game: Game, currentPlayerMove: CardCombination): Game {
    const currentPlayerIndex: number = game.currentPlayerIndex();
    const updatedCards: Card[][] = game.cardsPerPlayer;
    updatedCards[currentPlayerIndex] = game.getPlayerCardsAfterMove(currentPlayerIndex, currentPlayerMove);
    return new Game(
        game.id,
        game.players,
        updatedCards,
        game.getUpdatedDiscardPile(currentPlayerMove),
        game.turnCount + 1,
        game.getUpdatedHistory(currentPlayerMove)
    );
}

export function updateBackendWithResponse(gameInvitationId: number, newResponse: CompletedAction) {
    const gameIndex: number = MOCK_INVITATION_STATUS.findIndex(g => g.invitation.id === gameInvitationId);
    const gameInvitation: GameInvitationStatus = MOCK_INVITATION_STATUS[gameIndex];
    gameInvitation.addResponse(newResponse);
    return of(gameInvitation);
}

