import { CardCombination } from "./card-combination";
import { User } from "./user";


export class Move {

    constructor(
        private _player: User,
        private _cardCombi: CardCombination
    ) { }

    public get cardCombi(): CardCombination {
        return this._cardCombi;
    }
    public get player(): User {
        return this._player;
    }

}