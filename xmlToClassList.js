import {XMLParser} from 'fast-xml-parser';
import {readFileSync} from 'fs';
import {load} from 'cheerio';

const parser = new XMLParser();

const xmlToClassList = xml => {
    const parsed = parser.parse(xml);

    const mainField = parsed.PAGE.FIELD.join("\n");


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
};

console.log(xmlToClassList(readFileSync("acts.xml", "utf8")));
