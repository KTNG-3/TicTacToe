import API from "../../../core/api";
import { Users } from "../../../core/user";

export default new API({
    params: "/:id",
    method: "GET",
    handler: ({ request, response }) => {
        const user = Users.getId(request.params.id);
        if (!user) response.sendStatus(400);

        response.send(user);
    }
});