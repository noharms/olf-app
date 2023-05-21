import { Component, OnInit, Input } from '@angular/core';
import { Card } from './model/card';
import { StyledCard } from './model/styled-card';

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
