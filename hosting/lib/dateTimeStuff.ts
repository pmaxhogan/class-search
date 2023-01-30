import {DateTime} from "luxon";

const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const isoToDurationUntilString = (iso) => {
    const dateTimeObj = DateTime.fromISO(iso, {zone: "local"});
    const durationUntil = dateTimeObj.diffNow().shiftTo("days", "hours", "minutes").toObject();

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