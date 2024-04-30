import API from "../../core/api";
import { Session } from "../../core/session";

export default new API({
    params: "/:id",
    method: "GET",
    handler: ({ request, response }) => {
        response.send(Session.get(request.params.id));
    }
});