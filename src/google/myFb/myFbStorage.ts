/*
Image Resizer: https://fireship.io/lessons/image-thumbnail-resizer-cloud-function/
 */
import { getStorage, Storage } from "firebase-admin/storage";
import {Bucket} from '@google-cloud/storage';
import {MyFirebase} from "./myFb";

export class MyFbStorage extends MyFirebase {

    private readonly storage: Storage;
    private readonly bucket: Bucket;

    private static default: MyFbStorage | undefined;


    private constructor() {
        super();
        this.storage = getStorage(MyFirebase.app);
        this.bucket = this.storage.bucket("gs://mwenclubhouse.appspot.com");
    }

}