import { Observable, of } from "rxjs";
import { CardCombination } from "src/model/card-combination";
import { Game } from "src/model/game";
import { createFinishedGame, createGame } from "src/model/game-factory";
import { COMPUTER_PLAYER, MOCK_USERS, PLAYER1 } from "./mock-user-data";
import { Card } from "src/model/card";

export const MOCK_GAMES: Game[] = [
    createGame(1, [PLAYER1, COMPUTER_PLAYER]),
    createGame(2, MOCK_USERS),
    createFinishedGame(3, MOCK_USERS),
    // Add more mock games as needed
];

export function updateBackendGame(gameId: number, cardsPlayed: CardCombination): Observable<Game> {
    const gameIndex: number = MOCK_GAMES.findIndex(game => game.id === gameId);
    MOCK_GAMES[gameIndex] = updateGame(MOCK_GAMES[gameIndex], cardsPlayed);
    return of(MOCK_GAMES[gameIndex]);
}

// TODO once we have a backend, this should be done in the backend
function updateGame(game: Game, currentPlayerMove: CardCombination): Game {
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

