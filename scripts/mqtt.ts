import {ZmqHandler} from "../src/zmq";

async function main() {
    const zmq = ZmqHandler.zmq;
    // await zmq.sender.connect("tcp://34.132.95.250:2001");
    zmq.setSender(8001);
    setInterval(async () => {
        console.log("Sending Data");
        await zmq.send("vrms_server", {test: "hi"});
    }, 900);
}


main().catch(err => {
    console.error(err)
})
