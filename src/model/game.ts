import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Player } from "./player";

export class Game {

    // stagedCards should also be stored on server
    // history of turns also
    constructor(
        private id: number,
        private players: Player[],
        private _cardsPerPlayer: Card[][],
        private _discardPile: CardCombination[],
        private _turnCount: number
    ) { };

    public get cardsPerPlayer(): Card[][] {
        return this._cardsPerPlayer;
    }

    public get discardPile(): CardCombination[] {
        return this._discardPile;
    }

    public get turnCount(): number {
        return this._turnCount;
    }

    // create GameImpl class for these methods
    // and use GameImpl instead of anonymous instances
    currentPlayerIndex(): number {
        return this.turnCount % this.players.length;
    }

    topOfDiscardPile(): CardCombination {
        if (this.discardPile.length === 0) {
            return CardCombination.TURN_PASSED_PLACEHOLDER;
        } else {
            const combinationOnTop = this.discardPile[this.discardPile.length - 1];
            return combinationOnTop;
        }
    }

    play(cardCombination: CardCombination): void {
        this.addToDiscardPile(cardCombination);
        this.removeFromCurrentPlayer(cardCombination);
        this._turnCount++;
    }

    private addToDiscardPile(cardCombination: CardCombination): void {
        this.discardPile.push(cardCombination);
    }

    private removeFromCurrentPlayer(cardCombination: CardCombination): void {
        const i: number = this.currentPlayerIndex();
        // TODO: we need to check against
        // the discard pile if the staged cards can really be played
        // (to prevent corrupting the game state)
        this.cardsPerPlayer[i] = this.cardsPerPlayer[i].filter(c => !cardCombination.cards.includes(c));
    }

}
