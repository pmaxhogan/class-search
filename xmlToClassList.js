import {XMLParser} from 'fast-xml-parser';
import {readFileSync} from 'fs';
import {load} from 'cheerio';
import {strict as assert} from "node:assert";
import * as fs from "fs";

const parser = new XMLParser();

export class ICStateStaleError extends Error {
    constructor (message) {
        super(message)
        Error.captureStackTrace(this, this.constructor);
    }
}

export function xmlToClassList (xml) {
    fs.writeFileSync("acts3.xml", xml);
    const parsed = parser.parse(xml);
    const mainField = parsed.PAGE.FIELD.join("\n");
    const parsedAgain = parser.parse(mainField);

    const icStateStale = !parsedAgain.table.tr.td.DIV;
    const icStateStale2 = parsedAgain?.table?.tr?.td?.table?.tr[0]?.td === "This page is no longer available.";
    assert.equal(icStateStale, icStateStale2, "icStateStale and icStateStale2 should be equal");

    if (icStateStale) {
        throw new ICStateStaleError(`Failed to parse XML because ic state is stale`);
    }

    const $ = load(mainField);
    const numSectionsText = $(".PSGROUPBOXLABEL").text();
    const predictedNumSections = parseInt(numSectionsText.split(" ")[0]);
    const sectionTables = $("#ACE_SSR_CLSRSLT_WRK_GROUPBOX1 .PSLEVEL1GRIDNBONBO");

    if (sectionTables.length !== predictedNumSections) {
        throw new Error(`Number of sections does not match ${sectionTables.length} !== ${predictedNumSections}`);
    }

    return Array.from(sectionTables).map((elem) => {
        const dataRow = load(elem)("tr")[1];
        const dataRowCells = load(dataRow)("td");
        let [classNum, section, daysAndTimes, room, instructor, meetingDates] = Array.from(dataRowCells).map(x => load(x).text().trim());

        return {classNum, section, daysAndTimes, room, instructor, meetingDates};
    });
}

export function isUnauthenticated(xml){
    const parsed = parser.parse(xml);
    return parsed.html.head.title === "UT Dallas SSO Login";
}

// console.log(xmlToClassList(readFileSync("acts.stale.xml", "utf8")));
