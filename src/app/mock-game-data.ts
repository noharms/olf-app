import { Observable, of } from "rxjs";
import { Card } from "src/model/card";
import { CardCombination } from "src/model/card-combination";
import { Game } from "src/model/game";
import { createGame } from "src/model/game-factory";
import { Move } from "src/model/move";
import { Player } from "src/model/player";

export const PLAYER1: Player = {
    userId: 0,
    userName: "Enno"
}

export const COMPUTER_PLAYER: Player = {
    userId: 1,
    userName: "Computer"
}

export const GAMES: Game[] = [
    createGame(1, [PLAYER1, COMPUTER_PLAYER]),
    createGame(2, [PLAYER1, COMPUTER_PLAYER, { userId: 2, userName: "cori" }]),
    // Add more mock games as needed
];

export function updateBackendGame(gameId: number, cardsPlayed: CardCombination): Observable<Game> {
    const gameIndex: number = GAMES.findIndex(game => game.id === gameId);    
    GAMES[gameIndex] = updateGame(GAMES[gameIndex], cardsPlayed);
    return of(GAMES[gameIndex]);
}

// TODO once we have a backend, this should be done in the backend
function updateGame(game: Game, cardCombination: CardCombination): Game {
    return new Game(
        game.id,
        game.players,
        removeFromCurrentPlayer(game, cardCombination),
        addToDiscardPile(game.discardPile, cardCombination),
        game.turnCount + 1,
        game.history.concat(new Move(game.currentPlayer(), cardCombination))
    );
}

function addToDiscardPile(oldDiscardPile: CardCombination[], cardCombination: CardCombination): CardCombination[] {
    const newDiscardPile: CardCombination[] = [...oldDiscardPile];
    newDiscardPile.push(cardCombination);
    return newDiscardPile;
}

function removeFromCurrentPlayer(game: Game, cardCombination: CardCombination): Card[][] {
    const iPlayer: number = game.currentPlayerIndex();    
    let updatedCards: Card[][] = [[]];
    for (let i = 0; i < game.players.length; ++i) {
        updatedCards[i] = i === iPlayer 
        ? game.cardsPerPlayer[i].filter(c => !cardCombination.cards.includes(c))
        : Array.from(game.cardsPerPlayer[i]);
    }
    return updatedCards;
}