import API from "../../core/api";

import { join } from "node:path";

export default new API({
    method: "GET",
    handler: ({ response }) => {
        response.sendFile(join(process.cwd(), "src", "pages", "game.html"));
    }
});