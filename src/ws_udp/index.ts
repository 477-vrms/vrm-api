import dgram, {Socket} from 'dgram';

export class WsUdp {

    private rinfoMap: Map<string, Object> = new Map<string, Object>();
    private server: dgram.Socket;
    private count: number;
    static default: WsUdp | undefined = undefined;

    constructor() {
        this.server = dgram.createSocket('udp4');
        this.server.on('close', this.close);
        this.server.on('message', async (message: any, rinfo: any) => {
            try {
                const obj = JSON.parse(message);
                if (obj.id !== undefined) {
                    this.rinfoMap.set(obj.id, rinfo);
                }
                await this.message(obj, rinfo);
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

    async message(message: Object, rinfo: any) {
        console.log({message: message.toString(), rinfo});
        this.count += 1;
        const newMessage = `Hi Back Matthew Wen ${this.count}`
        await this.send("vrms-pi", {count: this.count, msg: newMessage})
    }

    async send(id: string, message: Object) {
        const rinfo: any = this.rinfoMap.get(id);
        if (rinfo) {
            await this.server.send(JSON.stringify(message), rinfo.port, rinfo.address);
        }
        else {
            console.log(`rinfo with id ${id} not found`);
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
