import {
    courseLocationHeaders,
    DAYS_TYPES,
    daysOfWeek,
    LOCATION_TYPES,
    noLocationHeaders,
    specialLocations
} from "../../consts.js";
import {isDays, isNormalTimes, isNormalDays, isSpecialDays, splitIntoDays} from "./daysTimesParse.js";

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
