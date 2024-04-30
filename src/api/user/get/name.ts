import API from "../../../core/api";
import { Users } from "../../../core/user";

export default new API({
    params: "/:name",
    method: "GET",
    handler: ({ request, response }) => {
        response.send(Users.getName(request.params.name));
    }
});