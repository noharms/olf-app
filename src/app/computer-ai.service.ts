import { Injectable } from '@angular/core';
import { Card, groupByRank } from 'src/model/card';
import { CardCombination } from 'src/model/card-combination';
import { Rank } from 'src/model/rank';

@Injectable({
  providedIn: 'root'
})
export class ComputerAiService {

  constructor() { }
  
  // TODO: not return undefined but a special CardCombination object?
  cardCombinationFromComputer(computerCards: Card[], cardCombiToBeat: CardCombination): CardCombination | undefined {
    // for now, let the computer always pass if the player played a combination instead of a single card
    const multiplicity: number = cardCombiToBeat.multiplicity();
    if (multiplicity === 1) {
      const cardToBeat: Card = cardCombiToBeat.cards[0];
      // for now, simply take the first encountered card that is higher than the card to beat
      return this.singleCardFromComputer(computerCards, cardToBeat);
    } else {
      // introduce a Player object and instance methods
      return this.nLingFromComputer(computerCards, cardCombiToBeat);
    }
  }

  private singleCardFromComputer(computerCards: Card[], cardToBeat: Card): CardCombination | undefined {
    for (const card of computerCards) {
      if (card.rank > cardToBeat.rank) {
        return new CardCombination([card]);
      }
    }
    return undefined;
  }

  private nLingFromComputer(computerCards: Card[], cardCombiToBeat: CardCombination): CardCombination | undefined {
    // TODO improve
    const groupedByRank: { [key in Rank]?: Card[] } = groupByRank(...computerCards);
    for (const card of computerCards) {
      const potentialNLing: Card[] | undefined = groupedByRank[card.rank];
      if (potentialNLing
        && potentialNLing.length === cardCombiToBeat.multiplicity()
        && card.rank > cardCombiToBeat.getUniqueRank()) {
        return new CardCombination(potentialNLing);
      }
    }
    return undefined;
  }
}
