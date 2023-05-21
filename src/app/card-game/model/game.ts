import {Card} from "../card/model/card"
import { Player } from "./player"

export interface Game {
    id: number,
    players: Player[],
    cardsPerPlayer: Card[],
    discardPile: Card[],
    turnCount: number
}