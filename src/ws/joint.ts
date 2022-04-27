import {Request, Response} from "express";
import {decodeIDToken} from "../utils/auth";
import * as ws from 'ws';
import {MyFbRTDb} from "../google/myFb/myFbRTDb";
import {ZmqHandler} from "../zmq";
import {Debug} from "./debug";


export const jointsWs = async (ws: ws, req: Request, res: Response) => {
    const id = req.params.id;
    if (await decodeIDToken(req)) {
        await Debug.default.send({vrZeroMqConnected: true});
        ws.on('message', async function(msg: string) {
            try {
                const json = JSON.parse(msg);
                await Promise.all([MyFbRTDb.default.writeJoints(id, json), ZmqHandler.zmq.send("vrms_pi", json)])
            }
            catch (e) {
                console.log(e);
            }
        });
        ws.on('close', async function() {
            await Debug.default.send({vrZeroMqConnected: false});
            await ZmqHandler.zmq.send("vrms_pi", {action: "buzzer"});
            await ZmqHandler.zmq.send("vrms_pi", {action: "video_end"})
        });
    }
    else {
        ws.close();
    }
}
