import {Request, Response} from "express";
import expressWs, {WebsocketRequestHandler} from "express-ws";
import {decodeIDToken} from "../utils/auth";
import * as ws from 'ws';
import {MyFbRTDb} from "../google/myFb/myFbRTDb";


export const jointWs = async (ws: ws, req: Request, res: Response) => {
    const response = await decodeIDToken(req);
    const id = req.params.id;
    if (response) {
        ws.on('message', async function(msg: string) {
            try {
                const json = JSON.parse(msg);
                await MyFbRTDb.default.writeJoints(id, json);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    else {
        ws.close();
        res.sendStatus(400);
    }
}