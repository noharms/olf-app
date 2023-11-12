import { Rank } from "./rank";
import { Suit } from "./suit";

export class Card {

    public static readonly TURN_PASSED_PLACEHOLDER_CARD: Card = new Card(-1, Rank.Passing, Suit.Colorless);

    constructor(private _id: number, private _rank: Rank, private _suit: Suit) { }

    public get rank(): Rank {
        return this._rank;
    }

    public set rank(value: Rank) {
        this._rank = value;
    }
    
    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }
    
    public get suit(): Suit {
        return this._suit;
    }
    public set suit(value: Suit) {
        this._suit = value;
    }

}

export function allSameRank(...cards: Card[]) {
    if (cards.length === 0) {
        return true;
    } else {
        const firstCard: Card = cards[0];
        const cardsWithSameRank = cards.filter(c => c.rank === firstCard.rank);
        return cardsWithSameRank.length === cards.length;
    }
}