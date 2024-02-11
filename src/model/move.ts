import { CardCombination } from "./card-combination";
import { Player } from "./player";


export class Move {
    
    constructor(
        private _playerId: Player,
        private _cardCombi: CardCombination  
    ) {}

    public get cardCombi(): CardCombination {
        return this._cardCombi;
    }
    public get playerId(): Player {
        return this._playerId;
    }

}