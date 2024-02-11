import { Card } from "./card";
import { Game } from "./game";
import { Player } from "./player";
import { Rank } from "./rank";
import { Suit } from "./suit";

const CARDS_PER_PLAYER = 10; // reduced for testing
const ONES_PER_PLAYER_COUNT = 8;
const RANKS_IN_GAME = [Rank.Two, Rank.Three, Rank.Four, Rank.Five]; //RANKS_2_TO_10;

export function createGame(gameId: number, players: Player[]): Game {
    let allCards: Card[] = createAllCardsForGame();
    shuffleCards(allCards);
    let cardsPerPlayer: Card[][] = distributeCards(players, allCards);
    // TODO get id from server
    return new Game(gameId, players, cardsPerPlayer, [], 0, []);
}

function distributeCards(players: Player[], allCards: Card[]) {
    let cardsPerPlayer: Card[][] = [[]];
    for (let i = 0; i < players.length; ++i) {
        cardsPerPlayer[i] = allCards.splice(0, CARDS_PER_PLAYER);
    }
    return cardsPerPlayer;
}

function createAllCardsForGame(): Card[] {
    let allCardsInGame: Card[] = [];
    let cardId = 0;
    const suits: Suit[] = Object.values(Suit);
    for (const suit of suits) {
        const allRanks: Card[] = createAllCardsForSuit(suit, cardId);
        allCardsInGame.push(...allRanks);
        cardId += allRanks.length;
    }
    const allOnes: Card[] = createAllOnes(cardId);
    allCardsInGame.push(...allOnes);
    cardId += allOnes.length;
    return allCardsInGame;
}

function createAllCardsForSuit(suit: Suit, startId: number): Card[] {
    const allRanks: Card[] = []
    for (const rank of RANKS_IN_GAME) {
        const newCard = new Card(startId++, rank, suit);
        allRanks.push(newCard);
    }
    return allRanks;
}

function createAllOnes(startId: number): Card[] {
    const allOnes: Card[] = []
    for (let i = 0; i < ONES_PER_PLAYER_COUNT; i++) {
        const newCard = new Card(startId++, Rank.One, Suit.Colorless);
        allOnes.push(newCard);
    }
    return allOnes;
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