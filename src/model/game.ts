import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Move } from "./move";
import { Player } from "./player";

export class Game {    
        
    // stagedCards should also be stored on server
    // history of turns also
    constructor(
        private _id: number,
        private _players: Player[],
        private _cardsPerPlayer: Card[][],
        private _discardPile: CardCombination[],
        private _turnCount: number,
        private _history: Move[]
    ) { };

    public get id(): number {
        return this._id;
    }
    public get players(): Player[] {
        return this._players;
    }
    public get cardsPerPlayer(): Card[][] {
        return this._cardsPerPlayer;
    }
    public get discardPile(): CardCombination[] {
        return this._discardPile;
    }
    public get turnCount(): number {
        return this._turnCount;
    }
    public get history(): Move[] {
        return this._history;
    }

    playerCount(): number {
        return this.players.length;
    }

    // create GameImpl class for these methods
    // and use GameImpl instead of anonymous instances
    currentPlayerIndex(): number {
        return this.turnCount % this.playerCount();
    }

    currentPlayer(): Player {
        return this.players[this.currentPlayerIndex()];
    }

    currentPlayerCards(): Card[] {
        return this.cardsPerPlayer[this.currentPlayerIndex()];
    }

    topOfDiscardPile(): CardCombination {
        return this.discardPile.length === 0
            ? CardCombination.TURN_PASSED_PLACEHOLDER
            : this.discardPile[this.discardPile.length - 1];
    }

}
