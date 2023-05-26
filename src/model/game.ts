import { Card, TURN_PASSED_PLACEHOLDER_CARD } from "./card";
import { Player } from "./player";

export interface Game {
    id: number,
    players: Player[],
    cardsPerPlayer: Card[][],
    discardPile: Card[],
    turnCount: number;
    // stagedCards should also be stored on server
    // history of turns also
}

// create GameImpl class for these methods
// and use GameImpl instead of anonymous instances
export function getPlayerOnTurn(game: Game) {
    return game.turnCount % game.players.length;
}

export function topOfDiscardPile(game: Game): Card {
    if (game.discardPile.length === 0) {
        return TURN_PASSED_PLACEHOLDER_CARD;
    } else {
        return game.discardPile[game.discardPile.length - 1];
    }
}
