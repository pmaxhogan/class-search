import {cert, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";

initializeApp({
    credential: cert("./serviceAccount.json"),
    storageBucket: "study-room-me.appspot.com",
});

export const db = getFirestore();
export const storage = getStorage();
