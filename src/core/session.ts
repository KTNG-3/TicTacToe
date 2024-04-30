import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
    playerId?: string;
    matchId?: string;
}

export class Session {
    static data: Record<string, SessionData> = {};

    static new() {
        const id = uuidv4();
        this.data[id] = {};

        return id;
    }

    static get(id: string) {
        return this.data[id];
    }

    static set(id: string, data: SessionData) {
        this.data[id] = {
            ...this.data[id],
            ...data
        };
    }
}