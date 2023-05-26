import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../model/card';
import { DecoratedCard } from '../../../model/decorated-card';

const PULSATION_PERIOD_IN_MILLISECONDS = 4000; // cf. with scss to align

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() decoratedCard!: DecoratedCard;

  isHighlightPlayable: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // We cannot directly bind decoratedCard.canBePlayed to the setting
    // of the CSS class "highlight-playable" because that would lead to
    // asynchronous pulsations of the cards
    // => therefore, we have to check for updates on the decoratedCard.canBePlayed
    //    manually in periodic intervals
    const checkUpdateInterval = 1000;
    setInterval(() => {
      this.updateIsHighlightPlayable();
    }, checkUpdateInterval);
  }


  private updateIsHighlightPlayable() {
    if (this.decoratedCard.canBePlayed) {
      this.activatePulsation();
    } else {
      this.isHighlightPlayable = false;
    }
  }

  private activatePulsation() {
    // we will set the "isHighlightPlayable" variable to true only at EPOCH times that
    // are divisible by 4s; this way, the CSS class "highlight-playable", which is bound to
    // the "isHighlightPlayable" variable, is added only at times that are multiples of 4s
    // ==> the animation that is defined in "highlight-playable" will thus start at these
    //     multiples of 4s for all cards
    const currentTime = Date.now();
    const msAfterPulsationStart = currentTime % PULSATION_PERIOD_IN_MILLISECONDS;
    const msUntilNextPulsation = PULSATION_PERIOD_IN_MILLISECONDS - msAfterPulsationStart;
    setTimeout(() => this.isHighlightPlayable = true, msUntilNextPulsation);
  }
}
