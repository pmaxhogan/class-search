import React from "react";
import { DateTime } from "luxon";

export default function ResultRow({result}) {
    const dateTimeObj = DateTime.fromISO(result.nextMeeting, {zone: "local"});
    // noinspection TypeScriptValidateJSTypes
    const str = dateTimeObj.toRelativeCalendar() + " at " + dateTimeObj.toLocaleString({hour: "2-digit", minute: "2-digit"});
    console.log(result.courseSection, str);
    const durationUntil = dateTimeObj.diffNow().shiftTo("hours", "minutes").toObject();
    const durationUntilStr = `${durationUntil.hours} hours and ${Math.floor(durationUntil.minutes)} minutes`;


    const {section, course} = result.courseSection;
    return ( <li>Next class: {str} ({durationUntilStr} from now), {section.time.start} - {section.time.end}</li> );
}
