import express from "express";

import { networkInterfaces } from "node:os";
import axios from "axios";

async function getLocalAddress(): Promise<string | undefined> {
    const nets = networkInterfaces();
    for (const key in nets) {
        const values = nets[key];

        if (values == undefined) continue;

        for (const net of values) {
            if (net.family != "IPv4") continue;
            if (net.internal) continue;

            try {
                await axios.get(`http://${net.address}:${PORT}`);

                return net.address;
            }
            catch (error) { }
        }
    }

    return undefined;
}

enum Player {
    Non,
    X,
    O
}

type Baord = [
    Player, Player, Player,
    Player, Player, Player,
    Player, Player, Player
]

type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type BoardPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

enum Status {
    Non,
    X,
    O,
    Tie
}

class Game {
    private pos_win: Array<[BoardIndex, BoardIndex, BoardIndex]> = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    board: Baord = [
        Player.Non, Player.Non, Player.Non,
        Player.Non, Player.Non, Player.Non,
        Player.Non, Player.Non, Player.Non
    ];

    reset() {
        this.board = [
            Player.Non, Player.Non, Player.Non,
            Player.Non, Player.Non, Player.Non,
            Player.Non, Player.Non, Player.Non
        ];
    }

    place(player: Player, position: BoardPosition): boolean {
        const index = position - 1;

        if (this.board[index] != Player.Non) return false;

        this.board[index] = player;
        return true;
    }

    status(): Status {
        for (const win of this.pos_win) {
            if (this.board[win[0]] == this.board[win[1]] && this.board[win[1]] == this.board[win[2]]) {
                if (this.board[win[0]] == Player.X) {
                    return Status.X;
                }
                
                if (this.board[win[0]] == Player.O) {
                    return Status.O;
                }
            }
        }

        for (const pos of this.board) {
            if (pos == Player.Non) {
                return Status.Non;
            }
        }

        return Status.Tie;
    }

    print() {
        const text = this.board.map(p => {
            switch (p) {
                case Player.Non: return "-"
                case Player.X: return "X"
                case Player.O: return "O"
            }
        });

        console.log(`${text[0]} ${text[1]} ${text[2]}\n${text[3]} ${text[4]} ${text[5]}\n${text[6]} ${text[7]} ${text[8]}`);
    }
}

const game = new Game();

const PORT = 4440;

const app = express();

let player: number = 0;
let turn: Player = Player.X;

import * as path from "node:path";

app.get("/", (_request, response) => {
    response.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/json", (_request, response) => {
    return response.send(game.board);
});

app.get("/player", (request, response) => {
    if (player == 0) {
        player++;
        response.send(String(Player.X));

        return;
    }
    
    if (player == 1) {
        player++;
        response.send(String(Player.O));

        return;
    }

    response.send(String(Player.Non));
});

function importPlayer(str: string): Player {
    const num = Number.parseInt(str);

    if (num == 1) {
        return Player.X;
    }

    if (num == 2) {
        return Player.O;
    }

    return Player.Non;
}

function importPosition(pos: string): BoardPosition {
    return <BoardPosition>Number.parseInt(pos);
}

function switchPlayer(ply: Player): Player {
    if (ply == Player.X) {
        return Player.O;
    }
    else if (ply == Player.O) {
        return Player.X;
    }

    return Player.Non;
}

app.get("/place/:player/:position", (request, response) => {
    const play = importPlayer(request.params.player);

    if (play != turn) {
        response.sendStatus(400);
        return;
    }
    turn = switchPlayer(turn);

    game.place(play, importPosition(request.params.position));

    response.sendStatus(200);
});

app.get("/print", (_request, response) => {
    game.print();
    console.log("--------");

    response.sendStatus(200);
});

app.get("/reset", (_request, response) => {
    game.reset();
    player = 0;

    response.sendStatus(200);
});

app.get("/status", (_request, response) => {
    response.send(String(game.status()));
});

app.get("/turn", (_request, response) => {
    response.send(String(turn));
});

app.listen(PORT, async () => {
    console.log(`listening at ${await getLocalAddress()}:${PORT}`);
});