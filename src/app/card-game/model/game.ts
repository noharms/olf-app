import { Card } from "../card/model/card";
import { RANKS_2_TO_10, Rank } from "../card/model/rank";
import { Suit } from "../card/model/suit";
import { COMPUTER_PLAYER, PLAYER1, Player } from "./player";

export interface Game {
    id: number,
    players: Player[],
    cardsPerPlayer: Card[][],
    discardPile: Card[],
    turnCount: number
    // stagedCards should also be stored on server
    // history of turns also
}