import { Component, Input } from '@angular/core';
import { toCardViewCombinations } from 'src/model/model-view-conversions';
import { Move } from 'src/model/move';

@Component({
  selector: 'app-player-move',
  templateUrl: './player-move.component.html',
  styleUrls: ['./player-move.component.scss']
})
export class PlayerMoveComponent {

  @Input() playerMove!: Move;

}
