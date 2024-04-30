import { v4 as uuidv4 } from 'uuid';
import { MatchMakerGame } from './matchMaker';

export interface UserMatchHistory extends Omit<MatchMakerGame, "game"> {
    id: string;
    timestamp: number;
    status: number;
}

export interface User {
    name: string;
    id: string;
    history: Array<UserMatchHistory>;
}

export class Users {
    static collection: Record<string, User> = {};

    static new(name: string): User {
        const user: User = {
            name: name,
            id: uuidv4(),
            history: []
        }
        
        this.collection[user.id] = user;
        return user;
    }

    static getId(userId: string): User | null {
        if (!this.collection[userId]) return null;

        return this.collection[userId];
    }

    static getName(name: string): User {
        const user = Object.values(this.collection).find(x => x.name === name);
        if (!user) return this.new(name);

        return this.collection[user.id];
    }

    static addHistory(userId: string, history: UserMatchHistory) {
        if (this.collection[userId].history.find(x => x.id)) return;

        this.collection[userId].history.push(history);
    }
}