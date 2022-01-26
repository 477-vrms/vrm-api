import expressWs, {Application} from "express-ws";
import express from "express";

export class Api {
    static default: Api = new Api();

    ws: expressWs.Instance;

    private constructor() {
        this.ws = expressWs(express());
    }

    get app(): Application {
        return this.ws.app;
    }

    static setUse(func: any) {
        this.default.app.use(func);
    }

    static setVoidApp(func: any) {
        this.default.app.use(func);
    }

    static setGetRoute(route: string, func: any) {
        this.default.app.get(route, func);
    }

    static setPostRoute(route: string, func: any) {
        this.default.app.post(route, func);
    }

    static setWs(route: string, func: any) {
        this.default.app.ws(route, func);
    }

    static listen(port: number | string) {
        this.default.app.listen(port);
    }
}