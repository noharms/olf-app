import { Component, OnInit, Input } from '@angular/core';
import { Card } from './card.model';
import { StyledCard } from './styled-card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() styledCard!: StyledCard;

  constructor() { }

  ngOnInit(): void {
  }

}
