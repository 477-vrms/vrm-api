import {Publisher, Subscriber} from "zeromq";

export class ZmqHandler {

    static default: ZmqHandler | undefined = undefined;

    sender: Publisher = new Publisher();
    receiver: Subscriber = new Subscriber();
    handler: Function = (json: object) => {console.log(json)}

    private constructor() {}

    public async send(topic: string, obj: Object) {
        await this.sender.send([topic, JSON.stringify(obj)]);
    }

    public static get zmq(): ZmqHandler {
        if (!ZmqHandler.default) {
            ZmqHandler.default = new ZmqHandler();
        }
        return ZmqHandler.default;
    }

    setSender(port: number | string, callback?: () => void) {
        const func = async () => {
            await this.sender.bind(`tcp://127.0.0.1:${port}`);
        }
        func().then(callback);
    }

    listen(port: number | string, callback?: () => void) {
        const func = async () => {
            await this.receiver.connect(`tcp://127.0.0.1:${port}`);
            this.receiver.subscribe("vrms_server");
            for await (const [_, msg] of this.receiver) {
                this.handler(JSON.parse(msg.toString()));
            }
        }
        func().then(callback);
    }

}