// what i need to do: weird cartesian product of location, date, and time for duplicate sections that meet in different locations and/or different times and or different dates.
//     use Set()

import {load} from "cheerio";
import {tdsToSectionObjects} from "./tdsToSectionObjects.js";
import {fetchWithCache} from "../fetchWithCache.js";
import {fetchPrefix} from "./fetchPrefix.js";

// TODO
const term = "term_23s";


// TODO: grab cookie from here

async function fetchAllSections() {
    const mainPage = await fetchWithCache("https://coursebook.utdallas.edu/");
    const $ = load(mainPage);

    let results = [];
    const prexfixOpts = Array.from($("#combobox_cp option")).map(x => x.attribs.value);
    for (const prefixOpt of prexfixOpts) {
        if (!prefixOpt) continue;
        // if (prefixOpt === "cp_econ") break;// TODO: remove


        const parsedResponse = await fetchPrefix(prefixOpt, term);
        if (parsedResponse.sethtml["#searchresults"].includes("(no items found)")) {
            console.log("0 results for prefix", prefixOpt);
            continue;
        }

        const expectedNumResults = parseInt(/\(([0-9]+) items\)/.exec(parsedResponse.sethtml["#searchresults"])[1]);
        console.log("Expecting " + expectedNumResults + " results");

        if (expectedNumResults >= 300) {
            throw new Error("too many results");
        }

        const $results = load(parsedResponse.sethtml["#sr"]);
        const rows = $results("tbody tr");
        if (rows.length !== expectedNumResults) {
            throw new Error("expected " + expectedNumResults + " results, got " + rows.length);
        }
        rows.each((i, el) => {
            const $el = $results(el);
            const $tds = Array.from($el.find("td"));

            const sectionObjects = tdsToSectionObjects($tds);
            results = results.concat(sectionObjects);
        });
    }
    return results;
}
console.log([...new Set((await fetchAllSections()).map(x => x.section.location).filter(Boolean).map(x => JSON.stringify(x)))].sort().join("\n"));
