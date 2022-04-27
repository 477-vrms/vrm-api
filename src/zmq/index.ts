import {Publisher, Subscriber} from "zeromq";

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}
export class ZmqHandler {

    static default: ZmqHandler | undefined = undefined;

    sender: Publisher = new Publisher();
    receiver: Subscriber = new Subscriber();

    private constructor() {}

    public async send(topic: string, obj: Object) {
        try {
            await this.sender.send([topic, JSON.stringify(obj)]);
        }
        catch (e) {
            console.log("error sending:", e);
        }
    }

    handler: Function = async (json: object) => {
        await this.send("vrms_pi", json)
    }

    public static get zmq(): ZmqHandler {
        if (!ZmqHandler.default) {
            ZmqHandler.default = new ZmqHandler();
        }
        return ZmqHandler.default;
    }

    listen(port: number | string, callback?: () => void) {
        const func = async () => {
            await this.sender.bind(`tcp://0.0.0.0:${port}`);
            await delay(1000);
            await this.receiver.connect(`tcp://0.0.0.0:${port}`);
            this.receiver.subscribe("vrms_server");
            for await (const [_, msg] of this.receiver) {
                await this.handler(JSON.parse(msg.toString()));
            }
        }
        func().then(callback);
    }

}