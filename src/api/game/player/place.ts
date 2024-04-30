import API from "../../../core/api";

import { MatchMaker } from "../../../core/matchMaker";

export default new API({
    params: "/:gameId/:playerId/:position",
    method: "PUT",
    handler: ({ request, response }) => {
        if (!MatchMaker.place(request.params.gameId, request.params.playerId, Number.parseInt(request.params.position))) response.sendStatus(400);

        response.send(MatchMaker.gameInfo(request.params.gameId));
    }
});