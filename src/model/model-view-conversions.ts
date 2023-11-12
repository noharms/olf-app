import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { CardViewCombination } from "./card-combination-view";
import { CardView } from "./card-view";


export function toCardViews(cards: Card[], faceUp: boolean, canBeStaged: boolean): CardView[] {
    return cards.map(c => new CardView(c, faceUp, false, canBeStaged));
}

export function toCards(cardViews: CardView[]): Card[] {
    return cardViews.map(cardView => cardView.card);
}

export function toCardViewCombinations(combinations: CardCombination[], faceUp: boolean, canBeStaged: boolean): CardViewCombination[] {
    return combinations.map(combination => combination.toView(faceUp, canBeStaged));
}

export function toCardCombinations(cardViewCominations: CardViewCombination[]): CardCombination[] {
    return cardViewCominations.map(cardViewCombination => cardViewCombination.toModel())
}