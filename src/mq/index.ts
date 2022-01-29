export class Mq {

    private static default: Mq = new Mq();

    private constructor() {

    }

    static get mq() : Mq {
        return this.default;
    }

    listen(port: number | string) {
        const f = async () => {

        }
        f().catch(e => console.log(e));
    }

}