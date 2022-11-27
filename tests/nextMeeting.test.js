import {describe, expect, test} from "@jest/globals";
import {nextMeetingOfOccurrence, timeToComponents} from "../lib/findRooms/nextMeeting.js";

describe("nextMeeting", () => {
    test("timeToComponents", () => {
        expect(timeToComponents("1:00pm")).toEqual([13, 0]);
        expect(timeToComponents("1:00am")).toEqual([1, 0]);
        expect(timeToComponents("2:23pm")).toEqual([14, 23]);
        expect(timeToComponents("2:23am")).toEqual([2, 23]);
        expect(timeToComponents("12:00pm")).toEqual([12, 0]);
        expect(timeToComponents("12:00am")).toEqual([0, 0]);
        expect(timeToComponents("12:23pm")).toEqual([12, 23]);
        expect(timeToComponents("12:23am")).toEqual([0, 23]);
    });

    test("nextMeetingOfOccurrence", () => {
        // in the future
        expect(nextMeetingOfOccurrence(new Date("2021-01-01T00:00:00"), new Date("2021-01-01T01:15:00"), new Date("2020-12-31T23:59:59"))).toEqual(new Date("2021-01-01T00:00:00"));
        // in the past
        expect(nextMeetingOfOccurrence(new Date("2021-01-01T00:00:00"), new Date("2021-01-01T01:15:00"), new Date("2021-01-01T01:15:01"))).toEqual(null);
        // ongoing
        expect(nextMeetingOfOccurrence(new Date("2021-01-01T00:00:00"), new Date("2021-01-01T01:15:00"), new Date("2021-01-01T00:30:00"))).toEqual(new Date("2021-01-01T00:30:00"));
    });
});
