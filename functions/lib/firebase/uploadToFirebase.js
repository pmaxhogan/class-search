import * as dotenv from "dotenv";
import {getSectionsFromDisk, writeSections} from "../coursebook/getSections.js";
import {db, storage} from "./initFirebase.js";

dotenv.config();

await writeSections(process.env.COURSE_TERM);


const locationsEqual = (a, b) => a.room === b.room && a.building === b.building && a.floor === b.floor;

const courseSections = await getSectionsFromDisk();
const locations = [];
for (const courseSection of courseSections) {
    if (!locations.some(location => locationsEqual(location, courseSection.section.location))) {
        locations.push(courseSection.section.location);
    }
}


const dbLocations = [];
(await db.collection("locations").get()).forEach(doc => {
    dbLocations.push({id: doc.id, ...doc.data()});
});


for (const location of locations) {
    if (location.building === "JSOM" && location.floor === "1") {
        console.log(location);
    }
    const dbLocation = dbLocations.find(dbLocation => locationsEqual(dbLocation, location));
    if (!dbLocation) {
        console.log("adding location " + JSON.stringify(location));
        await db.collection("locations").add(location);
    }
}

for (const dbLocation of dbLocations) {
    const location = locations.find(location => locationsEqual(location, dbLocation));
    if (!location) {
        console.log("removing location " + dbLocation.id + " " + JSON.stringify(dbLocation));
        await db.collection("locations").doc(dbLocation.id).delete();
    }
}


// upload something.json
const bucket = storage.bucket("study-room-me.appspot.com");
const file = bucket.file("allSections.json");
await file.save(JSON.stringify(courseSections), {
    contentType: "application/json"
});
