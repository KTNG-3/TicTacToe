import { v4 as uuidv4 } from 'uuid';

export enum Player {
    Non,
    X,
    O
}

export type Baord = [
    Player, Player, Player,
    Player, Player, Player,
    Player, Player, Player
]

export enum Status {
    Non,
    X,
    O,
    Tie
}

export class Game {
    id: string = uuidv4();

    board: Baord = [
        Player.Non, Player.Non, Player.Non,
        Player.Non, Player.Non, Player.Non,
        Player.Non, Player.Non, Player.Non
    ];

    // x always start first
    turn: Player = Player.X;

    protected switchPlayer(player: Player): Player {
        if (player === Player.X) return Player.O;
        if (player === Player.O) return Player.X;
        return Player.Non;
    }

    // return is place success
    place(player: Player, position: number): boolean {
        if (this.turn !== player) return false;
        if (this.board[position] !== Player.Non) return false;
        if (this.status() !== Status.Non) return false;

        this.board[position] = player;
        this.turn = this.switchPlayer(player);
        return true;
    }

    status(): Status {
        const pos_win: Array<[number, number, number]> = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        for (const win of pos_win) {
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