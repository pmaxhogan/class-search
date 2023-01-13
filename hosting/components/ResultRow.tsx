import React from "react";
import { DateTime } from "luxon";

const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export default function ResultRow({result}) {
    const dateTimeObj = DateTime.fromISO(result.nextMeeting, {zone: "local"});
    // noinspection TypeScriptValidateJSTypes
    const str = dateTimeObj.toRelativeCalendar() + " at " + dateTimeObj.toLocaleString({hour: "2-digit", minute: "2-digit"});
    const durationUntil = dateTimeObj.diffNow().shiftTo("hours", "minutes").toObject();
    const durationUntilStr = `${pluralize(durationUntil.hours, "hour")} and ${pluralize(Math.floor(durationUntil.minutes), "minute")}`;


    const {section, course} = result.courseSection;
    return ( <li>Next class: {str} ({durationUntilStr} from now), {section.time.start} - {section.time.end}</li> );
}
