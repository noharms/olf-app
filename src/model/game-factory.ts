import { Card } from "./card";
import { RANKS_2_TO_10, Rank } from "./rank";
import { Suit } from "./suit";
import { Game } from "./game";
import { COMPUTER_PLAYER, PLAYER1, Player } from "./player";

const CARDS_PER_PLAYER = 3; // reduced for testing
const ONES_PER_PLAYER_COUNT = 4;

export function createGame(): Game {

    let players: Player[] = createPlayers();
    let allCards: Card[] = createAllCardsForGame();
    shuffleCards(allCards);
    let cardsPerPlayer: Card[][] = distributeCards(players, allCards);
    // TODO get id from server
    return new Game(0, players, cardsPerPlayer, [], 0);
}

function distributeCards(players: Player[], allCards: Card[]) {
    let cardsPerPlayer: Card[][] = [[]];
    for (let i = 0; i < players.length; ++i) {
        cardsPerPlayer[i] = allCards.splice(0, CARDS_PER_PLAYER);
    }
    return cardsPerPlayer;
}

function createPlayers(): Player[] {
    return [
        PLAYER1,
        COMPUTER_PLAYER
    ];
}

function createAllCardsForGame(): Card[] {
    let allCardsInGame: Card[] = [];
    let cardId = 0;
    const suits = [Suit.Blue, Suit.Green, Suit.Colorless];
    const ranks = RANKS_2_TO_10;
    for (const suit of suits) {
        for (const rank of ranks) {
            const newCard = { id: cardId, rank: rank, suit: suit };
            allCardsInGame.push(newCard);
            ++cardId;
        }
    }
    for (let i = 0; i < ONES_PER_PLAYER_COUNT; i++) {
        const newCard = { id: cardId + i, rank: Rank.One, suit: Suit.Colorless };
        allCardsInGame.push(newCard);
    }
    return allCardsInGame;
}


// Shuffle the cards using Fisher-Yates algorithm
function shuffleCards(cards: Card[]): void {
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