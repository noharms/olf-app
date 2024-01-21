import { Injectable } from '@angular/core';
import { Game } from 'src/model/game';
import { createGame } from 'src/model/game-factory';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: Game;

  constructor() {
    // TODO: currently, whenever the service is injected, this creates a new game; instead it needs to return the one for a given a gameId from the backend
    this.game = createGame();
  }

  // TODO: replace by game from backend (or cache, if backend was already called once)
  // TODO: use game id, if multiple games can run side by side on a server
  public getGame(): Game {
    return this.game;
  }

  
}
