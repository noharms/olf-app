import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardCombination } from 'src/model/card-combination';
import { Game } from 'src/model/game';
import { GAMES, updateBackendGame } from './mock-game-data';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  constructor(
    private http: HttpClient
  ) {
  }
  
  // TODO: replace by game from backend (or cache, if backend was already called once)    
  public getGame(gameId: number): Observable<Game> {
    // const url = 'dummy'; //`${this.apiUrl}/${gameId}`;
    // return this.http.get<Game>(url);
    const game: Game = GAMES.find(g => g.id === gameId)!;
    return of(game);
  }

  /**
   * @returns an observable for the updated game
   */
  commitStagedCards(gameId: number, cardCombination: CardCombination): Observable<Game> {
    return updateBackendGame(gameId, cardCombination);
  }
  
  public getAllGames(userId: number): Observable<Game[]> {
    const games: Game[] = GAMES.filter(g => g.players.map(p => p.userId).find(id => id === userId) !== undefined);
    return of (games);
  }

}
