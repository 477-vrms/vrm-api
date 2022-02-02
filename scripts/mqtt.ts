import {Publisher} from "zeromq";

async function main() {
    const sender: Publisher = new Publisher();
    await sender.connect("tcp://0.0.0.0:8001")
    setInterval(async () => {
        console.log("start connection")
        await sender.send(["vrms_server", "start"])
    }, 900);
}


main().catch(err => {
    console.error(err)
})
