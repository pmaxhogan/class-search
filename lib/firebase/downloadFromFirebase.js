import {storage} from "./initFirebase.js";
import {mkdir} from "fs/promises";

const bucket = storage.bucket("study-room-me.appspot.com");
const file = bucket.file("allSections.json");
await mkdir("export", {recursive: true});
await file.download({destination: "export/allSections.json"});
