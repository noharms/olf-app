import { Player } from "src/model/player";

export function concatPlayerNames(players: Player[]): string {
    return players.map(p => p.playerName()).join(", ")
}