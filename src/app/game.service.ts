import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardCombination } from 'src/model/card-combination';
import { Game } from 'src/model/game';
import { GameInvitation } from 'src/model/game-invitation/game-invitation';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { CompletedAction } from 'src/model/game-invitation/user-response';
import { User } from 'src/model/user';
import { MOCK_GAMES, MOCK_INVITATION_STATUS, createMockGame, createMockInvitation, updateBackendGame } from '../mocks/mock-game-data';

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

  createGame(players: User[]): Game {
    // TODO: replace by backend call
    const newGame: Game = createMockGame(players);
    MOCK_GAMES.push(newGame);
    return newGame;
  }

  createInvitation(creator: User, invitees: User[]): GameInvitationStatus {
    // TODO: replace by backend call
    const newInvitation: GameInvitation = createMockInvitation(creator, invitees);
    const invitationStatus: GameInvitationStatus = new GameInvitationStatus(newInvitation, []);
    MOCK_INVITATION_STATUS.push(invitationStatus);
    return invitationStatus;
  }

  getGames(userId: number): Observable<Game[]> {
    const games: Game[] = MOCK_GAMES.filter(g => g.participatingUserIds().includes(userId));
    return of(games);
  }

  getUpcomingGames(userId: number): Observable<GameInvitationStatus[]> {
    const upcomingGames: GameInvitationStatus[] = MOCK_INVITATION_STATUS.filter(g => g.playerIds().includes(userId));
    return of(upcomingGames);
  }

  /**
   * @returns an observable for the updated game
   */
  commitStagedCards(gameId: number, cardCombination: CardCombination): Observable<Game> {
    return updateBackendGame(gameId, cardCombination);
  }

  addResponseToInvitation(gameInvitationId: number, newResponse: CompletedAction) {
    return
  }


}
