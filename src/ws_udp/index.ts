import dgram from 'dgram';

export class WsUdp {

    private static WsMap: Map<string, WsUdp> = new Map<string, WsUdp>();
    private server: dgram.Socket;
    private id: string;

    private constructor(id: string) {
        this.server = dgram.createSocket('udp6');
        this.id = id;
        WsUdp.WsMap.set(id, this);

        this.server.on('close', () => {
            WsUdp.WsMap.delete(id);
        });
    }

    public static wsById(id: string) {
        if (this.WsMap.has(id)) {
            return this.WsMap.get(id);
        }
        return new WsUdp(id);
    }

    listen(port: number) {
        const f = async () => {
            this.server.bind(port);
        }
        f().catch(e => console.log(e));
    }

}
