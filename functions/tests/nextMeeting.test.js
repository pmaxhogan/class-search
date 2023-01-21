import {describe, expect, test} from "@jest/globals";
import {
    absoluteDayTimeToDate, getOccurrences,
    nextDay, nextMeetings,
    nextMeetingOfOccurrence, relativeDayTimeToDate, sortDatePairs,
    timeToComponents
} from "../lib/findRooms/nextMeetings.js";
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
        expect(relativeDayTimeToDate("Friday", "1:00pm", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-02T01:00:00.000Z"));
        expect(relativeDayTimeToDate("Friday", "1:00am", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T13:00:00.000Z"));
        expect(relativeDayTimeToDate("Friday", "2:23pm", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-02T02:23:00.000Z"));
        expect(relativeDayTimeToDate("Friday", "2:23am", new Date("2021-01-01T00:00:00"))).toEqual(new Date("2021-01-01T14:23:00.000Z"));
        expect(relativeDayTimeToDate("Friday", "11:00am", new Date("2021-01-01T13:00:00"))).toEqual(new Date("2021-01-01T23:00:00.000Z"));
    });

    test("sortDatePairs", () => {
        expect(sortDatePairs([])).toEqual([]);
        expect(sortDatePairs([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}])).toEqual([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}]);
        expect(sortDatePairs([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}, {start: new Date("2021-01-01T01:00:00"), end: new Date("2021-01-01T02:00:00")}])).toEqual([{start: new Date("2021-01-01T00:00:00"), end: new Date("2021-01-01T01:00:00")}, {start: new Date("2021-01-01T01:00:00"), end: new Date("2021-01-01T02:00:00")}]);
    })

    test("getOccurrences", () => {
        const section = {days: {when: ["Monday", "Wednesday"]}, time: {start: "1:00pm", end: "2:15pm"}};

        // once a week, returns next Monday & the following Monday
        expect(getOccurrences({days: {when: ["Monday"]}, time: {start: "1:00pm", end: "2:15pm"}}, new Date("2021-01-01T00:00:00"))).toEqual([{start: new Date("2021-01-05T01:00:00.000Z"), end: new Date("2021-01-05T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}]);
        // monday & wednesday, returns next Monday & Wednesday & the following Monday & Wednesday
        expect(getOccurrences(section, new Date("2021-01-01T00:00:00"))).toEqual([{start: new Date("2021-01-05T01:00:00.000Z"), end: new Date("2021-01-05T02:15:00.000Z")}, {start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}]);
        // same as above but we're calling on monday morning so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-04T00:00:00"))).toEqual([{start: new Date("2021-01-05T01:00:00.000Z"), end: new Date("2021-01-05T02:15:00.000Z")}, {start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}]);
        // same as above but we're calling on monday evening so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-04T23:00:00"))).toEqual([{start: new Date("2021-01-05T01:00:00.000Z"), end: new Date("2021-01-05T02:15:00.000Z")}, {start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}]);
        // same as above but we're calling on tuesday morning so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-05T00:00:00"))).toEqual([{start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}, {start: new Date("2021-01-19T01:00:00.000Z"), end: new Date("2021-01-19T02:15:00.000Z")}]);
        // same as above but we're calling on wednesday morning so we should get different results
        expect(getOccurrences(section, new Date("2021-01-06T00:00:00"))).toEqual([{start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}, {start: new Date("2021-01-19T01:00:00.000Z"), end: new Date("2021-01-19T02:15:00.000Z")}]);
        // same as above but we're calling on wednesday during class so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-06T13:30:00"))).toEqual([{start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}, {start: new Date("2021-01-19T01:00:00.000Z"), end: new Date("2021-01-19T02:15:00.000Z")}]);
        // same as above but we're calling on wednesday evening so we should get the same results
        expect(getOccurrences(section, new Date("2021-01-06T23:00:00"))).toEqual([{start: new Date("2021-01-07T01:00:00.000Z"), end: new Date("2021-01-07T02:15:00.000Z")}, {start: new Date("2021-01-12T01:00:00.000Z"), end: new Date("2021-01-12T02:15:00.000Z")}, {start: new Date("2021-01-14T01:00:00.000Z"), end: new Date("2021-01-14T02:15:00.000Z")}, {start: new Date("2021-01-19T01:00:00.000Z"), end: new Date("2021-01-19T02:15:00.000Z")}]);
    });

    test("nextMeeting", () => {
        const noMeetingCourse = {section: {days: {type: DAYS_TYPES.NONE}}};
        expect(nextMeetings(noMeetingCourse)[0]).toBeNull();
        expect(nextMeetings({section: {days: {type: DAYS_TYPES.NONE}}}, new Date("2021-01-01T00:00:00"))[0]).toBeNull();

        const oneOffCourse = {section: {days: {type: DAYS_TYPES.ONCE, when: "2021-01-01"}, time: {start: "1:00pm", end: "2:15pm"}}};
        const oneOffStart = new Date("2021-01-01T13:00:00");
        // nothing for a one-off in the past
        expect(nextMeetings(oneOffCourse)[0]).toBeNull();
        // one-off later today
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T00:00:00"))[0]).toEqual(oneOffStart);
        // one-off right now
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T13:00:00"))[0]).toEqual(oneOffStart);
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T13:15:00"))[0]).toEqual(oneOffStart);
        // one-off earlier today
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T14:15:01"))[0]).toBeNull();
        // one-off with tolerance
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T14:30:00"), tolerance)[0]).toEqual(oneOffStart);
        expect(nextMeetings(oneOffCourse, new Date("2021-01-01T14:30:01"), tolerance)[0]).toEqual(null);

        const recurringCourse = {section: {days: {type: DAYS_TYPES.RECURRING, when: ["Monday", "Wednesday", "Friday"]}, time: {start: "11:00am", end: "12:15pm"}}};
        const recurringStartFri = new Date("2021-01-01T17:00:00");
        const recurringStartMon = new Date("2021-01-04T17:00:00");
        const recurringStartWed = new Date("2021-01-06T17:00:00");
        const recurringStartNextFri = new Date("2021-01-08T17:00:00");
        // recurring later today
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T00:00:00"))[0]).toEqual(recurringStartFri);
        // recurring right now
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T11:00:00"))[0]).toEqual(recurringStartFri);
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T11:15:00"))[0]).toEqual(recurringStartFri);
        // recurring earlier today
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T18:15:01"))[0]).toEqual(recurringStartMon);
        // recurring with tolerance
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T18:30:00"), tolerance)[0]).toEqual(recurringStartFri);
        expect(nextMeetings(recurringCourse, new Date("2021-01-01T18:30:01"), tolerance)[0]).toEqual(recurringStartMon);
        // recurring later this week
        expect(nextMeetings(recurringCourse, new Date("2021-01-04T00:00:00"))[0]).toEqual(recurringStartMon);
        expect(nextMeetings(recurringCourse, new Date("2021-01-04T18:30:01"))[0]).toEqual(recurringStartWed);
        expect(nextMeetings(recurringCourse, new Date("2021-01-06T18:30:01"))[0]).toEqual(recurringStartNextFri);

        expect(() => nextMeetings({section: {days: {type: "INVALID"}}}, new Date())[0]).toThrow();
    });
});
