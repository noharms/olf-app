import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { CardView } from 'src/model/card-view';


const PULSATION_PERIOD_IN_MILLISECONDS = 4000; // cf. with scss to align

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('combinedAnimation', [
      state('wobble', style({
        transform: 'translateX(0)'
      })),
      state('lift', style({
        transform: 'translateY(-7px)',
        outline: '2px solid red',
        boxShadow: '0 0 5px 3px #ffbf00'
      })),
      transition('* => wobble', [
        animate('1s', keyframes([
          style({ transform: 'translateX(0%)', offset: 0 }),
          style({ transform: 'translateX(-10%)', offset: 0.15 }),
          style({ transform: 'translateX(8%)', offset: 0.30 }),
          style({ transform: 'translateX(-6%)', offset: 0.45 }),
          style({ transform: 'translateX(4%)', offset: 0.60 }),
          style({ transform: 'translateX(-2%)', offset: 0.75 }),
          style({ transform: 'translateX(0%)', offset: 1.0 })
        ]))
      ]),
      transition('* => lift', [
        animate('0.2s ease')
      ]),
      transition('lift => *', [
        animate('0.2s ease')
      ])
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input() cardView!: CardView;

  isHighlightPlayable: boolean = false;
  animationState: string = '';

  constructor() { }

  ngOnInit(): void {
    // We cannot directly bind cardView.canBePlayed to the setting
    // of the CSS class "highlight-playable" because that would lead to
    // asynchronous pulsations of the cards
    // => therefore, we have to check for updates on the cardView.canBePlayed
    //    manually in periodic intervals
    const checkIsUpdateNecessaryInterval = 1000;
    setInterval(() => {
      this.updateIsHighlightPlayable();
    }, checkIsUpdateNecessaryInterval);
  }


  private updateIsHighlightPlayable() {
    if (this.cardView.canBeStaged) {
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
  
  onHover() {
    if (this.cardView.staged) {
      // do nothing
    } else {
      if (this.cardView.canBeStaged) {
        this.animationState = 'lift';
      } else {
        this.animationState = 'wobble';
      }
    }
  }

  onHoverOut() {
    this.animationState = '';
  }
}
