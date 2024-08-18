import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export const NEW_GAME_KEY = 'new-game';
export const REDIRECT_TO_STATS_KEY = 'my-stats';

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.scss']
})
export class GameOverModalComponent {
  @Input() message!: string;

  constructor(
    public dialogRef: MatDialogRef<GameOverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  onNewGame() {
    this.dialogRef.close(NEW_GAME_KEY);
  }

  onMyStats() {
    this.dialogRef.close(REDIRECT_TO_STATS_KEY);
  }
}