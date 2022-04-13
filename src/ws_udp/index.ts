import dgram from 'dgram';
import {ZmqHandler} from "../zmq";


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
        this.rinfoPi = undefined;
        this.rinfoUnity = rinfo;
        await ZmqHandler.zmq.send("vrms_pi", {action: "video_ready"});
    }

    async updatePi(message: any, rinfo: any) {
        if (this.rinfoUnity === undefined) {
            return;
        }
        this.rinfoPi = rinfo;
        await ZmqHandler.zmq.send("vrms_pi", {action: "video_start"})
    }

    async sendVideo(message: any, rinfo: any) {
        if (this.rinfoPi === undefined || this.rinfoUnity === undefined) {
            return
        }
        if (
            this.rinfoPi.port !== rinfo.port ||
            this.rinfoPi.address !== rinfo.address
        ) {
            return
        }
        if (this.rinfoUnity) {
            await this.server.send(message, this.rinfoUnity.port, this.rinfoUnity.address);
        }
        else {
            this.rinfoPi = undefined;
        }
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
