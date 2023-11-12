import { Component, Input } from '@angular/core';
import { CardViewCombination } from 'src/model/card-combination-view';
import { CardView } from 'src/model/card-view';

@Component({
  selector: 'app-card-combination',
  templateUrl: './card-combination.component.html',
  styleUrls: ['./card-combination.component.scss']
})
export class CardCombinationComponent {

  @Input() cardViewCombination!: CardViewCombination;
}
