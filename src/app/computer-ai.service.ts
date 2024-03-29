import { Injectable } from '@angular/core';
import { Card, groupByRank } from 'src/model/card';
import { CardCombination } from 'src/model/card-combination';
import { Rank } from 'src/model/rank';

@Injectable({
  providedIn: 'root'
})
export class ComputerAiService { // TODO this should not be a service but a utility

  private constructor() {
    // static utility
  }

  // TODO: not return undefined but a special CardCombination object?
  static chooseCards(cardsInHand: Card[], cardCombiToBeat: CardCombination): CardCombination {
    // for now, let the computer always pass if the player played a combination instead of a single card
    const multiplicity: number = cardCombiToBeat.multiplicity();
    if (multiplicity === 1) {
      const cardToBeat: Card = cardCombiToBeat.cards[0];
      // for now, simply take the first encountered card that is higher than the card to beat
      return this.singleCardFromComputer(cardsInHand, cardToBeat);
    } else {
      // introduce a Player object and instance methods
      return this.nLingFromComputer(cardsInHand, cardCombiToBeat);
    }
  }

  private static singleCardFromComputer(computerCards: Card[], cardToBeat: Card): CardCombination {
    for (const card of computerCards) {
      if (card.rank > cardToBeat.rank) {
        return new CardCombination([card]);
      }
    }
    return CardCombination.TURN_PASSED_PLACEHOLDER;
  }

  private static nLingFromComputer(computerCards: Card[], cardCombiToBeat: CardCombination): CardCombination {
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
    return CardCombination.TURN_PASSED_PLACEHOLDER;
  }
}
