

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

class UserGameStatistics implements IUserGameStatistics {
    totalGamesPlayed: number = 0;
    numberOfWins: number = 0;

    numberOfLosses(): number {
        return this.totalGamesPlayed - this.numberOfWins;
    }

}