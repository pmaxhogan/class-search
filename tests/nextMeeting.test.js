import {describe, expect, test} from "@jest/globals";
import {
    absoluteDayTimeToDate, getOccurrences,
    nextDay, nextMeeting,
    nextMeetingOfOccurrence, relativeDayTimeToDate, sortDatePairs,
    timeToComponents
} from "../lib/findRooms/nextMeeting.js";
import {DAYS_TYPES} from "../lib/consts.js";

describe("nextMeeting", () => {
    const tolerance = 1000 * 60 * 15; // 15 minutes

    test("cloneDate", () => {
        const date = new Date();
        const clone = new Date(date);
        expect(clone).toEqual(date);
        expect(clone).not.toBe(date);

        date.setFullYear(2020);
        expect(clone).not.toEqual(date);
    });

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
        const [start, end] = [new Date("2021-01-01T00:00:00"), new Date("2021-01-01T01:15:00")];
        // in the future
        expect(nextMeetingOfOccurrence(start, end, new Date("2020-12-31T23:59:59"))).toEqual(start);
        // in the past
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T01:15:01"))).toEqual(null);
        // ongoing
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T00:30:00"))).toEqual(start);

        // in the future with tolerance
        expect(nextMeetingOfOccurrence(start, end, new Date("2020-12-31T23:59:59"), tolerance)).toEqual(start);
        // in the past with tolerance
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T01:15:01"), tolerance)).toEqual(start);
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T01:30:00"), tolerance)).toEqual(start);
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T01:30:01"), tolerance)).toEqual(null);
        // ongoing with tolerance
        expect(nextMeetingOfOccurrence(start, end, new Date("2021-01-01T00:30:00"), tolerance)).toEqual(start);
    });

    test("absoluteDayTimeToDate", () => {
        expect(absoluteDayTimeToDate("2021-01-01", "1:00pm")).toEqual(new Date("2021-01-01T13:00:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "1:00am")).toEqual(new Date("2021-01-01T01:00:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "2:23pm")).toEqual(new Date("2021-01-01T14:23:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "2:23am")).toEqual(new Date("2021-01-01T02:23:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "12:00pm")).toEqual(new Date("2021-01-01T12:00:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "12:00am")).toEqual(new Date("2021-01-01T00:00:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "12:23pm")).toEqual(new Date("2021-01-01T12:23:00"));
        expect(absoluteDayTimeToDate("2021-01-01", "12:23am")).toEqual(new Date("2021-01-01T00:23:00"));
    });

    test("nextDay", () => {
        expect(nextDay("Sunday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-03T00:00:00"));
        expect(nextDay("Monday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-04T00:00:00"));
        expect(nextDay("Tuesday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-05T00:00:00"));
        expect(nextDay("Wednesday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-06T00:00:00"));
        expect(nextDay("Thursday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-07T00:00:00"));
        expect(nextDay("Friday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T00:00:00"));
        expect(nextDay("Saturday", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-02T00:00:00"));
    });

    test("relativeDayTimeToDate", () => {
        expect(relativeDayTimeToDate("Friday", "1:00pm", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T13:00:00"));
        expect(relativeDayTimeToDate("Friday", "1:00am", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T01:00:00"));
        expect(relativeDayTimeToDate("Friday", "2:23pm", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T14:23:00"));
        expect(relativeDayTimeToDate("Friday", "2:23am", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T02:23:00"));
        expect(relativeDayTimeToDate("Friday", "11:00am", new Date("2021-01-01T13:00:00"))).toEqual(new Date("2021-01-01T11:00:00"));
    });

    test("sortDatePairs", () => {
        expect(sortDatePairs([])).toEqual([]);
        expect(sortDatePairs([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}])).toEqual([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}]);
        expect(sortDatePairs([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}, {start: new Date("2021-01-01T01:00:00"), end: new Date("2021-01-01T02:00:00")}])).toEqual([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}, {start: new Date("2021-01-01T01:00:00"), end: new Date("2021-01-01T02:00:00")}]);
    })

    test("getOccurrences", () => {
        const section = {days: {when: ["Monday", "Wednesday"]}, time: {start: "1:00pm", end: "2:15pm"}};

        // once a week, returns next Monday & the following Monday
        expect(getOccurrences({days: {when: ["Monday"]}, time: {start: "1:00pm", end: "2:15pm"}}, new Date("2021-01-01T00:00:00"))).toEqual([{start: new Date("2021-01-04T13:00:00"), end: new Date("2021-01-04T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}]);
        // monday & wednesday, returns next Monday & Wednesday & the following Monday & Wednesday
        expect(getOccurrences(section, new Date("2021-01-01T00:00:00"))).toEqual([{start: new Date("2021-01-04T13:00:00"), end: new Date("2021-01-04T14:15:00")}, {start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}]);
        // same as above but we're calling on monday morning so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-04T00:00:00"))).toEqual([{start: new Date("2021-01-04T13:00:00"), end: new Date("2021-01-04T14:15:00")}, {start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}]);
        // same as above but we're calling on monday evening so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-04T23:00:00"))).toEqual([{start: new Date("2021-01-04T13:00:00"), end: new Date("2021-01-04T14:15:00")}, {start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}]);
        // same as above but we're calling on tuesday morning so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-05T00:00:00"))).toEqual([{start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}, {start: new Date("2021-01-18T13:00:00"), end: new Date("2021-01-18T14:15:00")}]);
        // same as above but we're calling on wednesday morning so we should get different results
        expect(getOccurrences(section, new Date("2021-01-06T00:00:00"))).toEqual([{start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}, {start: new Date("2021-01-18T13:00:00"), end: new Date("2021-01-18T14:15:00")}]);
        // same as above but we're calling on wednesday during class so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-06T13:30:00"))).toEqual([{start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}, {start: new Date("2021-01-18T13:00:00"), end: new Date("2021-01-18T14:15:00")}]);
        // same as above but we're calling on wednesday evening so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-06T23:00:00"))).toEqual([{start: new Date("2021-01-06T13:00:00"), end: new Date("2021-01-06T14:15:00")}, {start: new Date("2021-01-11T13:00:00"), end: new Date("2021-01-11T14:15:00")}, {start: new Date("2021-01-13T13:00:00"), end: new Date("2021-01-13T14:15:00")}, {start: new Date("2021-01-18T13:00:00"), end: new Date("2021-01-18T14:15:00")}]);
    });

    test("nextMeeting", () => {
        const noMeetingCourse = {section: {days: {type: DAYS_TYPES.NONE}}};
        expect(nextMeeting(noMeetingCourse)).toBeNull();
        expect(nextMeeting({section: {days: {type: DAYS_TYPES.NONE}}}, new Date("2021-01-01T00:00:00"))).toBeNull();

        const oneOffCourse = {section: {days: {type: DAYS_TYPES.ONCE, when: "2021-01-01"}, time: {start: "1:00pm", end: "2:15pm"}}};
        const oneOffStart = new Date("2021-01-01T13:00:00");
        // nothing for a one-off in the past
        expect(nextMeeting(oneOffCourse)).toBeNull();
        // one-off later today
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T00:00:00"))).toEqual(oneOffStart);
        // one-off right now
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T13:00:00"))).toEqual(oneOffStart);
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T13:15:00"))).toEqual(oneOffStart);
        // one-off earlier today
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T14:15:01"))).toBeNull();
        // one-off with tolerance
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T14:30:00"), tolerance)).toEqual(oneOffStart);
        expect(nextMeeting(oneOffCourse, new Date("2021-01-01T14:30:01"), tolerance)).toEqual(null);

        const recurringCourse = {section: {days: {type: DAYS_TYPES.RECURRING, when: ["Monday", "Wednesday", "Friday"]}, time: {start: "11:00am", end: "12:15pm"}}};
        const recurringStartFri = new Date("2021-01-01T11:00:00");
        const recurringStartMon = new Date("2021-01-04T11:00:00");
        const recurringStartWed = new Date("2021-01-06T11:00:00");
        const recurringStartNextFri = new Date("2021-01-08T11:00:00");
        // recurring later today
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T00:00:00"))).toEqual(recurringStartFri);
        // recurring right now
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T11:00:00"))).toEqual(recurringStartFri);
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T11:15:00"))).toEqual(recurringStartFri);
        // recurring earlier today
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T12:15:01"))).toEqual(recurringStartMon);
        // recurring with tolerance
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T12:30:00"), tolerance)).toEqual(recurringStartFri);
        expect(nextMeeting(recurringCourse, new Date("2021-01-01T12:30:01"), tolerance)).toEqual(recurringStartMon);
        // recurring later this week
        expect(nextMeeting(recurringCourse, new Date("2021-01-04T00:00:00"))).toEqual(recurringStartMon);
        expect(nextMeeting(recurringCourse, new Date("2021-01-04T12:30:01"))).toEqual(recurringStartWed);
        expect(nextMeeting(recurringCourse, new Date("2021-01-06T12:30:01"))).toEqual(recurringStartNextFri);
    });
});
