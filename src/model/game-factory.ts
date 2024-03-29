import { ComputerAiService } from "src/app/computer-ai.service";
import { Card } from "./card";
import { CardCombination } from "./card-combination";
import { Game } from "./game";
import { Move } from "./move";
import { Rank } from "./rank";
import { Suit } from "./suit";
import { User } from "./user";

const COUNT_ONES_PER_PLAYER = 8;
const RANKS_IN_GAME = [Rank.Two, Rank.Three, Rank.Four, Rank.Five]; //RANKS_2_TO_10;

export function createGame(gameId: number, players: User[]): Game {
    const playerCount = players.length;
    let allCards: Card[] = createAllCardsForGame(playerCount);
    shuffleCards(allCards);
    let cardsPerPlayer: Card[][] = distributeCards(playerCount, allCards);
    // TODO get id from server
    return new Game(gameId, players, cardsPerPlayer, [], 0, []);
}

function distributeCards(playerCount: number, allCards: Card[]) {
    const totalCardCount: number = allCards.length;
    const initialHandSize = (totalCardCount - 2) / playerCount;
    let cardsPerPlayer: Card[][] = [[]];
    for (let i = 0; i < playerCount; ++i) {
        cardsPerPlayer[i] = allCards.splice(0, initialHandSize);
        if (cardsPerPlayer[i].length < initialHandSize) {
            throw new Error(
                `Not enough cards in game (only ${totalCardCount}) for ${playerCount} players.`
            );
        }
    }
    const remainingCards: Card[] = allCards;
    console.log(`Cards in the pot ${remainingCards}`);
    return cardsPerPlayer;
}

function createAllCardsForGame(playerCount: number): Card[] {
    let allCardsInGame: Card[] = [];
    let cardId = 0;
    const suits: Suit[] = Object.values(Suit);
    if (playerCount > suits.length) {
        throw new Error(
            `Not enough suits (only ${suits.length} but need ${playerCount} for ${playerCount} players).`
        );
    }
    for (let i = 0; i < playerCount; ++i) {
        const suit: Suit = suits[i];
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
    for (let i = 0; i < COUNT_ONES_PER_PLAYER; i++) {
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

export function createFinishedGame(gameId: number, players: User[]): Game {
    let gameToPlay: Game = createGame(gameId, players);
    while (!gameToPlay.isFinished()) {
        const currentPlayerIndex: number = gameToPlay.currentPlayerIndex();
        const cardsInHand: Card[] = gameToPlay.cardsPerPlayer[currentPlayerIndex];
        const cardsToBeat: CardCombination = gameToPlay.topOfDiscardPile();
        const cardsToPlay: CardCombination = ComputerAiService.chooseCards(cardsInHand, cardsToBeat);
        const updatedCards: Card[][] = gameToPlay.getUpdatedCards(cardsToPlay);
        const updatedDiscardPile: CardCombination[] = gameToPlay.getUpdatedDiscardPile(cardsToPlay);
        const updatedHistory: Move[] = gameToPlay.getUpdatedHistory(cardsToPlay);
        gameToPlay = new Game(
            gameToPlay.id,
            gameToPlay.players,
            updatedCards,
            updatedDiscardPile,
            gameToPlay.turnCount + 1,
            updatedHistory
        );
    }
    return gameToPlay;
}