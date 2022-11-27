import {fetchPrefix} from "../fetchPrefix.js";
import {gradLevels} from "../../consts.js";
import {load} from "cheerio";
import {tdsToSectionObjects} from "../parse/tdsToSectionObjects.js";

export async function fetchSectionsInPrefix(prefixOpt, term, gradLevel = null) {
    if (!prefixOpt) return;

    const parsedResponse = await fetchPrefix(prefixOpt, term, gradLevel);
    if (parsedResponse.sethtml["#searchresults"].includes("(no items found)")) {
        console.log("0 results for prefix", prefixOpt);
        return;
    }

    if (parsedResponse.sethtml["#searchresults"].includes("please refine search")) {
        console.log("refine search for prefix", prefixOpt);
        const undergradResults = await fetchSectionsInPrefix(prefixOpt, term, gradLevels.undergraduate);
        const gradResults = await fetchSectionsInPrefix(prefixOpt, term, gradLevels.graduate);
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
