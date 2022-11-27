// what i need to do: weird cartesian product of location, date, and time for duplicate sections that meet in different locations and/or different times and or different dates.
//     use Set()

import {load} from "cheerio";
import fetch from "node-fetch";
import {tdsToSectionObjects} from "./tdsToSectionObjects.js";
import {fetchWithCache} from "../fetchWithCache.js";
import {fetchPrefix} from "./fetchPrefix.js";
import {gradLevels} from "../consts.js";
import {writeFileSync} from "fs";

// TODO
const term = "term_22f";

async function fetchSection(prefixOpt, term, gradLevel = null) {
    if (!prefixOpt) return;

    const parsedResponse = await fetchPrefix(prefixOpt, term, gradLevel);
    if (parsedResponse.sethtml["#searchresults"].includes("(no items found)")) {
        console.log("0 results for prefix", prefixOpt);
        return;
    }

    if(parsedResponse.sethtml["#searchresults"].includes("please refine search")) {
        console.log("refine search for prefix", prefixOpt);
        const undergradResults = await fetchSection(prefixOpt, term, gradLevels.undergraduate);
        const gradResults = await fetchSection(prefixOpt, term, gradLevels.graduate);
        return undergradResults.concat(gradResults);
    }

    const expectedNumResults = parseInt(/\(([0-9]+) items?\)/.exec(parsedResponse.sethtml["#searchresults"])[1]);
    console.log("Expecting " + expectedNumResults + " results");

    if (expectedNumResults >= 300) {
        throw new Error("too many results");
    }

    const $results = load(parsedResponse.sethtml["#sr"]);
    const rows = $results("tbody tr");

    let results = [];
    if (rows.length !== expectedNumResults) {
        throw new Error("expected " + expectedNumResults + " results, got " + rows.length);
    }
    rows.each((i, el) => {
        const $el = $results(el);
        const $tds = Array.from($el.find("td"));

        const sectionObjects = tdsToSectionObjects($tds, prefixOpt.split("_")[1].toUpperCase());
        results = results.concat(sectionObjects);
    });
    return results;
}

async function fetchAllSections() {
    const mainPageReq = await fetch("https://coursebook.utdallas.edu/");
    console.log(mainPageReq.headers.get('set-cookie'));

    const mainPage = await mainPageReq.text();
    const $ = load(mainPage);

    let results = [];
    const prexfixOpts = Array.from($("#combobox_cp option")).map(x => x.attribs.value);
    for (const prefixOpt of prexfixOpts) {
        const newResults = await fetchSection(prefixOpt, term) || [];
        console.log("Got " + newResults.length + " results for prefix " + prefixOpt);
        results = results.concat(newResults);
    }
    return results;
}

const allSections = await fetchAllSections();
// console.log([...new Set((allSections).map(x => x).filter(Boolean).map(x => JSON.stringify(x)))].sort().join("\n"));
writeFileSync("allSections.json.txt", allSections.map(section => JSON.stringify(section)).join("\n"));
