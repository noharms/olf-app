import { Observable, of } from "rxjs";
import { CardCombination } from "src/model/card-combination";
import { Game } from "src/model/game";
import { createFinishedGame, createGame } from "src/model/game-factory";
import { COMPUTER_PLAYER, MOCK_USERS, PLAYER1 } from "./mock-user-data";

export const GAMES: Game[] = [
    createGame(1, [PLAYER1, COMPUTER_PLAYER]),
    createGame(2, MOCK_USERS),
    createFinishedGame(2, MOCK_USERS),
    // Add more mock games as needed
];

export function updateBackendGame(gameId: number, cardsPlayed: CardCombination): Observable<Game> {
    const gameIndex: number = GAMES.findIndex(game => game.id === gameId);
    GAMES[gameIndex] = updateGame(GAMES[gameIndex], cardsPlayed);
    return of(GAMES[gameIndex]);
}

// TODO once we have a backend, this should be done in the backend
function updateGame(game: Game, currentPlayerMove: CardCombination): Game {
    return new Game(
        game.id,
        game.players,
        game.getUpdatedCards(currentPlayerMove),
        game.getUpdatedDiscardPile(currentPlayerMove),
        game.turnCount + 1,
        game.getUpdatedHistory(currentPlayerMove)
    );
}

