import API from "../../core/api";

import { MatchMaker } from "../../core/matchMaker";

export default new API({
    params: "/:playerId",
    method: "GET",
    handler: ({ request, response }) => {
        response.send(MatchMaker.get(request.params.playerId));
    }
});