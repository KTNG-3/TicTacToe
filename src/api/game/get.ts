import API from "../../core/api";

import { MatchMaker } from "../../core/matchMaker";

export default new API({
    params: "/:gameId",
    method: "GET",
    handler: ({ request, response }) => {
        const match = MatchMaker.collection[request.params.gameId];
        if (!match) return response.sendStatus(400);

        response.send(MatchMaker.gameInfo(match.game.id));
    }
});