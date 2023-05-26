import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const NEW_GAME_KEY = 'new-game';
const REDIRECT_TO_STATS_KEY = 'my-stats';

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.scss']
})
export class GameOverModalComponent {
  @Input() message!: string;

  constructor(public activeModal: NgbActiveModal) { }

  onNewGame() {
    this.activeModal.close(NEW_GAME_KEY);
  }

  onMyStats() {
    this.activeModal.close(REDIRECT_TO_STATS_KEY);
  }
}