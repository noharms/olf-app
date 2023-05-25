import { Card } from "./card";
import { RANKS_2_TO_10, Rank } from "./rank";
import { Suit } from "./suit";
import { COMPUTER_PLAYER, PLAYER1, Player } from "./player";

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
    return game.discardPile[game.discardPile.length - 1];
}
  