import {describe, expect, test} from "@jest/globals";
import {timeToComponents} from "../lib/findRooms/nextMeeting.js";

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
});
