import { Rank } from "./rank.model";
import { Suit } from "./suit.model";

export interface Card {
    rank: Rank;
    suit: Suit;
    faceUp: boolean;
}
