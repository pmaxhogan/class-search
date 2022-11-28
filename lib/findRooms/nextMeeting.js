import {DAYS_TYPES, daysOfWeek} from "../consts.js";
import {readFile} from "fs/promises";

export const cloneDate = date => new Date(date.getTime());

export const timeToComponents = time => {
    let [hours, minutes] = time.slice(0, -2).split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    const isPm = time.slice(-2) === "pm";
    if(isPm && hours !== 12) {
        hours += 12;
    }
    if(!isPm && hours === 12) {
        hours = 0;
    }
    return [hours, minutes];
};

export const absoluteDayTimeToDate = (day, time) => {
    const daySplit = day.split("-");
    const [hours, minutes] = timeToComponents(time);
    return new Date(parseInt(daySplit[0]), parseInt(daySplit[1]) - 1, parseInt(daySplit[2]), hours, minutes);
};

export const nextMeetingOfOccurrence = (start, end, referenceDateTime, endToleranceMs) => {
    if(!endToleranceMs) endToleranceMs = 0;

    const comparisonTime = cloneDate(referenceDateTime);
    comparisonTime.setMilliseconds(comparisonTime.getMilliseconds() - endToleranceMs);

    if (start > referenceDateTime) return start;
    if (end < comparisonTime) return null;

    // in progress
    return start;
};

export const nextDay = (weekDay, referenceDateTime) => {
    referenceDateTime = cloneDate(referenceDateTime);
    const dayIndex = daysOfWeek.indexOf(weekDay);
    referenceDateTime.setDate(referenceDateTime.getDate() + ((7 - referenceDateTime.getDay()) % 7 + dayIndex) % 7);
    return referenceDateTime;
};

export const relativeDayTimeToDate = (weekDay, time, referenceDateTime) => {
    referenceDateTime = cloneDate(referenceDateTime);
    const date = nextDay(weekDay, referenceDateTime);
    const [hour, minutes] = timeToComponents(time);
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

export const sortDatePairs = datePairs => datePairs.sort((a, b) => a.start - b.start);

export const getOccurrences = (section, referenceDateTime) => {
    referenceDateTime = cloneDate(referenceDateTime);
    const {days, time} = section;
    const {start, end} = time;

    const occurrences = [];
    for (const day of days.when) {
        const occurrence = {
            start: relativeDayTimeToDate(day, start, referenceDateTime),
            end: relativeDayTimeToDate(day, end, referenceDateTime)
        };
        occurrences.push(occurrence);
        const nextWeek = cloneDate(referenceDateTime);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextOccurrence = {
            start: relativeDayTimeToDate(day, start, nextWeek),
            end: relativeDayTimeToDate(day, end, nextWeek)
        };
        occurrences.push(nextOccurrence);
    }

    return sortDatePairs(occurrences);
};

export const nextMeeting = (row, referenceDateTime, endToleranceMs) => {
    if (!referenceDateTime) referenceDateTime = new Date();
    else referenceDateTime = cloneDate(referenceDateTime);
    const {section} = row;

    switch (section.days.type) {
        case DAYS_TYPES.NONE:
            return null;
        case DAYS_TYPES.ONCE:
            const nextOnce = nextMeetingOfOccurrence(absoluteDayTimeToDate(section.days.when, section.time.start), absoluteDayTimeToDate(section.days.when, section.time.end), referenceDateTime, endToleranceMs);
            return nextOnce;
        case DAYS_TYPES.RECURRING:
            const occurrences = getOccurrences(section, referenceDateTime);
            const nextMeetingsFromOccurences = occurrences.map(occurrence => nextMeetingOfOccurrence(occurrence.start, occurrence.end, referenceDateTime, endToleranceMs));
            return sortDatePairs(nextMeetingsFromOccurences.filter(Boolean))[0];
        default:
            throw new Error("Invalid days type " + section.days.type);
    }
};

// JSON.parse((await readFile("export/allSections.json")).toString()).map(nextMeeting);
