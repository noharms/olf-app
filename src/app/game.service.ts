import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardCombination } from 'src/model/card-combination';
import { Game } from 'src/model/game';
import { GameInvitation } from 'src/model/game-invitation/game-invitation';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { CompletedAction, InvitationAction } from 'src/model/game-invitation/user-response';
import { User } from 'src/model/user';
import { MOCK_GAMES, MOCK_INVITATION_STATUS as MOCK_INVITATION_STATUSES, createMockGame, createMockInvitation, updateBackendGame } from '../mocks/mock-game-data';

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

  createGame(humanPlayers: User[], nComputers: number): Game {
    // TODO: replace by backend call
    const newGame: Game = createMockGame(humanPlayers, nComputers);
    MOCK_GAMES.push(newGame);
    return newGame;
  }

  createInvitation(creator: User, invitees: User[], nComputers: number): GameInvitationStatus {
    // TODO: replace by backend call
    const newInvitation: GameInvitation = createMockInvitation(creator, invitees, nComputers);
    const invitationStatus: GameInvitationStatus = new GameInvitationStatus(newInvitation, []);
    MOCK_INVITATION_STATUSES.push(invitationStatus);
    return invitationStatus;
  }

  getGames(userId: number): Observable<Game[]> {
    const games: Game[] = MOCK_GAMES.filter(g => g.participatingUserIds().includes(userId));
    return of(games);
  }

  getUpcomingGames(userId: number): Observable<GameInvitationStatus[]> {
    const upcomingGames: GameInvitationStatus[] = MOCK_INVITATION_STATUSES.filter(g => g.userIds().includes(userId));
    return of(upcomingGames);
  }

  /**
   * @returns an observable for the updated game
   */
  commitStagedCards(gameId: number, cardCombination: CardCombination): Observable<Game> {
    return updateBackendGame(gameId, cardCombination);
  }

  // TODO replace by backend
  updateInvitationWith(
    invitationId: number,
    action: InvitationAction,
    actingUser: User
  ): Observable<GameInvitationStatus[]> {
    const invitationStatus: GameInvitationStatus | undefined =
      MOCK_INVITATION_STATUSES
        .find(status => status.invitation.id === invitationId);
    return new Observable(
      subscriber => {
        if (invitationStatus) {
          invitationStatus.addResponse(
            {
              registeredAt: new Date(),
              user: actingUser,
              action: action
            }
          )
          if (InvitationAction.START === action) {
            MOCK_INVITATION_STATUSES.splice(
              MOCK_INVITATION_STATUSES.findIndex(status => status === invitationStatus),
              1
            );
            this.createGame(invitationStatus.getInvolvedUsers(), invitationStatus.invitation.nComputerPlayers);
          }
          subscriber.next(MOCK_INVITATION_STATUSES);
          subscriber.complete();
        } else {
          subscriber.error(
            new Error(`Invitation with id ${invitationId} not found.`)
          )
        };
      }
    );
  }

}
