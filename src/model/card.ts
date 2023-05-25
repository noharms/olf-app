import { Rank } from "./rank";
import { Suit } from "./suit";

export interface Card {
    id: number;
    rank: Rank;
    suit: Suit;
}

export const TURN_PASSED_PLACEHOLDER_CARD: Card = {
    id: -1,
    rank: Rank.Passing,
    suit: Suit.Colorless
};