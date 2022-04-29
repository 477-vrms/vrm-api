import {Request, Response} from "express";
import * as ws from 'ws';
import {decodeFbToken} from "../utils/auth";
import {MyFbRTDb} from "../google/myFb/myFbRTDb";
import {ZmqHandler} from "../zmq";

interface DebugConfigAll {
    vrZeroMqConnected: boolean;
    vrUdpConnected: boolean;
    piUdpConnected: boolean;
    isStreaming: boolean;
}

interface DebugConfig {
    vrZeroMqConnected?: boolean;
    vrUdpConnected?: boolean;
    piUdpConnected?: boolean;
    isStreaming?: boolean;
}

export class Debug {

    static default: Debug = new Debug()

    mapWs: Map<string, ws> = new Map<string, ws>();

    private config: DebugConfigAll = {
        vrZeroMqConnected: false,
        vrUdpConnected: false,
        piUdpConnected: false,
        isStreaming: false,
    }

    private constructor() {}

    public async addWs(id: string, ws: ws) {
        this.remove(id);
        this.mapWs.set(id, ws);
        await ws.send(JSON.stringify(this.config));
    }

    public async send(message: DebugConfig) {
        const newConfig = {...this.config, ...message};
        if (newConfig !== this.config) {
            this.config = newConfig;
            for (const [key, value] of Object.entries(this.mapWs)) {
                await value.send(JSON.stringify(this.config));
            }
        }
    }

    public remove(id: string) {
        const removed = this.mapWs.get(id);
        this.mapWs.delete(id);
        if (removed) {
            removed.send(JSON.stringify({...this.config, removed: true}));
            removed.close();
        }
    }
}

export const debugWs = async (ws: ws, req: Request, res: Response) => {
    const user = await decodeFbToken(req);
    if (user) {
        const wsId = user.uid;
        await Debug.default.addWs(wsId, ws);

        ws.on('message', async (message: string) => {
            try {
                const json = JSON.parse(message);
                if (json.action === "joints") {
                    await Promise.all([MyFbRTDb.default.writeJoints("person", json.data), ZmqHandler.zmq.send("vrms_pi", json)])
                }
            }
            catch (e) {
                console.log({e})
            }
        })

        ws.on('close', async () => {
            Debug.default.remove(wsId);
        });
    }
    else {
        ws.close();
    }

};
