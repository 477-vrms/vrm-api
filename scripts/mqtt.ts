import {ZmqHandler} from "../src/zmq";

async function main() {
    const zmq = ZmqHandler.zmq;
    zmq.setSender(8001);
    setInterval(async () => {
        console.log("Sending Data");
        await zmq.send("vrms_server", {test: "hi"});
    }, 900);
}


main().catch(err => {
    console.error(err)
})
