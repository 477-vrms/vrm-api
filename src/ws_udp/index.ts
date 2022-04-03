import dgram from 'dgram';
import {ZmqHandler} from "../zmq";

export class WsUdp {

    private rinfoUnity: any = undefined;
    private rinfoPi: any = undefined;
    private server: dgram.Socket;
    private count: number;
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
        this.count = 0;
    }

    public static get udp(): WsUdp {
        if (!WsUdp.default) {
            WsUdp.default = new WsUdp();
        }
        return WsUdp.default;
    }

    async updateUnity(message: any, rinfo: any) {
        try {
            const obj = JSON.parse(message);
            if (obj.id === "vrms_unity") {
                this.rinfoPi = undefined;
                await ZmqHandler.zmq.send("vrms_pi", {action: "video_ready"});
                this.rinfoUnity = rinfo;
            }
        }
        catch (e) {
            return;
        }
    }

    async updatePi(message: any, rinfo: any) {
        if (this.rinfoUnity === undefined) {
            return;
        }
        try {
            const obj = JSON.parse(message);
            if (obj.id === "vrms-pi") {
                this.rinfoPi = rinfo;
            }
            await ZmqHandler.zmq.send("vrms_pi", {action: "video_start"})
        }
        catch (e) {
            return;
        }

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
        if (this.rinfoUnity === undefined) {
            await this.updateUnity(message, rinfo);
        }
        else if (this.rinfoPi === undefined) {
            await this.updatePi(message, rinfo);
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
