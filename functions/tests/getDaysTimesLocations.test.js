import {describe, expect, test} from "@jest/globals";
import getDaysTimesLocations from "../lib/coursebook/parse/getDaysTimesLocations.js";

describe("getDaysTimesLocations", () => {
    test("simple no location", () => {
        expect(getDaysTimesLocations([ "(Hybrid)" ])).toStrictEqual([]);
        expect(getDaysTimesLocations([ "Master's Thesis" ])).toStrictEqual([]);
        expect(getDaysTimesLocations([ "Combined Lec/Lab no Fee" ])).toStrictEqual([]);
        expect(getDaysTimesLocations([ "No Meeting Room" ])).toStrictEqual([]);
        expect(getDaysTimesLocations([ "Seminar" ])).toStrictEqual([]);
        expect(getDaysTimesLocations([ "Exam" ])).toStrictEqual([]);
    });

    test("simple / 3 rows", () => {
        expect(getDaysTimesLocations([ "Tuesday", "4:00pm - 6:45pm", "JO 4.122" ])).toStrictEqual([{days: "Tuesday", times: "4:00pm - 6:45pm", location: "JO 4.122"}]);
        expect(getDaysTimesLocations([ "Monday & Wednesday", "2:30pm - 3:45pm", "GR 4.204" ])).toStrictEqual([{days: "Monday & Wednesday", times: "2:30pm - 3:45pm", location: "GR 4.204"}]);
        expect(getDaysTimesLocations([ "Monday, Wednesday & Friday", "7:00pm - 9:45pm", "Blackstone Launchpad" ])).toStrictEqual([{days: "Monday, Wednesday & Friday", times: "7:00pm - 9:45pm", location: "Blackstone Launchpad"}]);
    });

    test("day and time no location", () => {
       expect(getDaysTimesLocations([ "Monday, Wednesday & Friday", "7:00pm - 9:45pm" ])).toStrictEqual([]);
    });

    test("getDaysTimesLocations doubled up", () => {
        expect(getDaysTimesLocations([
            'Tuesday & Thursday',
            '11:30am - 12:45pm',
            'ECSW 2.210',
            'Tuesday & Thursday',
            '11:30am - 12:45pm',
            'ECSW 2.250'
        ])).toStrictEqual([{days: "Tuesday & Thursday", times: "11:30am - 12:45pm", location: "ECSW 2.210"}, {days: "Tuesday & Thursday", times: "11:30am - 12:45pm", location: "ECSW 2.250"}]);
        expect(getDaysTimesLocations([
            'Tuesday',
            '7:00pm - 8:15pm',
            'FO 2.702',
            'Monday & Wednesday',
            '7:00pm - 8:15pm',
            'FO 2.702'
        ])).toStrictEqual([{days: "Tuesday", times: "7:00pm - 8:15pm", location: "FO 2.702"}, {days: "Monday & Wednesday", times: "7:00pm - 8:15pm", location: "FO 2.702"}]);
        expect(getDaysTimesLocations([
            'Tuesday & Thursday',
            '11:30am - 12:45pm',
            'GR 3.402A',
            'Tuesday & Thursday',
            '11:30am - 12:45pm',
            'GR 3.402B'
        ])).toStrictEqual([{days: "Tuesday & Thursday", times: "11:30am - 12:45pm", location: "GR 3.402A"}, {days: "Tuesday & Thursday", times: "11:30am - 12:45pm", location: "GR 3.402B"}]);
    });

    test("normal location + exam", () => {
        expect(getDaysTimesLocations([
            'Tuesday',
            '1:00pm - 3:45pm',
            'JSOM 1.212',
            '2022-09-24 Saturday',
            '10:00am - 1:00pm',
            '2022-10-22 Saturday',
            '10:00am - 1:00pm',
            '2022-12-03 Saturday',
            '10:00am - 1:00pm'
        ])).toStrictEqual([{days: "Tuesday", times: "1:00pm - 3:45pm", location: "JSOM 1.212"}, {days: "2022-09-24 Saturday", times: "10:00am - 1:00pm", location: "JSOM 1.212"}, {days: "2022-10-22 Saturday", times: "10:00am - 1:00pm", location: "JSOM 1.212"}, {days: "2022-12-03 Saturday", times: "10:00am - 1:00pm", location: "JSOM 1.212"}]);
    });

    test("big no location", () => {
        expect(getDaysTimesLocations([
            'Common Exam',
            'See instructor for room assignment',
            'See instructor for room assignment',
            'See instructor for room assignment',
            'See instructor for room assignment'
        ])).toStrictEqual([]);
        expect(getDaysTimesLocations([
            'No Meeting Room',
            '2022-09-24 Saturday',
            '10:00am - 1:00pm',
            '2022-10-22 Saturday',
            '10:00am - 1:00pm',
            '2022-12-03 Saturday',
            '10:00am - 1:00pm'
        ])).toStrictEqual([]);
        expect(getDaysTimesLocations([
            '2022-09-24 Saturday',
            '10:00am - 1:00pm',
            'No Meeting Room'
        ])).toStrictEqual([]);
        expect(getDaysTimesLocations(['2022-09-17 Saturday', '10:00am - 11:30am', '2022-10-08 Saturday', '10:00am - 11:30am', '2022-10-29 Saturday', '10:00am - 11:30am', '2022-12-03 Saturday', '10:00am - 11:30am'])).toStrictEqual([]);
        expect(getDaysTimesLocations( [
            '2023-02-14 Tuesday',
            '7:00am - 7:00am',
            'No Meeting Room',
            '2023-03-07 Tuesday',
            '7:00am - 7:00am',
            'No Meeting Room',
            '2023-04-04 Tuesday',
            '7:00am - 7:00am',
            'No Meeting Room',
            '2023-04-25 Tuesday',
            '7:00am - 7:00am',
            'No Meeting Room'
        ])).toStrictEqual([]);
    });

    test("throws on invalid", () => {
        expect(() => getDaysTimesLocations([ "Tuesday", "4:00pm - 6:45pm", "JO 4.122", "Tuesday", "4:00pm - 6:45pm", "Tuesday" ])).toThrow();
    })
});
