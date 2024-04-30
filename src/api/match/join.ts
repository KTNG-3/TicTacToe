import API from "../../core/api";

import { MatchMaker } from "../../core/matchMaker";

export default new API({
    params: "/:playerId",
    method: "POST",
    handler: ({ request, response }) => {
        MatchMaker.join(request.params.playerId);

        response.sendStatus(200);
    }
});