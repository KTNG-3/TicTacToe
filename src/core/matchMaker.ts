import { Game, Player, Status } from "./game";
import { Users } from "./user";

export interface MatchMakerGame {
    game: Game;
    player: Record<string, Player>;
    move: Array<number>;
}

export class MatchMaker {
    static host: string | null = null;
    static match: Record<string, string> = {};

    static join(playerId: string) {
        if (this.host == playerId) return;
        if (!this.host) {
            this.host = playerId;
            return;
        }

        const game = new Game();

        this.match[this.host] = game.id;
        this.match[playerId] = game.id;
        this.collection[game.id] = {
            game: game,
            player: {},
            move: [],
        };
        this.collection[game.id].player[this.host] = Player.X;
        this.collection[game.id].player[playerId] = Player.O;
        this.host = null;
    }

    static get(playerId: string) {
        const gameId = this.match[playerId];
        if (!gameId) return null;

        return gameId;
    }

    static collection: Record<string, MatchMakerGame> = {};

    static gameInfo(gameId: string) {
        const match = this.collection[gameId];
        let status: number = match.game.status();
        if (Object.keys(match.player).length < 2) status = -1;

        return {
            game: match.game.board,
            status: status,
            turn: match.game.turn,
            player: match.player
        };
    }

    static place(gameId: string, playerId: string, position: number): boolean {
        const match = this.collection[gameId];
        if (!match) return false;

        const player = match.player[playerId];
        if (!player) return false;

        match.move.push(position);
        return match.game.place(player, position);
    }

    static leave(gameId: string) {
        const match = this.collection[gameId];
        if (!match) return;

        Object.keys(match.player).forEach(playerId => {
            Users.addHistory(playerId, {
                player: match.player,
                move: match.move,
                id: gameId,
                timestamp: Date.now(),
                status: this.gameInfo(gameId).status
            });

            delete this.match[playerId];
        });
    }

    static delete(gameId: string) {
        this.leave(gameId);

        delete this.collection[gameId];
    }
}