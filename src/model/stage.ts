import { Card, allSameRank } from "./card";
import { CardCombination } from "./card-combination";


export class Stage {

    private _stagedCards: Card[] = [];

    constructor(
        private playerCards: Card[]
    ) { }

    public get stagedCards(): Card[] {
        return this._stagedCards;
    }

    static empty(): Stage {
        return new Stage([]);
    }

    clear() {
        // TODO: make class immutable?
        this._stagedCards = [];
    }


    isEmpty(): boolean {
        return this.stagedCards.length === 0;
    }

    contains(c: Card): boolean {
        return this._stagedCards.includes(c);
    }

    stageCard(card: Card): void {
        this._stagedCards.push(card);
    }

    unstageCard(card: Card): void {
        this._stagedCards = this._stagedCards.filter(c => c !== card);
    }

    // TODO: equip CardCombination class with means to check if it can beat other cardCombination and conver array to CardCombination for check
    canStage(card: Card, topOfDiscardPile: CardCombination) {
        return card.isRankHigherThan(topOfDiscardPile) && this.matchesStagedCards(card);
    }

    private matchesStagedCards(card: Card): boolean {
        // TODO handle more than single cards: for now, we simply allow staging, if nothing else was staged yet
        // logic:
        // if player starts a new round (last played cards were "pass" by all predecessors)
        // or if the new combination are all of the same rank 
        return this.isEmpty() || allSameRank(...this.stagedCards, card);
    }


}