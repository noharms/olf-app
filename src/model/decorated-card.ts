import { Card } from "./card";

export interface DecoratedCard {
    card: Card,
    faceUp: boolean,
    staged: boolean, // refers to whether a card was staged for playing but the action was not yet committed
    canBeStaged: boolean, // canBeStaged checks against the top of the discard pile but also refers to the comparison with the already staged cards and is true if the combination with the already staged cards can be played
}

export function fromCards(cards: Card[], faceUp: boolean, canBeStaged: boolean): DecoratedCard[] {
    return cards.map(
        c => (
            {
                card: c,
                faceUp: faceUp,
                staged: false,
                canBeStaged: canBeStaged
            }
        )
    );
}

export function toCards(decoratedCards: DecoratedCard[]) {
    return decoratedCards.map(
        decoratedCard => decoratedCard.card
    );
}