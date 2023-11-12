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

    public set discardPile(value: CardCombination[]) {
        this._discardPile = value;
    }

    public get turnCount(): number {
        return this._turnCount;
    }

    public set turnCount(value: number) {
        this._turnCount = value;
    }
    

    // create GameImpl class for these methods
    // and use GameImpl instead of anonymous instances
    getCurrentTurnsPlayer() {
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

}
