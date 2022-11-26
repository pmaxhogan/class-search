import {load} from "cheerio";

import {courseLocationHeaders, DAYS_TYPES, LOCATION_TYPES, noLocationHeaders, specialLocations} from "../consts.js";

const dedupe = arr => [...new Set(arr)];

export function tdsToSectionObjects(tds) {
    const termAndStatus = load(tds[0]).text().trim();
    const coursePrefixCodeAndSection = load(tds[1]).text().trim().split(" ");
    const courseTitle = load(tds[3]).text().trim().replace(/ \([0-9-]+ (Semester Credit Hours|Credits)\)/, "");
    const courseInstructor = load(tds[4]).text().trim().replaceAll(",\n", ",").replaceAll("\n", "");
    const scheduleAndLocationParts = tds[5].children.map(x => load(x).text().trim()).join("\n")
        .split("\n").filter(Boolean).map(x => x.trim());

    const isOpen = termAndStatus.endsWith("Open");
    const isStopped = termAndStatus.endsWith("Stopped");
    if (!isOpen && !isStopped && !termAndStatus.endsWith("Full")) {
        console.log(courseTitle, courseInstructor, coursePrefixCodeAndSection, scheduleAndLocationParts);
        throw new Error("Unexpected termAndStatus " + termAndStatus);
    }
    const term = termAndStatus.slice(0, 3);


    const coursePrefix = coursePrefixCodeAndSection[0];
    const courseCode = coursePrefixCodeAndSection[1].split(".")[0];
    const courseSection = coursePrefixCodeAndSection[1].split(".")[1];

    let daysList, times, locations;

    if (courseLocationHeaders.includes(scheduleAndLocationParts[0])) {
        scheduleAndLocationParts.shift();
    }
    if (noLocationHeaders.includes(scheduleAndLocationParts[0]) || !scheduleAndLocationParts.length) {
        daysList = times = locations = [null];
    } else if (scheduleAndLocationParts.length % 3 === 0 || scheduleAndLocationParts.length === 2) {
        const foundDays = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 0));
        const foundTimes = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 1));
        const foundLocations = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 2)).map(location => location === "No Meeting Room" ? null : location);
        daysList = foundDays;
        times = foundTimes;
        locations = foundLocations;
    } else if(scheduleAndLocationParts.every(location => specialLocations.includes(location))){
        daysList = times = [null];
        locations = scheduleAndLocationParts;
    } else {
        console.log(courseTitle, scheduleAndLocationParts);
        throw new Error("unexpected schedule and locations parts");
    }

    let results = [];
    for (const location of locations) {
        for (const days of daysList) {
            for (const time of times) {
                let locationObject;
                if (location === null) {
                    locationObject = {type: LOCATION_TYPES.NONE};
                } else if (location === "See instructor for room assignment") {
                    locationObject = {type: LOCATION_TYPES.SPECIAL, room: location};
                } else {
                    const split = location.split(" ");
                    if (split.length !== 2) {
                        throw new Error("Unknown location " + location);
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
                } else if (/^\d{4}-\d{2}-\d{2} [A-Z][a-z]+$/.test(days)) {// 2023-05-03 Wednesday
                    daysObject = {type: DAYS_TYPES.ONCE, when: days.split(" ")[0]};
                } else {// Monday & Friday
                    daysObject = {type: DAYS_TYPES.RECURRING, when: days.split(/\W/).filter(Boolean)};
                }

                let start, end;
                if (time) {
                    const timeSplit = time.split(" - ");
                    if (timeSplit.length !== 2) throw new Error("Unknown time " + timeSplit);
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
                        time: time ? {start, end} : null,
                        location: locationObject,
                        term,
                        isOpen,
                        isStopped
                    }
                };

                results.push(resultObj);
            }
        }
    }

    return results;
}
