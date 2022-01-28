import {Dish, Radio} from "zeromq/draft";

export class ZmqUdpHandler {

    private static default: ZmqUdpHandler | undefined;
    handler: Function = (json: object) => {console.log(json)}
    private dish: Dish = new Dish();
    private radio: Radio = new Radio();

    private constructor() {}

    public async send(topic: string, obj: Object) {
        this.dish.connect("udp://*:8000")
    }

    public static get zmq(): ZmqUdpHandler {
        if (!ZmqUdpHandler.default) {
            ZmqUdpHandler.default = new ZmqUdpHandler();
        }
        return ZmqUdpHandler.default;
    }

    setSender(port: number | string, callback?: () => void) {
        const func = async () => {
        }
        func().then(callback);
    }

    listen(port: number | string, callback?: () => void) {
        const func = async () => {
        }
        func().then(callback);
    }

}
