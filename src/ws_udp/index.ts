import dgram from 'dgram';

export class WsUdp {

    private static WsMap: Map<string, WsUdp> = new Map<string, WsUdp>();
    private server: dgram.Socket;
    private readonly id: string;
    private readonly port: number;
    private count: number;

    private constructor(id: string, port: number) {
        this.server = dgram.createSocket('udp4');
        this.id = id;
        this.port = port;
        WsUdp.WsMap.set(id, this);
        this.server.on('close', this.close);
        this.count = 0;
        this.server.on('message', async (message, rinfo) => {
            console.log({message: message.toString(), rinfo})
            this.count += 1;
            const newMessage = `Hi Back Matthew Wen ${this.count}`
            await this.server.send(newMessage, 0, newMessage.length, rinfo.port, rinfo.address);
        })
    }


    public static wsCreateById(id: string, port: number): WsUdp {
        return this.WsMap.get(id) || new WsUdp(id, port);
    }

    public static wsKillById(id: string) {
        const ws: WsUdp | undefined = this.WsMap.get(id);
        if (ws) {
            ws.close();
        }
    }

    listen() {
        const f = async () => {
            this.server.bind(this.port);
        }
        f().catch(e => console.log(e));
    }

    close() {
        WsUdp.WsMap.delete(this.id);
        this.server.close();
    }

}
