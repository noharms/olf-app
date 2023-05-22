import { Card } from "./card";

export interface DecoratedCard {
    card: Card,
    faceUp: boolean,
    staged: boolean
    canBePlayed: boolean
}

export function fromCards(cards: Card[], faceUp: boolean, canBePlayed: boolean): DecoratedCard[] {
    return cards.map(
        c => ({ card: c, faceUp: faceUp, staged: false, canBePlayed: canBePlayed })
    );
}

export function toCards(decoratedCards: DecoratedCard[]) {
    return decoratedCards.map(
        decoratedCard => decoratedCard.card
    );
}