import {getFirestore} from "firebase-admin/firestore";
import {MyFirebase} from "./myFb";

export class MyFbDb extends MyFirebase {

    static default: MyFbDb = new MyFbDb();
    private firestone: FirebaseFirestore.Firestore;

    private constructor() {
        super();
        this.firestone = getFirestore(MyFirebase.app);
    }

}