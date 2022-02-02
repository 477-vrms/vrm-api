import amqp, {Channel, Connection, Message} from "amqplib/callback_api";

export class Mq {

    private static default: Mq = new Mq();
    private readonly onMsg: (msg: Message | null) => void;

    private constructor(onMsg: ((msg: Message | null) => void) | undefined = undefined) {
        this.onMsg = onMsg || ((msg: Message | null) => console.log(msg));
    }

    private connect(error: any, connection: Connection) {
        if (error) {
            console.log("Connection Error");
            throw error;
        }
        connection.createChannel(this.channel);
    }

    private channel(error: any, channel: Channel) {
        if (error) {
            throw error;
        }
        channel.assertQueue('hello', {
            durable: false
        });
        channel.consume('hello', this.onMsg);
    }

    static get mq() : Mq {
        return this.default;
    }

    listen(port: number | string) {
        const f = async () => {
            amqp.connect(`amqp://localhost:${port}`, this.connect);
        }
        f().catch(e => console.log(e));
    }

}