import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Move } from "./move";
import { Player } from "./player";

export class Game {

    // stagedCards should also be stored on server
    // history of turns also
    constructor(
        private id: number,
        private players: Player[],
        private _cardsPerPlayer: Card[][],
        private _discardPile: CardCombination[],
        private _turnCount: number,
        private history: Move[]
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

    playerCount(): number {
        return this.players.length;
    }

    // create GameImpl class for these methods
    // and use GameImpl instead of anonymous instances
    currentPlayerIndex(): number {
        return this.turnCount % this.playerCount();
    }

    currentPlayerCards(): Card[] {
        return this.cardsPerPlayer[this.currentPlayerIndex()];
    }

    topOfDiscardPile(): CardCombination {
        return this.discardPile.length === 0
            ? CardCombination.TURN_PASSED_PLACEHOLDER
            : this.discardPile[this.discardPile.length - 1];
    }

    // TODO once we have a backend, this should be done in the backend
    play(cardCombination: CardCombination): void {
        this.addToDiscardPile(cardCombination);
        this.removeFromCurrentPlayer(cardCombination);
        this.addToHistory(cardCombination);
        this._turnCount++; // this should be at the end because other methods might use it before
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
    
    private addToHistory(cardCombination: CardCombination): void {
        this.history.push(new Move(this.players[this.currentPlayerIndex()], cardCombination));
    }

}
