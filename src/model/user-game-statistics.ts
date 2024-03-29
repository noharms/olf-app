import { Game } from "./game";


export interface IUserGameStatistics {
    totalGamesPlayed: number;
    numberOfWins: number;
    numberOfLosses(): number;
}

export const EMPTY_USER_STATISTICS: IUserGameStatistics = {
    totalGamesPlayed: 0,
    numberOfWins: 0,
    numberOfLosses: function (): number {
        return 0;
    }
}

export class UserGameStatistics implements IUserGameStatistics {

    constructor(
        private _totalGamesPlayed: number = 0,
        private _numberOfWins: number = 0
    ) { }

    public get numberOfWins(): number {
        return this._numberOfWins;
    }

    public get totalGamesPlayed(): number {
        return this._totalGamesPlayed;
    }

    numberOfLosses(): number {
        return this.totalGamesPlayed - this.numberOfWins;
    }

    static from(games: Game[], userId: number): UserGameStatistics {
        const userGames: Game[] = games.filter(g => g.participatingUserIds().includes(userId));
        const finishedGames: Game[] = userGames.filter(g => g.isFinished());
        return new UserGameStatistics(
            finishedGames.length,
            finishedGames.filter(g => g.getWinner()?.id === userId).length
        )
    }
}