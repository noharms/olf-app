import { concatPlayerNames } from "src/utils/user-utils";
import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Move } from "./move";
import { Player } from "./player";
import { User } from "./user";

export class Game {

    static readonly EMPTY_GAME: Game = new Game(
        -1,
        [],
        [],
        0,
        []
    );

    // stagedCards should also be stored on server
    // history of turns also
    constructor(
        private _id: number,
        private _players: Player[], // both human and computer players contained
        private _cardsPerPlayer: Card[][],
        private _turnCount: number,
        private _history: Move[]
    ) {
        if (this.players.length != this.cardsPerPlayer.length) {
            throw new Error("Invalid arguments to Game class.");
        }
    };

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
        return this.history.map(move => move.cardCombi);
    }

    // at the beginning of a game the turn should be == 1
    public get turnCount(): number {
        return this._turnCount;
    }
    public get history(): Move[] {
        return this._history;
    }

    playerCount(): number {
        return this.players.length;
    }

    // returns -1 if not found
    playerIndex(player: Player): number {
        const result: number = this.players.findIndex(p => player.playerName() == p.playerName());
        // TODO improve this by changing Player interface
        if (result === -1) {
            console.log(`Player with name ${player.playerName()} could not be found.`);
        }
        return result;
    }

    playerIndexOnTurn(): number {
        // -1 because player index is 0-based, while turnCount 1-based
        return (this.turnCount - 1) % this.playerCount();
    }

    playerOnTurn(): Player {
        return this.players[this.playerIndexOnTurn()];
    }

    cardsOfPlayerOnTurn(): Card[] {
        return this.cardsPerPlayer[this.playerIndexOnTurn()];
    }

    topOfDiscardPile(): CardCombination {
        return this.discardPile.length === 0
            ? CardCombination.TURN_PASSED_PLACEHOLDER
            : this.discardPile[this.discardPile.length - 1];
    }

    participatingUserIds(): number[] {
        return this.players.filter(p => p instanceof User).map(p => (p as User).id);
    }

    isFinished(): boolean {
        return this.cardsPerPlayer.map(cards => cards.length).includes(0);
    }

    getWinner(): Player | undefined {
        for (let i = 0; i < this.playerCount(); ++i) {
            if (this.cardsPerPlayer[i].length === 0) {
                return this.players[i];
            }
        }
        return undefined;
    }

    getHistoryString(): string {
        return this
            .history
            .map(move => move.player.playerName() + " " + move.cardCombi.toUIString())
            .join(", ");
    }

    getPlayersString(): string {
        return concatPlayerNames(this.players);
    }

    getPlayerCardsAfterMove(playerIndex: number, move: CardCombination): Card[] {
        return this.cardsPerPlayer[playerIndex].filter(c => !move.cards.includes(c))
    }

    getUpdatedDiscardPile(currentPlayerMove: CardCombination): CardCombination[] {
        const oldDiscardPile: CardCombination[] = this.discardPile;
        const newDiscardPile: CardCombination[] = [...oldDiscardPile];
        newDiscardPile.push(currentPlayerMove);
        return newDiscardPile;
    }

    getUpdatedHistory(currentPlayerMove: CardCombination): Move[] {
        return this.history.concat(new Move(this.playerOnTurn(), currentPlayerMove));
    }

    /**
     * 
     * @param fromIncl start at this index and copy all following players until (inclusive) toIndex
     * @param toIncl note that toIndex can be smaller than fromIndex: in that case the
     * returned players array will be [fromIndex, end] + [0, toIndex]
     */
    slicePlayers(fromIncl: number, toIncl: number): Player[] {
        if (toIncl >= fromIncl) {
            return this.players.slice(fromIncl, toIncl + 1);
        } else {
            const untilEnd: Player[] = this.players.slice(fromIncl, this.playerCount());
            const from0: Player[] = this.players.slice(0, toIncl + 1);
            return untilEnd.concat(from0);
        }
    }

}
