import {
    courseLocationHeaders,
    DAYS_TYPES,
    daysOfWeek,
    LOCATION_TYPES,
    noLocationHeaders,
    specialLocations
} from "../../consts.js";

const dedupe = arr => [...new Set(arr)];

const isNormalTimes = timeString => /^[0-9]{1,2}:[0-9]{2}[ap]m - [0-9]{1,2}:[0-9]{2}[ap]m$/.test(timeString);

const splitIntoDays = days => days.split(/\W/).filter(Boolean);
const isNormalDays = daysString => splitIntoDays(daysString).every(day => daysOfWeek.includes(day));
const isSpecialDays = daysString => /^\d{4}-\d{2}-\d{2} (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/.test(daysString);
const isDays = daysString => isNormalDays(daysString) || isSpecialDays(daysString);

function exportItemToResult(item){
    console.log(item);
    if(item.course_prefix === "buan" && item.course_number === "6359") {
        debugger;
    }
    return item;
}

export function exportListToResults(exportList){
    return exportList.map(exportItemToResult);
}
