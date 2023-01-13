import {load} from "cheerio";

import {DAYS_TYPES, LOCATION_TYPES, specialLocations} from "../../consts.js";
import {isSpecialDays, splitIntoDays} from "./daysTimesParse.js";
import getDaysTimesLocations from "./getDaysTimesLocations.js";

const defaultTermAndStatus = process.env.COURSE_TERM.split("_")[1] + "Full";

export function tdsToSectionObjects(tds, prefix) {
    const termAndStatus = load(tds[0]).text().trim() || defaultTermAndStatus;
    const coursePrefixCodeAndSection = load(tds[1]).text().trim().split(" ");
    const courseTitle = load(tds[3]).text().trim().replace(/ \([0-9-]+ (Semester Credit Hours|Credits)\)/, "").replaceAll("  ", " ");
    const courseInstructor = load(tds[4]).text().trim().replaceAll(",\n", ",").replaceAll("\n", "");
    const scheduleAndLocationParts = load(tds[5])("td").find(".clstbl__resultrow__day,.clstbl__resultrow__time,.clstbl__resultrow__location").toArray().map(x => load(x).text().trim()).filter(Boolean);

    const isOpen = termAndStatus.endsWith("Open");
    const isStopped = termAndStatus.endsWith("Stopped");
    const isCancelled = termAndStatus.endsWith("Cancelled");
    if (!isOpen && !isStopped && !isCancelled && !termAndStatus.endsWith("Full")) {
        console.log(courseTitle, courseInstructor, coursePrefixCodeAndSection);
        throw new Error("Unexpected termAndStatus " + termAndStatus);
    }
    const term = termAndStatus.slice(0, 3);

    let coursePrefix, courseCode, courseSection;
    if (coursePrefixCodeAndSection.length === 1 && coursePrefixCodeAndSection[0] === ".001") {
        coursePrefix = prefix;
        courseCode = null;
        courseSection = "001";
    } else {
        coursePrefix = coursePrefixCodeAndSection[0];
        courseCode = coursePrefixCodeAndSection[1].split(".")[0];
        courseSection = coursePrefixCodeAndSection[1].split(".")[1];
    }

    const daysTimesLocationList = getDaysTimesLocations(scheduleAndLocationParts);

    let results = [];
    for (const daysTimesLocation of daysTimesLocationList) {
        let {days, times, location} = daysTimesLocation;

        if (location && location.startsWith("SOM")) location = "J" + location;

        let locationObject;
        if (location === null) {
            locationObject = {type: LOCATION_TYPES.NONE};
        } else if (specialLocations.includes(location)) {
            locationObject = {type: LOCATION_TYPES.SPECIAL, room: location};
        } else {
            const split = location.split(" ");
            if (split.length !== 2) {
                throw new Error("Unknown location " + location + " for " + scheduleAndLocationParts);
            }
            const building = split[0];
            const split2 = split[1].split(".");
            if (split.length !== 2) {
                throw new Error("Unknown location " + location);
            }
            const floor = parseInt(split2[0]);
            if (isNaN(floor)) {
                throw new Error("Unknown floor " + floor + " on location " + location);
            }
            const room = split2[1];
            locationObject = {type: LOCATION_TYPES.ROOM, building, room, floor};
        }

        let daysObject;
        if (days === null) {
            daysObject = {type: DAYS_TYPES.NONE};
        } else if (isSpecialDays(days)) {// 2023-05-03 Wednesday
            daysObject = {type: DAYS_TYPES.ONCE, when: days.split(" ")[0]};
        } else {// Monday & Friday
            daysObject = {type: DAYS_TYPES.RECURRING, when: splitIntoDays(days)};
        }

        let start, end;
        if (times) {
            const timeSplit = times.split(" - ");
            if (timeSplit.length !== 2) {
                console.log(scheduleAndLocationParts, daysList, times, locations);
                throw new Error("Unknown time " + timeSplit);
            }
            [start, end] = timeSplit;
        }

        const resultObj = {
            course: {
                prefix: coursePrefix,
                code: courseCode,
                title: courseTitle
            },
            section: {
                number: courseSection,
                instructor: courseInstructor,
                days: daysObject,
                time: times ? {start, end} : null,
                location: locationObject,
                term,
                isOpen,
                isStopped,
                isCancelled
            }
        };

        results.push(resultObj);
    }

    return results;
}
