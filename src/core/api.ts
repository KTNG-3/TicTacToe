import { Request, Response, RequestHandler } from "express";

export interface ExecuteParams {
    request: Request,
    response: Response
}

export interface APIConstructor {
    params?: string;
    method: "GET" | "POST" | "PUT" | "DELETE"
    handler: (data: ExecuteParams) => void;
}

export default class API {
    params: APIConstructor["params"];
    method: APIConstructor["method"];
    handler: RequestHandler;

    constructor(data: APIConstructor) {
        this.params = data.params || "/";
        this.method = data.method;
        this.handler = (req, res) => {
            data.handler({
                request: req,
                response: res
            });
        };
    }
}