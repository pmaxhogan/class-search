import {DAYS_TYPES, daysOfWeek} from "../consts.js";
import {readFile} from "fs/promises";

const timeToComponents = time => {
    const [hours, minutes] = time.slice(0, -2).split(":");
    return [time.slice(-2) === "pm" ? parseInt(hours) + 12 : parseInt(hours), parseInt(minutes)];
};

const absoluteDayTimeToDate = (day, time) => {
    const daySplit = day.split("-");
    const [hours, minutes] = timeToComponents(time);
    return new Date(parseInt(daySplit[0]), parseInt(daySplit[1]) - 1, parseInt(daySplit[2]), hours, minutes);
};

const nextMeetingOfOccurrence = (start, end, referenceDateTime) => {
    if (start > referenceDateTime) return start;
    if (end < referenceDateTime) return null;

    return referenceDateTime;
};


const getOccurrences = (section, referenceDateTime) => {
    const {days, time} = section;
    const {start, end} = time;

    const occurrences = [];
    for (const day of days.when) {
        const occurrence = {
            start: relativeDayTimeToDate(day, start, referenceDateTime),
            end: relativeDayTimeToDate(day, end, referenceDateTime)
        };
        occurrences.push(occurrence);
        const nextWeek = referenceDateTime;
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextOccurrence = {
            start: relativeDayTimeToDate(day, start, nextWeek),
            end: relativeDayTimeToDate(day, end, nextWeek)
        };
        occurrences.push(nextOccurrence);
    }

    return occurrences;
};

const nextDay = (weekDay, referenceDateTime) => {
    const dayIndex = daysOfWeek.indexOf(weekDay);
    referenceDateTime.setDate(referenceDateTime.getDate() + ((7 - referenceDateTime.getDay()) % 7 + dayIndex) % 7);
    return referenceDateTime;
};

const relativeDayTimeToDate = (weekDay, time, referenceDateTime) => {
    const date = nextDay(weekDay, referenceDateTime);
    const [hour, minutes] = timeToComponents(time);
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

const nextMeeting = (row, referenceDateTime) => {
    if (!referenceDateTime) referenceDateTime = new Date();
    const {section} = row;

    console.log(section);
    switch (section.days.type) {
        case DAYS_TYPES.NONE:
            return null;
        case DAYS_TYPES.ONCE:
            const nextOnce = nextMeetingOfOccurrence(absoluteDayTimeToDate(section.days.when, section.time.start), absoluteDayTimeToDate(section.days.when, section.time.end), referenceDateTime);
            return nextOnce;
        case DAYS_TYPES.RECURRING:
            const occurrences = getOccurrences(section, referenceDateTime);
            const next = occurrences.find(occurrence => nextMeetingOfOccurrence(occurrence.start, occurrence.end, referenceDateTime));
            debugger;
            return next;
    }
};

JSON.parse((await readFile("export/allSections.json")).toString()).map(nextMeeting);
