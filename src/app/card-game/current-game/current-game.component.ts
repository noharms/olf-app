import { Component, OnInit } from '@angular/core';
import { Card } from '../card/card.model';
import { RANKS_2_TO_10, Rank } from '../card/rank.model';
import { Suit } from '../card/suit.model';
import { CardImpl } from '../card/card-impl.model';

@Component({
  selector: 'app-current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit {

  initialCardList: Card[] = [];
  playerCards: Card[] = [];
  computerCards: Card[] = [];

  constructor() { }

  ngOnInit(): void {
    this.createGame();
    this.distributeInitialCards();
  }

  createGame(): void {
    // Create cards for the initial game stack
    const suits = [Suit.Blue, Suit.Green, Suit.Colorless];
    const ranks = RANKS_2_TO_10;
    for (const suit of suits) {
      for (const rank of ranks) {
        this.initialCardList.push({ rank: rank, suit: suit, faceUp: false });
      }
    }
    const colorlessCards: Card[] = Array.from(
      { length: 4 },
      //() => (new CardImpl(Rank.One, Suit.Colorless ))
      () => ({ rank: Rank.One, suit: Suit.Colorless, faceUp: false})
    );
    this.initialCardList.push(...colorlessCards);
    this.shuffleCards(this.initialCardList);
  }

  distributeInitialCards(): void {
    this.playerCards = this.initialCardList.splice(0, 13);
    this.computerCards = this.initialCardList.splice(0, 13);
    this.revealCards(this.playerCards);
    this.revealCards(this.computerCards);
  }

  revealCards(cards: Card[]) {
    cards.forEach(card => {
      card.faceUp = true;
      return;
    });
  }

  shuffleCards(cards: Card[]): void {
    // Shuffle the cards using Fisher-Yates algorithm
    let currentIndex = cards.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }
  }
}
