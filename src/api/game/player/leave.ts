import API from "../../../core/api";
import { Status } from "../../../core/game";

import { MatchMaker } from "../../../core/matchMaker";

export default new API({
    params: "/:gameId/:playerId",
    method: "DELETE",
    handler: ({ request, response }) => {
        const match = MatchMaker.collection[request.params.gameId];
        if (!match) return response.sendStatus(400);

        if (match.game.status() !== Status.Non) {
            MatchMaker.delete(request.params.gameId);
        }
        else {
            delete match.player[request.params.playerId];
            MatchMaker.leave(request.params.gameId);
        }
        
        response.sendStatus(200);
    }
});