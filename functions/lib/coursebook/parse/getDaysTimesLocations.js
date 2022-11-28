import {newHeaders} from "../../consts.js";
import {isDays, isTimes} from "./daysTimesParse.js";

const isDayThenTimeRepeating = list => list.every((x, idx) => idx % 2 === 0 ? isDays(x) : isTimes(x));
const isDayThenTimeThenLocation = list => isDays(list[0]) && isTimes(list[1]) && !isDays(list[2]) && !isTimes(list[2]);

export default function getDaysTimesLocations(scheduleAndLocationParts) {
    const original = JSON.parse(JSON.stringify(scheduleAndLocationParts));

    // all online, lots of days and times but no location
    if (newHeaders.includes(scheduleAndLocationParts[0]) && isDayThenTimeRepeating(scheduleAndLocationParts.slice(1))) {
        return [];
    }

    while (newHeaders.includes(scheduleAndLocationParts[0])) {
        scheduleAndLocationParts.shift();
    }

    while (newHeaders.includes(scheduleAndLocationParts[scheduleAndLocationParts.length - 1])) {
        scheduleAndLocationParts.pop();
    }

    if (!scheduleAndLocationParts.length) {
        return [];
    }

    if (scheduleAndLocationParts.length === 2 && isDays(scheduleAndLocationParts[0]) && isTimes(scheduleAndLocationParts[1])) {
        return [];
    }

    if (scheduleAndLocationParts.length >= 5 && scheduleAndLocationParts.length % 2 === 1 && isDayThenTimeRepeating(scheduleAndLocationParts.slice(3)) && isDayThenTimeThenLocation(scheduleAndLocationParts)) {
        let results = [{
            days: scheduleAndLocationParts[0],
            times: scheduleAndLocationParts[1],
            location: scheduleAndLocationParts[2]
        }];
        for (let i = 3; i < scheduleAndLocationParts.length; i += 2) {
            results.push({
                days: scheduleAndLocationParts[i],
                times: scheduleAndLocationParts[i + 1],
                location: scheduleAndLocationParts[2]
            });
        }
        return results;
    }

    if (scheduleAndLocationParts.length % 3 === 0) {
        let results = [];
        for (let i = 0; i < scheduleAndLocationParts.length; i += 3) {
            if (isDayThenTimeThenLocation(scheduleAndLocationParts.slice(i))) {
                results.push({
                    days: scheduleAndLocationParts[i],
                    times: scheduleAndLocationParts[i + 1],
                    location: scheduleAndLocationParts[i + 2]
                });
            } else {
                throw new Error("Invalid scheduleAndLocationParts " + scheduleAndLocationParts);
            }
        }
        return results;
    }

    throw new Error("Invalid scheduleAndLocationParts " + scheduleAndLocationParts + " (original) " + original);
}
