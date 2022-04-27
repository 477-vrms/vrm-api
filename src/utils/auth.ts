import {Request} from "express";
import {DecodedIdToken, getAuth, UserRecord} from "firebase-admin/auth";

export async function decodeIDToken(req: Request): Promise<(boolean)> {
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

export async function decodeFbToken(req: Request): Promise<(UserRecord | undefined)> {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(idToken);
            return await getAuth().getUser(decodedToken.uid);
        } catch (err) {
            console.log(err);
        }
    }
    return undefined;
}