import {DateTime} from "luxon";

const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const isoToDurationUntilString = (iso, referenceDateIso: string) => {
    if(!referenceDateIso) referenceDateIso = new Date().toISOString();

    const dateTimeObj = DateTime.fromISO(iso, {zone: "local"});
    const durationUntil = dateTimeObj.diff(DateTime.fromJSDate(new Date(referenceDateIso))).shiftTo("days", "hours", "minutes").toObject();

    if (durationUntil.days > 0) {
        return `${durationUntil.days}d ${durationUntil.hours}h ${Math.floor(durationUntil.minutes)}m`;
    } else if (durationUntil.hours > 0) {
        return `${durationUntil.hours}h ${Math.floor(durationUntil.minutes)}m`;
    } else {
        return `${Math.floor(durationUntil.minutes)}m`;
    }
};

export const getStatusText = result => "Status: " + (result.courseSection.section.isStopped ? "Stopped" : (result.courseSection.section.isCancelled ? "Cancelled" : (result.courseSection.section.isOpen ? "Open" : "Closed")));

export const getWhenItOccurs = result => {
    const days = result.courseSection.section.days;
    return days.type === "once" ? days.when : (days.type === "recurring" ? days.when.join(", ") : "Unknown");
};

export const timeAllowance = 1000 * 60 * 15;
export const endingTimeOfSection = rowResult => {
    const previousDate = rowResult.nextMeeting;
    let previousEnd = rowResult.courseSection.section.time.end;
    const isPm = previousEnd.includes("pm");
    previousEnd = previousEnd.replace("pm", "").replace("am", "").trim();
    const previousEndDateTime = new Date(previousDate);

    const hours = previousEnd.split(":")[0];
    if (hours === "12") {
        previousEndDateTime.setHours(isPm ? 12 : 0);
    }else {
        previousEndDateTime.setHours(parseInt(hours) + (isPm ? 12 : 0));
    }
    previousEndDateTime.setMinutes(parseInt(previousEnd.split(":")[1]));
    return previousEndDateTime;
};