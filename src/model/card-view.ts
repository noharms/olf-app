import { Card } from "./card";
import { CardCombination } from "./card-combination";

export class CardView {

    // staged refers to whether a card was staged for playing but the action was not yet committed 
    // canBeStaged checks against the top of the discard pile but also refers to the comparison with the already staged cards and is true if the combination 
    // with the already staged cards can be played
    constructor(public card: Card, public faceUp: boolean, public staged: boolean, public canBeStaged: boolean) { }

    // TODO remove from here! this belongs to the model only
    isRankHigherThan(combinationToBeat: CardCombination): boolean {
        // TODO simple implemetnation for now; fill for more than 1 card
        const rankToBeat: number = combinationToBeat.cards[0].rank;
        return this.card.rank > rankToBeat;
    }

}