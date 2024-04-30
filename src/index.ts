import express from "express";

import { networkInterfaces } from "node:os";
import axios from "axios";
import { Game } from "./core/game";

async function getLocalAddress(): Promise<string | undefined> {
    const nets = networkInterfaces();
    for (const key in nets) {
        const values = nets[key];

        if (values == undefined) continue;

        for (const net of values) {
            if (net.family != "IPv4") continue;
            if (net.internal) continue;

            try {
                await axios.get(`http://${net.address}:${PORT}`);

                return net.address;
            }
            catch (error) { }
        }
    }

    return undefined;
}

const PORT = 4440;

const collection: Record<string, Game> = {};

import * as path from "node:path";
import * as fs from "node:fs";

import API from "./core/api";

const app = express();

async function apiBuilder(basePath: string, subPath: Array<string> = []) {
    const dir = path.join(basePath, ...subPath);

    for (const name of fs.readdirSync(dir)) {
        const apiDir = path.join(dir, name);

        if (fs.lstatSync(apiDir).isDirectory()) {
            apiBuilder(basePath, [...subPath, name]);
            continue;
        }

        const api: API = (await import(apiDir)).default;
        const apiPath = `/${[...subPath, path.parse(name).name].join("/")}${api.params}`.replace("/index", "");

        console.log(`[${api.method}] ${apiPath}`);

        switch (api.method) {
            case "GET": {
                app.get(apiPath, api.handler);
            }
            case "POST": {
                app.post(apiPath, api.handler);
            }
            case "PUT": {
                app.put(apiPath, api.handler);
            }
            case "DELETE": {
                app.delete(apiPath, api.handler);
            }
        }
    }
}

(async () => {
    await apiBuilder(path.join(process.cwd(), "src", "api"));

    app.use(express.json());

    app.listen(PORT, async () => {
        console.log(`listening at ${await getLocalAddress()}:${PORT}`);
    });
})();