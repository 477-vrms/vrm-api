import {MyFirebase} from "./myFb";
import {database} from "firebase-admin";

export class MyFbRTDb extends MyFirebase {

    static default: MyFbRTDb = new MyFbRTDb();
    private db: database.Database;

    private constructor() {
        super();
        this.db = database();
    }

    async writeJoints(id: string, joint: Object) {
        const ref = this.db.ref("joints");
        let object: any = {};
        try {
            object = {...(await ref.get()).val()};
        }
        catch (e) {
            console.log({getting: e});
        }
        object[id] = joint
        try {
            await ref.set(object);
        }
        catch (e) {
            console.log({setting: e});
        }
    }

}