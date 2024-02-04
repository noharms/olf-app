import { allSameRank } from "./card";
import { CardViewCombination } from "./card-combination-view";
import { CardView } from "./card-view";
import { Game } from "./game";
import { toCardViews, toCards } from "./model-view-conversions";



/**
 * A class to model the visualisation of a game, in particular the staging.
 * 
 * That is a GameView
 * will hold cardView objects rather than pure card objects, where
 * a cardView describes the card's properties needed for visualisation
 * (e.g. faceUp, staged, ...)
 */
export class GameView {

    // TODO: currently we expose the fields so that the clients have direct access and can change properties from outside
    //       probably it would be better to change that logic somehow to have an explicit API in this class to modify states
    // TODO: maybe introduce staged list/set
    // TODO: maybe refactor staging logic to create correctly set "canStage" property when calling getPlayerCards(i) which can look at the current stage
    private constructor(
        public playerCards: CardView[][],
        public topOfDiscardPile: CardViewCombination,
    ) {

    };

    static from(game: Game): GameView {
        const cardViews: CardView[][] = new Array(game.playerCount());
        for (let i = 0; i < game.playerCount(); ++i) {
            cardViews[i] = toCardViews(game.cardsPerPlayer[i], true, false);
        }
        return new GameView(cardViews, game.topOfDiscardPile().toView(true, false))
    }

    stagedCards(playerIndex: number): CardView[] {
        return this.playerCards[playerIndex].filter(card => card.staged);
    }

    updateStagedProperty(): void {
        for (let i = 0; i < this.playerCards.length; ++i) {
            for (const playerCard of this.playerCards[i]) {
                playerCard.canBeStaged = this.isCompatibleWithDiscardPile(playerCard) && this.isCompatibleWithStage(playerCard, i);
            }
        }
    }

    private isCompatibleWithDiscardPile(playerCard: CardView): boolean {
        return playerCard.isRankHigherThan(this.topOfDiscardPile.toModel());
    }

    private isCompatibleWithStage(cardView: CardView, playerIndex: number): boolean {
        // TODO handle more than single cards: for now, we simply allow staging, if nothing else was staged yet
        // logic:
        // if player starts a new round (last played cards were "pass" by all predecessors)
        // or if the new combination are all of the same rank 
        return this.isStageEmpty(playerIndex) ||
            allSameRank(...toCards(this.stagedCards(playerIndex)), cardView.card);
    }

    private isStageEmpty(playerIndex: number): boolean {
        return this.stagedCards(playerIndex).length === 0;
    }

}