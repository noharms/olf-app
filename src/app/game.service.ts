import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardCombination } from 'src/model/card-combination';
import { Game } from 'src/model/game';
import { MOCK_GAMES, updateBackendGame } from '../mocks/mock-game-data';
import { createGame } from 'src/model/game-factory';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private http: HttpClient
  ) {
  }

  // TODO: replace by game from backend (or cache, if backend was already called once)    
  getGame(gameId: number): Observable<Game> {
    // const url = 'dummy'; //`${this.apiUrl}/${gameId}`;
    // return this.http.get<Game>(url);
    const game: Game = MOCK_GAMES.find(g => g.id === gameId)!;
    return of(game);
  }

  createNewGame(players: User[]): Game {
    const newGame: Game = createGame(MOCK_GAMES.length, players);
    MOCK_GAMES.push(newGame);
    return newGame;
  }

  getAllGames(userId: number): Observable<Game[]> {
    const games: Game[] = MOCK_GAMES.filter(g => g.participatingUserIds().includes(userId));
    return of(games);
  }

  /**
   * @returns an observable for the updated game
   */
  commitStagedCards(gameId: number, cardCombination: CardCombination): Observable<Game> {
    return updateBackendGame(gameId, cardCombination);
  }


}
