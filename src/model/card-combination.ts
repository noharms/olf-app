import { Card } from "./card";
import { CardViewCombination } from "./card-combination-view";
import { CardView } from "./card-view";
import { Rank } from "./rank";


export class CardCombination {

    public static readonly AMBIGUOUS_RANKS: number = -1;
    public static readonly TURN_PASSED_PLACEHOLDER: CardCombination = new CardCombination(
        [Card.TURN_PASSED_PLACEHOLDER_CARD]
    );

    constructor(public cards: Card[]) { }

    getUniqueRank(): number {
        if (this.hasAllTheSameRanks()) {
            return this.cards[0].rank;
        } else {
            return CardCombination.AMBIGUOUS_RANKS;
        }
    }

    private hasAllTheSameRanks() {
        const uniqueRank: Rank = this.cards[0].rank;
        const hasAllTheSameRanks = this.cards.every(card => card.rank === uniqueRank);
        return hasAllTheSameRanks;
    }

    canBeat(other: CardCombination): boolean {
        return this.multiplicity() === other.multiplicity() && this.cards.every(c => c.rank > other.getUniqueRank());
    }
    
    multiplicity(): number {
        return this.cards.length;
    }

    toView(faceUp: boolean, canBeStaged: boolean): CardViewCombination {
        const views: CardView[] = this.cards.map(card => new CardView(card, faceUp, false, canBeStaged));
        return new CardViewCombination(views);
    }
}
