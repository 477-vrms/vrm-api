import dgram from 'dgram';
import {ZmqHandler} from "../zmq";
import {Debug} from "../ws/debug";


function parseMessage(message: any) {
    try {
        let obj = JSON.parse(message);
        obj['is_json'] = true;
        return obj;
    }
    catch (e) {
        return {is_json: false};
    }
}

export class WsUdp {

    private rinfoUnity: any = undefined;
    private rinfoPi: any = undefined;
    private server: dgram.Socket;
    static default: WsUdp | undefined = undefined;

    constructor() {
        this.server = dgram.createSocket('udp4');
        this.server.on('close', this.close);
        this.server.on('message', async (message: any, rinfo: any) => {
            try {
                await this.message(message, rinfo);
            }
            catch (e) {
                console.log(e);
            }
        });
    }

    public static get udp(): WsUdp {
        if (!WsUdp.default) {
            WsUdp.default = new WsUdp();
        }
        return WsUdp.default;
    }

    async updateUnity(message: any, rinfo: any) {
        await Debug.default.send({vrUdpConnected: true});
        this.rinfoPi = undefined;
        this.rinfoUnity = rinfo;
        await ZmqHandler.zmq.send("vrms_pi", {action: "video_ready"});
    }

    async updatePi(message: any, rinfo: any) {
        if (this.rinfoUnity === undefined) {
            return;
        }
        this.rinfoPi = rinfo;
        await Debug.default.send({piUdpConnected: true});
        await ZmqHandler.zmq.send("vrms_pi", {action: "video_start"})
    }

    async sendVideo(message: any, rinfo: any) {
        if (this.rinfoPi === undefined || this.rinfoUnity === undefined) {
            await Debug.default.send({
                isStreaming: false,
                vrUdpConnected: this.rinfoPi !== undefined,
                piUdpConnected: this.rinfoUnity !== undefined,
            });
            return
        }
        if (
            this.rinfoPi.port !== rinfo.port ||
            this.rinfoPi.address !== rinfo.address
        ) {
            await Debug.default.send({isStreaming: false});
            return
        }
        await Debug.default.send({isStreaming: true});
        await this.server.send(message, this.rinfoUnity.port, this.rinfoUnity.address);
    }

    async message(message: any, rinfo: any) {
        const response = parseMessage(message);
        if (response.is_json) {
            if (response.id === "vrms_unity") {
                await this.updateUnity(response, rinfo);
            }
            else if (response.id === "vrms_pi")  {
                await this.updatePi(response, rinfo);
            }
        }
        else {
            await this.sendVideo(message, rinfo);
        }
    }

    listen(port: number) {
        const f = async () => {
            this.server.bind(port);
        }
        f().catch(e => console.log(e));
    }

    close() {
        this.server.close();
    }

}
