import { Rank } from "./rank";
import { Suit } from "./suit";

export interface Card {
    id: number;
    rank: Rank;
    suit: Suit;
}
