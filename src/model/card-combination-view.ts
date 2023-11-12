import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { CardView } from "./card-view";

export class CardViewCombination {

    constructor(public cardViews: CardView[]) { }

    toModel() {
        const cards: Card[] = this.cardViews.map(view => view.card);
        return new CardCombination(cards);
    }
}
