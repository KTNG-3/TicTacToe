import API from "../../core/api";
import { Session } from "../../core/session";

export default new API({
    params: "/:id",
    method: "PUT",
    handler: ({ request, response }) => {
        Session.set(request.params.id, request.body);

        response.sendStatus(200);
    }
});