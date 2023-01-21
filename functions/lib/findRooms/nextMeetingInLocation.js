import {nextMeetings} from "./nextMeetings.js";
import {getRoomsInBuilding} from "./getRooms.js";
import {getSectionsFromDisk} from "../coursebook/getSections.js";

export async function findSectionsInLocation({building, room, floor}) {
    return (await getSectionsFromDisk()).filter(courseSection => courseSection.section.location.room === room && courseSection.section.location.floor === floor && courseSection.section.location.building === building);
}

export async function nextMeetingsInLocation({building, room, floor}, referenceDateTime = null, endToleranceMs = 0) {
    if (!referenceDateTime) referenceDateTime = new Date();

    const sections = await findSectionsInLocation({building, room, floor});
    const courseSectionsHere = sections.map(courseSection => {
        const next = nextMeetings(courseSection, referenceDateTime, endToleranceMs);

        const results = [];
        for(const meeting of next) {
            results.push({
                nextMeeting: meeting,
                courseSection
            });
        }
        return results;
    }).flat().filter(meeting => meeting.nextMeeting);
    return sortNextMeetings(courseSectionsHere);
}

export async function nextMeetingInLocation({building, room, floor}, referenceDateTime = null) {
    const nextMeetings = await nextMeetingsInLocation({building, room, floor}, referenceDateTime);
    return nextMeetings[0];
}

export function sortNextMeetings(roomsAndMeetings) {
    return roomsAndMeetings.sort((a, b) => (a.nextMeeting || Number.MAX_SAFE_INTEGER) - (b.nextMeeting || Number.MAX_SAFE_INTEGER));
}

export function sortNextMeetingsDeepReversed(roomsAndMeetings) {
    return roomsAndMeetings.sort((a, b) => (b.nextMeeting.nextMeeting || Number.MAX_SAFE_INTEGER) - (a.nextMeeting.nextMeeting || Number.MAX_SAFE_INTEGER));
}

export async function roomInBuildingsByNextMeeting(building, refrenceDateTime = null) {
    if (!refrenceDateTime) refrenceDateTime = new Date();

    const rooms = await getRoomsInBuilding(building);

    const roomsAndMeetingsProms = [];
    for (const room of rooms) {
        const nextMeeting = await nextMeetingInLocation(room, refrenceDateTime);
        roomsAndMeetingsProms.push({room, nextMeeting});
    }

    const roomsAndMeetings = await Promise.all(roomsAndMeetingsProms);
    return sortNextMeetingsDeepReversed(roomsAndMeetings);
}

// console.log((await findSectionsInLocation({building: "JSOM", room: "212", floor: 1})).map(x=>[x.section.days.when, x.section.time]));
// console.log(await nextMeetingInLocation({building: "JSOM", room: "212", floor: 1}, new Date("2022-11-29T12:00:00")));
