import { concatPlayerNames } from "src/utils/user-utils";
import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Move } from "./move";
import { User } from "./user";
import { Player } from "./player";

export class Game {

    static readonly EMPTY_GAME: Game = new Game(
        -1,
        [],
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
        private _discardPile: CardCombination[],
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
        return this.history.concat(new Move(this.currentPlayer(), currentPlayerMove));
    }

}
