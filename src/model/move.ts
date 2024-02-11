import { CardCombination } from "./card-combination";
import { Player } from "./player";


export class Move {
    
    constructor(
        private _player: Player,
        private _cardCombi: CardCombination  
    ) {}

    public get cardCombi(): CardCombination {
        return this._cardCombi;
    }
    public get player(): Player {
        return this._player;
    }

}