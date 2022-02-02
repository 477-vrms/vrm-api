import {Publisher} from "zeromq";

async function main() {
    const port = 8001;
    const sender: Publisher = new Publisher();
    await sender.bind(`tcp://0.0.0.0:${port}`);
    let count = 0;
    setInterval(async () => {
        // console.log("Sending Data");
        // await sender.send(["vrms_pi", "hi there" + count]);
        count += 1;
    }, 900);
}


main().catch(err => {
    console.error(err)
})
