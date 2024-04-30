import API from "../../core/api";
import { Session } from "../../core/session";

export default new API({
    method: "POST",
    handler: ({ response }) => {
        response.send(Session.new());
    }
});