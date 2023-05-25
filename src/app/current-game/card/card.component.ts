import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../model/card';
import { DecoratedCard } from '../../../model/decorated-card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() decoratedCard!: DecoratedCard;

  constructor() { }

  ngOnInit(): void {
  }

}
