import {Request, Response} from "express";
import {decodeIDToken} from "../utils/auth";
import * as ws from 'ws';
import {MyFbRTDb} from "../google/myFb/myFbRTDb";


export const jointsWs = async (ws: ws, req: Request, res: Response) => {
    const id = req.params.id;
    if (await decodeIDToken(req)) {
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
    }
}