import express from "express";
import cron from "node-cron";
import cors from "cors";
import {Api} from "./utils/api";

function checkOrigin(origin: string): boolean {
    return true;
}

Api.setUse(cors({
    origin: (origin: string | undefined, callback) => {
        console.log({origin})
        if (origin === undefined && process.env.ENV !== undefined) {
            console.log({origin});
            callback({
                name: "Origin is Undefined",
                message: "Origin Used is Not Defined",
                stack: "Origin Used is Not Defined",
            }, origin);
        }
        else if (process.env.ENV === undefined ||
            origin !== undefined && checkOrigin(origin)) {
            callback(null, origin);
        }
        else {
            callback({
                name: "Origin is Unknown",
                message: "Origin Used is Not Known",
                stack: "Origin Used is Not Known",
            }, origin);
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
Api.setUse(express.json());


Api.setGetRoute("/", (req: any, res: any) => {
    res.send({
        status: process.env.ENV || 'development',
        purpose: 'VRMS Senior Design Project',
        owner: 'mwenclubhouse'
    });
});

Api.setPostRoute("/auth", (req: any, res: any) => {
    console.log('receiving data ...');
    console.log('body is ', req.body);
    res.send(req.body);
});

Api.setWs('/camera/:id', function(ws: any, req: any, next: any) {

    let interval: NodeJS.Timer | undefined = undefined;
    let message = "sending data back";

    ws.on('open', function () {
        console.log('open connection');
    })
    ws.on('message', function(msg: string) {
        console.log(msg);
        if (msg === "stream" && interval === undefined) {
            interval = setInterval(() => {
                ws.send(message);
            }, 1000);
        }
        else if (msg === "end" && interval) {
            clearInterval(interval);
            interval = undefined;
        }
        else {
            message = msg;
        }
    });
    ws.on("close", function() {
        if (interval) {
            console.log("close interval");
            clearInterval(interval);
            interval = undefined;
        }
    });
    next();
});


if (process.env.ENV) {
    cron.schedule('0 0 */12 * * *', async function () {
        console.log("Run Every 12 Hours");
    });
}

Api.listen();
