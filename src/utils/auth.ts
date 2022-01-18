import {Request} from "express";

export async function decodeIDToken(req: Request): Promise<(boolean)> {
    console.log(req.headers.authorization);
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            return idToken === process.env.API_KEY; // this is temp
        } catch (err) {
            console.log(err);
        }
    }
    return false;
}