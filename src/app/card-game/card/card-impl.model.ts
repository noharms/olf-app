import { Card } from './card.model';
import { Rank } from './rank.model';
import { Suit } from './suit.model';

export class CardImpl implements Card {
  constructor(public rank: Rank, public suit: Suit, public faceUp: boolean) {}
}
